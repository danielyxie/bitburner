import { getRamCost } from "./RamCostGenerator";
import type { IPort } from "../NetscriptPort";
import type { BaseServer } from "../Server/BaseServer";
import type { WorkerScript } from "./WorkerScript";
import { makeRuntimeRejectMsg } from "../NetscriptEvaluator";
import { Player } from "../Player";
import { CityName } from "../Locations/data/CityNames";
import { BasicHGWOptions } from "../ScriptEditor/NetscriptDefinitions";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Server } from "../Server/Server";
import { FormulaGang } from "../Gang/formulas/formulas";
import { INetscriptHelper, ScriptIdentifier } from "../NetscriptFunctions/INetscriptHelper";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";
import { ScriptArg } from "./ScriptArg";
import { ScriptDeath } from "./ScriptDeath";
import { sprintf } from "sprintf-js";

type ExternalFunction = (...args: unknown[]) => unknown;
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

type WrappedNetscriptHelpers = {
  makeRuntimeErrorMsg: (msg: string) => string;
  string: (argName: string, v: unknown) => string;
  number: (argName: string, v: unknown) => number;
  ustring: (argName: string, v: unknown) => string | undefined;
  unumber: (argName: string, v: unknown) => number | undefined;
  scriptArgs(args: unknown): ScriptArg[];
  scriptIdentifier: (fn: unknown, hostname: unknown, args: unknown) => ScriptIdentifier;
  city: (argName: string, v: unknown) => CityName;
  boolean: (v: unknown) => boolean;
  getServer: (hostname: string) => BaseServer;
  checkSingularityAccess: () => void;
  hack: (hostname: string, manual: boolean, { threads: requestedThreads, stock }?: BasicHGWOptions) => Promise<number>;
  getValidPort: (port: number) => IPort;
  player(p: unknown): IPlayer;
  server(s: unknown): Server;
  gang(g: unknown): FormulaGang;
  gangMember: (m: unknown) => GangMember;
  gangTask: (t: unknown) => GangMemberTask;
};

function checkEnv(ctx: NetscriptContext) {
  if (ctx.workerScript.env.stopFlag) throw new ScriptDeath(ctx.workerScript);
  if (ctx.workerScript.env.runningFn && ctx.function !== "asleep") {
    if (ctx.workerScript.delayReject) ctx.workerScript.delayReject();
    const msg =
      "Concurrent calls to Netscript functions are not allowed!\n" +
      "Did you forget to await hack(), grow(), or some other\n" +
      "promise-returning function? (Currently running: %s tried to run: %s)";
    ctx.workerScript.errorMessage = makeRuntimeRejectMsg(
      ctx.workerScript,
      sprintf(msg, ctx.workerScript.env.runningFn, ctx.function),
    );
    throw new ScriptDeath(ctx.workerScript);
  }
}

function wrapFunction(
  helpers: INetscriptHelper,
  wrappedAPI: ExternalAPI,
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
      ustring: (argName: string, v: unknown) => helpers.ustring(functionPath, argName, v),
      unumber: (argName: string, v: unknown) => helpers.unumber(functionPath, argName, v),
      scriptArgs: (v: unknown) => helpers.scriptArgs(functionPath, v),
      scriptIdentifier: (fn: unknown, hostname: unknown, args: unknown) =>
        helpers.scriptIdentifier(functionPath, fn, hostname, args),
      city: (argName: string, v: unknown) => helpers.city(functionPath, argName, v),
      boolean: helpers.boolean,
      getServer: (hostname: string) => helpers.getServer(hostname, ctx),
      checkSingularityAccess: () => helpers.checkSingularityAccess(functionName),
      hack: (hostname: string, manual: boolean, extra?: BasicHGWOptions) => helpers.hack(ctx, hostname, manual, extra),
      getValidPort: (port: number) => helpers.getValidPort(functionPath, port),
      player: (p: unknown) => helpers.player(functionPath, p),
      server: (s: unknown) => helpers.server(functionPath, s),
      gang: (g: unknown) => helpers.gang(functionPath, g),
      gangMember: (m: unknown) => helpers.gangMember(functionPath, m),
      gangTask: (t: unknown) => helpers.gangTask(functionPath, t),
    },
  };
  function wrappedFunction(...args: unknown[]): unknown {
    checkEnv(ctx);
    helpers.updateDynamicRam(ctx.function, getRamCost(Player, ...tree, ctx.function));
    return func(ctx)(...args);
  }
  const parent = getNestedProperty(wrappedAPI, tree);
  Object.defineProperty(parent, functionName, {
    value: wrappedFunction,
    writable: true,
    enumerable: true,
  });
}

export function wrapAPI(
  helpers: INetscriptHelper,
  wrappedAPI: ExternalAPI,
  workerScript: WorkerScript,
  namespace: object,
  ...tree: string[]
): WrappedNetscriptAPI {
  for (const [key, value] of Object.entries(namespace)) {
    if (typeof value === "function") {
      wrapFunction(helpers, wrappedAPI, workerScript, value, ...tree, key);
    } else if (Array.isArray(value)) {
      setNestedProperty(wrappedAPI, value.slice(), key);
    } else if (typeof value === "object") {
      wrapAPI(helpers, wrappedAPI, workerScript, value, ...tree, key);
    } else {
      setNestedProperty(wrappedAPI, value, ...tree, key);
    }
  }
  return wrappedAPI;
}

function setNestedProperty(root: any, value: unknown, ...tree: string[]): void {
  let target = root;
  const key = tree.pop();
  if (!key) throw new Error("Failure occured while wrapping netscript api (setNestedProperty)");
  for (const branch of tree) {
    target[branch] ??= {};
    target = target[branch];
  }
  target[key] = value;
}

function getNestedProperty(root: any, tree: string[]): unknown {
  let target = root;
  for (const branch of tree) {
    target[branch] ??= {};
    target = target[branch];
  }
  return target;
}
