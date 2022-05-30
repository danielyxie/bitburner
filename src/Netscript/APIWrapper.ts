import { getRamCost } from "./RamCostGenerator";
import type { IPort } from "../NetscriptPort";
import type { BaseServer } from "../Server/BaseServer";
import type { WorkerScript } from "./WorkerScript";
import { makeRuntimeRejectMsg } from "../NetscriptEvaluator";
import { Player } from "../Player";
import { CityName } from "src/Locations/data/CityNames";

type ExternalFunction = (...args: any[]) => any;
export type ExternalAPI = {
  [string: string]: ExternalAPI | ExternalFunction;
};

type InternalFunction<F extends (...args: unknown[]) => unknown> = (ctx: NetscriptContext) => F;

export type InternalAPI<API> = {
  [Property in keyof API]: API[Property] extends ExternalFunction
    ? InternalFunction<API[Property]>
    : API[Property] extends object
    ? InternalAPI<API[Property]>
    : never;
};

type WrappedNetscriptFunction = (...args: unknown[]) => unknown;
type WrappedNetscriptAPI = {
  readonly [string: string]: WrappedNetscriptAPI | WrappedNetscriptFunction;
};

export type NetscriptContext = {
  makeRuntimeErrorMsg: (message: string) => string;
  log: (message: () => string) => void;
  workerScript: WorkerScript;
  function: string;
  helper: WrappedNetscriptHelpers;
};

type NetscriptHelpers = {
  updateDynamicRam: (fnName: string, ramCost: number) => void;
  makeRuntimeErrorMsg: (caller: string, msg: string) => string;
  string: (funcName: string, argName: string, v: unknown) => string;
  number: (funcName: string, argName: string, v: unknown) => number;
  city: (funcName: string, argName: string, v: unknown) => CityName;
  boolean: (v: unknown) => boolean;
  getServer: (hostname: string, ctx: NetscriptContext) => BaseServer;
  checkSingularityAccess: (func: string) => void;
  hack: (
    ctx: NetscriptContext,
    hostname: any,
    manual: any,
    { threads: requestedThreads, stock }?: any,
  ) => Promise<number>;
  getValidPort: (funcName: string, port: any) => IPort;
};

type WrappedNetscriptHelpers = {
  makeRuntimeErrorMsg: (msg: string) => string;
  string: (argName: string, v: unknown) => string;
  number: (argName: string, v: unknown) => number;
  city: (argName: string, v: unknown) => CityName;
  boolean: (v: unknown) => boolean;
  getServer: (hostname: string) => BaseServer;
  checkSingularityAccess: () => void;
  hack: (hostname: any, manual: any, { threads: requestedThreads, stock }?: any) => Promise<number>;
  getValidPort: (port: any) => IPort;
};

function wrapFunction(
  helpers: NetscriptHelpers,
  wrappedAPI: any,
  workerScript: WorkerScript,
  func: (_ctx: NetscriptContext) => (...args: unknown[]) => unknown,
  ...tree: string[]
): void {
  const functionPath = tree.join(".");
  const functionName = tree.pop();
  if (typeof functionName !== "string") {
    throw makeRuntimeRejectMsg(workerScript, "Failure occured while wrapping netscript api");
  }
  const ctx = {
    makeRuntimeErrorMsg: (message: string) => {
      return helpers.makeRuntimeErrorMsg(functionPath, message);
    },
    log: (message: () => string) => {
      workerScript.log(functionPath, message);
    },
    workerScript,
    function: functionName,
    helper: {
      makeRuntimeErrorMsg: (msg: string) => helpers.makeRuntimeErrorMsg(functionPath, msg),
      string: (argName: string, v: unknown) => helpers.string(functionPath, argName, v),
      number: (argName: string, v: unknown) => helpers.number(functionPath, argName, v),
      city: (argName: string, v: unknown) => helpers.city(functionPath, argName, v),
      boolean: helpers.boolean,
      getServer: (hostname: string) => helpers.getServer(hostname, ctx),
      checkSingularityAccess: () => helpers.checkSingularityAccess(functionName),
      hack: (hostname: any, manual: any, extra?: any) => helpers.hack(ctx, hostname, manual, extra),
      getValidPort: (port: any) => helpers.getValidPort(functionPath, port),
    },
  };
  function wrappedFunction(...args: unknown[]): unknown {
    helpers.updateDynamicRam(ctx.function, getRamCost(Player, ...tree, ctx.function));
    return func(ctx)(...args);
  }
  const parent = getNestedProperty(wrappedAPI, ...tree);
  Object.defineProperty(parent, functionName, {
    value: wrappedFunction,
    writable: true,
    enumerable: true,
  });
}

export function wrapAPI(
  helpers: NetscriptHelpers,
  wrappedAPI: ExternalAPI,
  workerScript: WorkerScript,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  namespace: any,
  ...tree: string[]
): WrappedNetscriptAPI {
  if (typeof namespace !== "object") throw new Error("Invalid namespace?");
  for (const property of Object.getOwnPropertyNames(namespace)) {
    switch (typeof namespace[property]) {
      case "function": {
        wrapFunction(helpers, wrappedAPI, workerScript, namespace[property], ...tree, property);
        break;
      }
      case "object": {
        wrapAPI(helpers, wrappedAPI, workerScript, namespace[property], ...tree, property);
        break;
      }
      default: {
        setNestedProperty(wrappedAPI, namespace[property], ...tree, property);
      }
    }
  }
  return wrappedAPI;
}

function setNestedProperty(root: any, value: any, ...tree: string[]): any {
  let target = root;
  const key = tree.pop();
  if (typeof key !== "string") {
    throw new Error("Failure occured while wrapping netscript api (setNestedProperty)");
  }
  for (const branch of tree) {
    if (target[branch] === undefined) {
      target[branch] = {};
    }
    target = target[branch];
  }
  target[key] = value;
}

function getNestedProperty(root: any, ...tree: string[]): any {
  let target = root;
  for (const branch of tree) {
    if (target[branch] === undefined) {
      target[branch] = {};
    }
    target = target[branch];
  }
  return target;
}
