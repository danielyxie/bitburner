import { BaseServer } from "../BaseServer";
import { getRamUsageFromRunningScript } from "../../Script/RunningScriptHelpers";
import { numeralWrapper } from "../../ui/numeralFormat";

export function top(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}) {
    // Headers
    const scriptWidth = 40;
    const pidWidth = 10;
    const threadsWidth = 16;

    const scriptTxt = "Script";
    const pidTxt = "PID";
    const threadsTxt = "Threads";
    const ramTxt = "RAM Usage";

    const spacesAfterScriptTxt = " ".repeat(scriptWidth - scriptTxt.length);
    const spacesAfterPidTxt = " ".repeat(pidWidth - pidTxt.length);
    const spacesAfterThreadsTxt = " ".repeat(threadsWidth - threadsTxt.length);

    const headers = `${scriptTxt}${spacesAfterScriptTxt}${pidTxt}${spacesAfterPidTxt}${threadsTxt}${spacesAfterThreadsTxt}${ramTxt}`;

    out(headers);

    let currRunningScripts = server.runningScripts;
    // Iterate through scripts on current server
    for (let i = 0; i < currRunningScripts.length; i++) {
        let script = currRunningScripts[i];

        // Calculate name padding
        const numSpacesScript = Math.max(0, scriptWidth - script.filename.length);
        const spacesScript = " ".repeat(numSpacesScript);

        // Calculate PID padding
        const numSpacesPid = Math.max(0, pidWidth - (script.pid + "").length);
        const spacesPid = " ".repeat(numSpacesPid);

        // Calculate thread padding
        const numSpacesThread = Math.max(0, threadsWidth - (script.threads + "").length);
        const spacesThread = " ".repeat(numSpacesThread);

        // Calculate and transform RAM usage
        const ramUsage = numeralWrapper.format(getRamUsageFromRunningScript(script) * script.threads, '0.00') + " GB";

        const entry = [
            script.filename,
            spacesScript,
            script.pid,
            spacesPid,
            script.threads,
            spacesThread,
            ramUsage
        ].join("");
        out(entry);
    }
}
import {registerExecutable, ManualEntry} from "./sys";
const MANUAL = new ManualEntry(
`top - prints informations about the running processes`,
`top`,
`Prints a list of all scripts running on the current server
as well as their thread count and how much RAM they are using
in total.`)
registerExecutable("top", top, MANUAL);
