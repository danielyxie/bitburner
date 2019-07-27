import {tail} from "./tail";
import { BaseServer } from "../BaseServer";

export function check(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={target:undefined, logBox:false, args:[], PID:false}) {
    tail(server, term, out, err, args, options);
}
