import { BaseServer } from "../BaseServer";

export function analyze(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={}){
    term.startAnalyze();
}


import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`analyze - prints details and statistics about the current server.`,
`analyze`,
`Prints details and statistics about the local server.
The information that is printed includes basic server
details such as the hostname, whether the player has
root access, what ports are opened/closed, and also
hacking-related information such as an estimated chance
to successfully hack, an estimate of how much money is
available on the server, etc.`)
registerExecutable("analyze", analyze, MANUAL);
