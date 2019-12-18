import { BaseServer } from "../../Server/BaseServer";
import { Gang, FactionToGangType, GANGTYPE } from "../../Gang";
import { hasGang } from "./hasGang";

export function ascendMember(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {

    const HELP_MESSAGE: string = "Usage: ascendMember MEMBER ...";

    let members:string[]=[];
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

    if (members.length == 0){
        err(`You must provide a member`);
        return false;
    }
    let hasGangAlready:boolean = false;
    let hasGangOut = (value:boolean)=>{hasGangAlready=value;};
    hasGang(server, term, hasGangOut, err, [])
    if(!hasGangAlready){
        err(`You dont have a gang`);
        return false;
    }

    for (let memberName of members){
        const member = term.getPlayer().gang.getMember(memberName);
        if (member === undefined){
            err(`${memberName} is not a member`);
            return false;
        }
        out(term.getPlayer().gang.ascendMember(member));
    }
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`ascendMember - Ascend specified gang members.`,
`ascendMember MEMBER ...`,
`Ascend specified gang members.`);

registerExecutable("ascendMember", ascendMember, MANUAL, true, "gang");
