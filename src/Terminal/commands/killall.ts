import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { BaseServer } from "../../Server/BaseServer";
import type { IRouter } from "../../ui/Router";
import type { ITerminal } from "../ITerminal";

export function killall(terminal: ITerminal, router: IRouter, player: IPlayer, server: BaseServer): void {
  for (let i = server.runningScripts.length - 1; i >= 0; --i) {
    killWorkerScript(server.runningScripts[i], server.hostname, false);
  }
  WorkerScriptStartStopEventEmitter.emit();
  terminal.print("Killing all running scripts");
}
