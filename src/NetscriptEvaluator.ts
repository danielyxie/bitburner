import { isString } from "./utils/helpers/isString";
import { GetServer } from "./Server/AllServers";
import { ScriptDeath } from "./Netscript/ScriptDeath";
import { WorkerScript } from "./Netscript/WorkerScript";
import { NetscriptContext } from "./Netscript/APIWrapper";

export function netscriptDelay(time: number, workerScript: WorkerScript): Promise<void> {
  // Cancel any pre-existing netscriptDelay'ed function call
  // TODO: the rejection almost certainly ends up in the uncaught rejection handler.
  //       Maybe reject with a stack-trace'd error message?
  if (workerScript.delayReject) workerScript.delayReject();

  return new Promise(function (resolve, reject) {
    workerScript.delay = window.setTimeout(() => {
      workerScript.delay = null;
      workerScript.delayReject = undefined;
      if (workerScript.env.stopFlag) reject(new ScriptDeath(workerScript));
      else resolve();
    }, time);
    workerScript.delayReject = reject;
  });
}

export function makeRuntimeRejectMsg(workerScript: WorkerScript, msg: string): string {
  const server = GetServer(workerScript.hostname);
  if (server == null) {
    throw new Error(`WorkerScript constructed with invalid server ip: ${workerScript.hostname}`);
  }

  for (const scriptUrl of workerScript.scriptRef.dependencies) {
    // Return just the original msg if it's nullish so that we don't get a workerscript error
    msg = msg?.replace(new RegExp(scriptUrl.url, "g"), scriptUrl.filename) ?? msg;
  }

  return "|DELIMITER|" + server.hostname + "|DELIMITER|" + workerScript.name + "|DELIMITER|" + msg;
}

export function resolveNetscriptRequestedThreads(ctx: NetscriptContext, requestedThreads: number): number {
  const threads = ctx.workerScript.scriptRef.threads;
  if (!requestedThreads) {
    return isNaN(threads) || threads < 1 ? 1 : threads;
  }
  const requestedThreadsAsInt = requestedThreads | 0;
  if (isNaN(requestedThreads) || requestedThreadsAsInt < 1) {
    throw makeRuntimeRejectMsg(
      ctx.workerScript,
      `Invalid thread count passed to ${ctx.function}: ${requestedThreads}. Threads must be a positive number.`,
    );
  }
  if (requestedThreadsAsInt > threads) {
    throw makeRuntimeRejectMsg(
      ctx.workerScript,
      `Too many threads requested by ${ctx.function}. Requested: ${requestedThreads}. Has: ${threads}.`,
    );
  }
  return requestedThreadsAsInt;
}

export function isScriptErrorMessage(msg: string): boolean {
  if (!isString(msg)) {
    return false;
  }
  const splitMsg = msg.split("|DELIMITER|");
  return splitMsg.length == 4;
}
