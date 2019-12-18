import { BaseServer } from "../../Server/BaseServer";
import { Gang, FactionToGangType, GANGTYPE, AllGangs } from "../../Gang";
import { hasGang } from "./hasGang";

export function getChanceToWinClash(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {
    let HELP_MESSAGE = `USAGE: getChanceToWinClash GANGNAME ...`

    let factions:string[]=[];
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return false;
            case "-l":
            case "--list":
                options.list = true;
                break;
            default:
                factions.push(arg as string);
                break;
        }
    }

    let hasGangAlready:boolean = true;
    let hasGangOut = (value:boolean)=>{hasGangAlready=value;};
    hasGang(server, term, hasGangOut, err, [])
    if(!hasGangAlready){
        err(`You have no gang`);
        return false;
    }


    if (factions.length == 0 && !options.list){
        err(`You must provide a faction`);
        return false;
    }
    if (options.list){
        factions = Object.keys(AllGangs);
    }
    for(let faction of factions){
        if(AllGangs[faction] == null) {
            err(`Gang ${faction} does not exists`);
            return false;
        }
        else if(faction == term.getPlayer().gang.facName){
            if(options.list) continue;
            else if(factions.length == 1) err(`You cannot clash with your own gang`);
            else out(`You cannot clash with your own gang`);
            return false;
        }
        else{
            const playerPower = AllGangs[term.getPlayer().gang.facName].power;
            const otherPower = AllGangs[faction].power;
            if(factions.length == 1) out(playerPower / (otherPower + playerPower));
            else out(`${faction}\t${playerPower / (otherPower + playerPower)}`);
        }
    }
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getChanceToWinClash - Returns your odds of winning a clash against another gang.`,
`getChanceToWinClash GANGNAME1 ....
getChanceToWinClash -l`,
`Returns your odds of winning a clash against another gang.

-l --list
    returns odds of winning against every other gangs.

Examples:
getChanceToWinClash "The Black Hand" "NiteSec"
getChanceToWinClash -l
`);

registerExecutable("getChanceToWinClash", getChanceToWinClash, MANUAL, true, "gang");
