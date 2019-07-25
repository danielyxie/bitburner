import {ReturnCode} from "./ReturnCode";
import {BaseServer} from "../BaseServer";
import {Server} from "../Server";
import {HacknetServer} from "../../Hacknet/HacknetServer";
import { post, postError } from "../../ui/postToTerminal";
import { getServer} from "../AllServers";
import { CLIErrorType } from "./CLIErrorType";

export function ps(server: BaseServer, term: any, args: string[], target: string | undefined=undefined):ReturnCode{
    for (let i = 0; i < server.runningScripts.length; i++) {
        let rsObj = server.runningScripts[i];
        let res = `(PID - ${rsObj.pid}) ${rsObj.filename}`;
        for (let j = 0; j < rsObj.args.length; ++j) {
            res += (" " + rsObj.args[j].toString());
        }
        post(res);
    }
    return ReturnCode.SUCCESS;
}