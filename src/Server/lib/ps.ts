import { BaseServer } from "../BaseServer";

export function ps(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}) {
    for (let i = 0; i < server.runningScripts.length; i++) {
        const rsObj = server.runningScripts[i];
        let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
        for (let j = 0; j < rsObj.args.length; ++j) {
            res += (" " + rsObj.args[j].toString());
        }
        out(res);
    }
    return;
}
import {registerExecutable, ManualEntry} from "./sys";
const MANUAL = new ManualEntry(
`ps - prints running processes`,
`ps`,
`Prints all scripts that are running on the current server`)
registerExecutable("ps", ps, MANUAL);
