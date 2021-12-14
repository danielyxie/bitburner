import { isString } from "./utils/helpers/isString";
import { GetServer } from "./Server/AllServers";
import { WorkerScript } from "./Netscript/WorkerScript";
import { BlobsMap } from "./NetscriptJSEvaluator";

export function netscriptDelay(time: number, workerScript: WorkerScript): Promise<void> {
  return new Promise(function (resolve) {
    workerScript.delay = window.setTimeout(() => {
      workerScript.delay = null;
      resolve();
    }, time);
    workerScript.delayResolve = resolve;
  });
}

export function makeRuntimeRejectMsg(workerScript: WorkerScript, msg: string): string {
  if ((msg as any) instanceof WorkerScript) {
    console.error("HERE");
  }
  const server = GetServer(workerScript.hostname);
  if (server == null) {
    throw new Error(`WorkerScript constructed with invalid server ip: ${workerScript.hostname}`);
  }

  for (const url in BlobsMap) {
    msg = msg.replace(new RegExp(url, "g"), BlobsMap[url]);
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
  if (requestedThreads > threads) {
    throw makeRuntimeRejectMsg(
      workerScript,
      `Too many threads requested by ${functionName}. Requested: ${requestedThreads}. Has: ${threads}.`,
    );
  }
  return requestedThreadsAsInt;
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
