import { Terminal } from "../../Terminal";
import { BaseServer } from "../../Server/BaseServer";
import { GetServer } from "../../Server/AllServers";
import { isScriptFilename } from "../../Script/isScriptFilename";

export function scp(args: (string | number | boolean)[], server: BaseServer): void {
  try {
    if (args.length !== 2) {
      Terminal.error("Incorrect usage of scp command. Usage: scp [file] [destination hostname]");
      return;
    }
    const scriptname = Terminal.getFilepath(args[0] + "");
    if (!scriptname.endsWith(".lit") && !isScriptFilename(scriptname) && !scriptname.endsWith(".txt")) {
      Terminal.error("scp only works for scripts, text files (.txt), and literature files (.lit)");
      return;
    }

    const destServer = GetServer(args[1] + "");
    if (destServer == null) {
      Terminal.error(`Invalid destination. ${args[1]} not found`);
      return;
    }

    // Scp for lit files
    if (scriptname.endsWith(".lit")) {
      if (!server.messages.includes(scriptname)) return Terminal.error("No such file exists!");

      const onDestServer = destServer.messages.includes(scriptname);
      if (!onDestServer) destServer.messages.push(scriptname);
      return Terminal.print(`${scriptname} ${onDestServer ? "was already on" : "copied to"} ${destServer.hostname}`);
    }

    // Scp for txt files
    if (scriptname.endsWith(".txt")) {
      const txtFile = server.textFiles.find((txtFile) => txtFile.fn === scriptname);
      if (!txtFile) return Terminal.error("No such file exists!");

      const tRes = destServer.writeToTextFile(txtFile.fn, txtFile.text);
      if (!tRes.success) {
        Terminal.error("scp failed");
        return;
      }
      if (tRes.overwritten) {
        Terminal.print(`WARNING: ${scriptname} already exists on ${destServer.hostname} and will be overwritten`);
        Terminal.print(`${scriptname} overwritten on ${destServer.hostname}`);
        return;
      }
      Terminal.print(`${scriptname} copied over to ${destServer.hostname}`);
      return;
    }

    // Get the current script
    const sourceScript = server.scripts.find((script) => script.filename === scriptname);
    if (!sourceScript) {
      Terminal.error("scp failed. No such script exists");
      return;
    }

    const sRes = destServer.writeToScriptFile(scriptname, sourceScript.code);
    if (!sRes.success) {
      Terminal.error(`scp failed`);
      return;
    }
    if (sRes.overwritten) {
      Terminal.print(`WARNING: ${scriptname} already exists on ${destServer.hostname} and will be overwritten`);
      Terminal.print(`${scriptname} overwritten on ${destServer.hostname}`);
      return;
    }
    Terminal.print(`${scriptname} copied over to ${destServer.hostname}`);
  } catch (e) {
    Terminal.error(e + "");
  }
}
