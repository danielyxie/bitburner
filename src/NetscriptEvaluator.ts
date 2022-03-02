import { isString } from "./utils/helpers/isString";
import { GetServer } from "./Server/AllServers";
import { WorkerScript } from "./Netscript/WorkerScript";
import { IPlayer } from "./PersonObjects/IPlayer";

export function netscriptDelay(time: number, workerScript: WorkerScript): Promise<void> {
  if (workerScript.delayReject) workerScript.delayReject();
  return new Promise(function (resolve, reject) {
    workerScript.delay = window.setTimeout(() => {
      workerScript.delay = null;
      workerScript.delayReject = undefined;

      if (workerScript.env.stopFlag) reject(workerScript);
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

export function resolveNetscriptRequestedThreads(
  workerScript: WorkerScript,
  functionName: string,
  requestedThreads: number,
): number {
  const threads = workerScript.scriptRef.threads;
  if (!requestedThreads) {
    return isNaN(threads) || threads < 1 ? 1 : threads;
  }
  const requestedThreadsAsInt = requestedThreads | 0;
  if (isNaN(requestedThreads) || requestedThreadsAsInt < 1) {
    throw makeRuntimeRejectMsg(
      workerScript,
      `Invalid thread count passed to ${functionName}: ${requestedThreads}. Threads must be a positive number.`,
    );
  }
  if (requestedThreadsAsInt > threads) {
    throw makeRuntimeRejectMsg(
      workerScript,
      `Too many threads requested by ${functionName}. Requested: ${requestedThreads}. Has: ${threads}.`,
    );
  }
  return requestedThreadsAsInt;
}

export function resolveNetscriptHackOverride(
  workerScript: WorkerScript,
  functionName: string,
  player: IPlayer,
  hackOverride: number | undefined,
): number {
  if (hackOverride === undefined || isNaN(hackOverride))
    return player.hacking;

  if (hackOverride <= 0) {
    throw makeRuntimeRejectMsg(
      workerScript,
      `Invalid hack override passed to ${functionName}: ${hackOverride}. Override must be a positive number.`,
    );
  }
  if (hackOverride > player.hacking) {
    throw makeRuntimeRejectMsg(
      workerScript,
      `Hack override requested by ${functionName} exceeds the players hacking skill. Requested: ${hackOverride}. Has: ${player.hacking}.`,
    );
  }
  return hackOverride;
}

export function isScriptErrorMessage(msg: string): boolean {
  if (!isString(msg)) {
    return false;
  }
  const splitMsg = msg.split("|DELIMITER|");
  if (splitMsg.length != 4) {
    return false;
  }
  return true;
}
