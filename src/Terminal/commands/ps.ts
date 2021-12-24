import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function ps(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number | boolean)[],
): void {
  if (args.length === 1 || args.length === 2 || args.length > 3) {
    terminal.error("Incorrect usage of ps command. Usage: ps [| grep <pattern>]");
    return;
  }
  if(args[0] === '|' && args[1] === 'grep'){
    const pattern = new RegExp(`${args[2].toString()}`)
    const matching = server.runningScripts.filter((x) => pattern.test(x.filename))
    for(let i = 0; i < matching.length; i++){
      const rsObj = matching[i];
      let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
      for (let j = 0; j < rsObj.args.length; ++j) {
        res += " " + rsObj.args[j].toString();
      }
      terminal.print(res);
    }
  }else if(args.length === 0){
    for (let i = 0; i < server.runningScripts.length; i++) {
      const rsObj = server.runningScripts[i];
      let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
      for (let j = 0; j < rsObj.args.length; ++j) {
        res += " " + rsObj.args[j].toString();
      }
      terminal.print(res);
    }
  }else{
    terminal.error("Incorrect usage of ps command. Usage: ps [| grep <pattern>]");
    return;
  }
}
