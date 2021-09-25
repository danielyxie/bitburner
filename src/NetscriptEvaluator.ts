import { setTimeoutRef } from "./utils/SetTimeoutRef";

import { isString } from "../utils/helpers/isString";
import { AllServers } from "./Server/AllServers";
import { WorkerScript } from "./Netscript/WorkerScript";

export function netscriptDelay(time: number, workerScript: WorkerScript): Promise<void> {
  return new Promise(function (resolve) {
    workerScript.delay = setTimeoutRef(() => {
      workerScript.delay = null;
      resolve();
    }, time);
    workerScript.delayResolve = resolve;
  });
}

export function makeRuntimeRejectMsg(workerScript: WorkerScript, msg: string, exp: any = null) {
  var lineNum = "";
  if (exp != null) {
    var num = getErrorLineNumber(exp, workerScript);
    lineNum = " (Line " + num + ")";
  }
  const server = AllServers[workerScript.serverIp];
  if (server == null) {
    throw new Error(`WorkerScript constructed with invalid server ip: ${workerScript.serverIp}`);
  }

  return "|" + server.hostname + "|" + workerScript.name + "|" + msg + lineNum;
}

export function resolveNetscriptRequestedThreads(
  workerScript: WorkerScript,
  functionName: string,
  requestedThreads: number,
) {
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

function getErrorLineNumber(exp: any, workerScript: WorkerScript): number {
  return -1;
  // TODO wtf is codeCode?

  // var code = workerScript.scriptRef.codeCode();

  // //Split code up to the start of the node
  // try {
  //   code = code.substring(0, exp.start);
  //   return (code.match(/\n/g) || []).length + 1;
  // } catch (e) {
  //   return -1;
  // }
}

export function isScriptErrorMessage(msg: string): boolean {
  if (!isString(msg)) {
    return false;
  }
  let splitMsg = msg.split("|");
  if (splitMsg.length != 4) {
    return false;
  }
  return true;
}
