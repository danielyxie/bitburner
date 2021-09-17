import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";

export function killall(terminal: ITerminal, engine: IEngine, player: IPlayer, server: BaseServer): void {
  for (let i = server.runningScripts.length - 1; i >= 0; --i) {
    killWorkerScript(server.runningScripts[i], server.ip, false);
  }
  WorkerScriptStartStopEventEmitter.emitEvent();
  terminal.print("Killing all running scripts");
}
