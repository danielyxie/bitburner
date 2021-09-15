import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { Message } from "../../Message/Message";
import { getServer } from "../../Server/ServerHelpers";
import { isScriptFilename } from "../../Script/ScriptHelpersTS";

export function scp(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  try {
    if (args.length !== 2) {
      terminal.error("Incorrect usage of scp command. Usage: scp [file] [destination hostname/ip]");
      return;
    }
    const scriptname = terminal.getFilepath(args[0] + "");
    if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) && !scriptname.endsWith(".txt")) {
      terminal.error("scp only works for scripts, text files (.txt), and literature files (.lit)");
      return;
    }

    const destServer = getServer(args[1] + "");
    if (destServer == null) {
      terminal.error(`Invalid destination. ${args[1]} not found`);
      return;
    }

    // Scp for lit files
    if (scriptname.endsWith(".lit")) {
      let found = false;
      for (let i = 0; i < server.messages.length; ++i) {
        if (!(server.messages[i] instanceof Message) && server.messages[i] == scriptname) {
          found = true;
          break;
        }
      }

      if (!found) {
        return terminal.error("No such file exists!");
      }

      for (let i = 0; i < destServer.messages.length; ++i) {
        if (destServer.messages[i] === scriptname) {
          terminal.print(scriptname + " copied over to " + destServer.hostname);
          return; // Already exists
        }
      }
      destServer.messages.push(scriptname);
      return terminal.print(scriptname + " copied over to " + destServer.hostname);
    }

    // Scp for txt files
    if (scriptname.endsWith(".txt")) {
      let txtFile = null;
      for (let i = 0; i < server.textFiles.length; ++i) {
        if (server.textFiles[i].fn === scriptname) {
          txtFile = server.textFiles[i];
          break;
        }
      }

      if (txtFile === null) {
        return terminal.error("No such file exists!");
      }

      const tRes = destServer.writeToTextFile(txtFile.fn, txtFile.text);
      if (!tRes.success) {
        terminal.error("scp failed");
        return;
      }
      if (tRes.overwritten) {
        terminal.print(`WARNING: ${scriptname} already exists on ${destServer.hostname} and will be overwriten`);
        terminal.print(`${scriptname} overwritten on ${destServer.hostname}`);
        return;
      }
      terminal.print(`${scriptname} copied over to ${destServer.hostname}`);
      return;
    }

    // Get the current script
    let sourceScript = null;
    for (let i = 0; i < server.scripts.length; ++i) {
      if (scriptname == server.scripts[i].filename) {
        sourceScript = server.scripts[i];
        break;
      }
    }
    if (sourceScript == null) {
      terminal.error("scp() failed. No such script exists");
      return;
    }

    const sRes = destServer.writeToScriptFile(scriptname, sourceScript.code);
    if (!sRes.success) {
      terminal.error(`scp failed`);
      return;
    }
    if (sRes.overwritten) {
      terminal.print(`WARNING: ${scriptname} already exists on ${destServer.hostname} and will be overwritten`);
      terminal.print(`${scriptname} overwritten on ${destServer.hostname}`);
      return;
    }
    terminal.print(`${scriptname} copied over to ${destServer.hostname}`);
  } catch (e) {
    terminal.error(e + "");
  }
}
