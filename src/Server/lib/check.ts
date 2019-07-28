import {tail} from "./tail";
import { BaseServer } from "../BaseServer";

export function check(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={target:undefined, logBox:false, args:[], PID:false}) {
    tail(server, term, out, err, args, options);
}

import {registerExecutable, ManualEntry} from "./sys";

const MANUAL = new ManualEntry(
`check - output the last part of files`,
`check RUNNINGSCRIPT [ARGS]...
check -p|--pid PID`,
`Print the last lines of RUNNINGSCRIPT logs to standard output. Each argument
must be separated by a space. Remember that a running script is uniquely
identified by both its name and the arguments that were used to run it.
So, if a script was ran with the following arguments:

    run foo.script 10 50000

Then in order to check its logs with 'tail' the same arguments must be used:

    check foo.script 10 50000

--help
    display this help and exit

-p, --pid=PID
    uses the PID to identify the process

-l, --log-box
    display the logs in a new log box instead of the standard output
`)

registerExecutable("check", check, MANUAL);
