import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";

export function killall(_args: (string | number | boolean)[], server: BaseServer): void {
  for (let i = server.runningScripts.length - 1; i >= 0; --i) {
    killWorkerScript({ runningScript: server.runningScripts[i], hostname: server.hostname });
  }
  WorkerScriptStartStopEventEmitter.emit();
  Terminal.print("Killing all running scripts");
}
