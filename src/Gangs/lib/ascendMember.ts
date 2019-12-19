import {BaseServer} from "../../Server/BaseServer";
import {throwIfNoGang} from "./throwIfNoGang";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";

export function ascendMember(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    const HELP_MESSAGE: string = "Usage: ascendMember MEMBER ...";

    let members: string[] = [];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return false;
            default:
                members.push(arg as string);
                break;
        }
    }

    if (members.length == 0) {
        err(`You must provide a member`);
        return false;
    }

    throwIfNoGang(server, term, err);

    for (let memberName of members) {
        const member = term.getPlayer().gang.getMember(memberName);
        if (member === undefined) {
            err(`${memberName} is not a member`);
            return false;
        }
        out(term.getPlayer().gang.ascendMember(member));
    }
    return true;
}

const MANUAL = new ManualEntry(
    `ascendMember - Ascend specified gang members.`,
    `ascendMember MEMBER ...`,
    `Ascend specified gang members.`);

registerExecutable("ascendMember", ascendMember, MANUAL, true, "gang");
