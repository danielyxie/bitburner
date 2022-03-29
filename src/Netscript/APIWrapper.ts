import { getRamCost } from "./RamCostGenerator";
import type { IPort } from "../NetscriptPort";
import type { BaseServer } from "../Server/BaseServer";
import type { WorkerScript } from "./WorkerScript";
import { makeRuntimeRejectMsg } from "../NetscriptEvaluator";
import { Player } from "../Player";


// type TargetFn<T> = (...args: [T, ...any[]]) => Promise<any>;
// type WrappedFn<F> = F extends (a: infer A1, ...args: infer U) => Promise<infer R> ? (a: A1|A1[], ...args: U) => Promise<R> : unknown;
// Need to think more about how to get these types to work
type InternalNetscriptFunction = (ctx: NetscriptContext, ...args: unknown[]) => unknown;
type WrappedNetscriptFunction = (...args: unknown[]) => unknown;
export type InternalNetscriptAPI = {
  [string: string]: InternalNetscriptAPI | InternalNetscriptFunction;
}
export type WrappedNetscriptAPI = {
  [string: string]: WrappedNetscriptAPI | WrappedNetscriptFunction;
}

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
  boolean: (v: unknown) => boolean;
  getServer: (hostname: string, callingFnName: string) => BaseServer;
  checkSingularityAccess: (func: string) => void;
  hack: (hostname: any, manual: any, { threads: requestedThreads, stock }?: any) => Promise<number>;
  getValidPort: (funcName: string, port: any) => IPort;
}

type WrappedNetscriptHelpers = {
  updateDynamicRam: (ramCost: number) => void;
  makeRuntimeErrorMsg: (msg: string) => string;
  string: (argName: string, v: unknown) => string;
  number: (argName: string, v: unknown) => number;
  boolean: (v: unknown) => boolean;
  getServer: (hostname: string)=> BaseServer;
  checkSingularityAccess: () => void;
  hack: (hostname: any, manual: any, { threads: requestedThreads, stock }?: any) => Promise<number>;
  getValidPort: (port: any) => IPort;
}

function wrapFunction<T>(helpers: NetscriptHelpers, wrappedAPI: any, workerScript: WorkerScript, func: (ctx: NetscriptContext, ...args: unknown[]) => T, ...tree: string[]): void {
  const functionName = tree.pop();
  if (typeof functionName !== 'string') {
    throw makeRuntimeRejectMsg(workerScript, 'Failure occured while wrapping netscript api');
  }
  const ctx = {
    makeRuntimeErrorMsg: (message: string) => { return helpers.makeRuntimeErrorMsg(functionName, message); },
    log: (message: () => string) => { workerScript.log(functionName, message); },
    workerScript,
    function: functionName,
    helper: {
      updateDynamicRam: (ramCost: number) => helpers.updateDynamicRam(functionName, ramCost),
      makeRuntimeErrorMsg: (msg: string) => helpers.makeRuntimeErrorMsg(functionName, msg),
      string: (argName: string, v: unknown) => helpers.string(functionName, argName, v),
      number: (argName: string, v: unknown) => helpers.number(functionName, argName, v),
      boolean: helpers.boolean,
      getServer: (hostname: string) => helpers.getServer(hostname, functionName),
      checkSingularityAccess: () => helpers.checkSingularityAccess(functionName),
      hack: helpers.hack,
      getValidPort: (port: any) => helpers.getValidPort(functionName, port)
    }
  };
  function wrappedFunction(...args: unknown[]): T {
    helpers.updateDynamicRam(ctx.function, getRamCost(Player, ...tree, ctx.function));
    return func(ctx, ...args);
  }
  const parent = getNestedProperty(wrappedAPI, ...tree);
  Object.defineProperty(parent, functionName, {
    value: wrappedFunction,
    writable: true
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function wrapAPI(helpers: NetscriptHelpers, wrappedAPI: any, workerScript: WorkerScript, namespace: any, ...tree: string[]): WrappedNetscriptAPI {
  if (typeof namespace !== 'object') throw new Error('Invalid namespace?');
  for (const property of Object.getOwnPropertyNames(namespace)) {
    switch (typeof namespace[property]) {
      case 'function': {
        wrapFunction(helpers, wrappedAPI, workerScript, namespace[property], ...tree, property);
        break;
      }
      case 'object': {
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
  if (typeof key !== 'string') {
    throw new Error('Failure occured while wrapping netscript api (setNestedProperty)')
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
