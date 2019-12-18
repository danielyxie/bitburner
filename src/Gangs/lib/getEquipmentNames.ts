import { BaseServer } from "../../Server/BaseServer";
import {GangMemberUpgrades} from "../../Gang";
import { hasGang } from "./hasGang";

export function getEquipmentNames(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {
    let hasGangAlready:boolean = false;
    let hasGangOut = (value:boolean)=>{hasGangAlready=value;};
    hasGang(server, term, hasGangOut, err, [])
    if(!hasGangAlready){
        err(`You dont have a gang`);
        return false;
    }
    for(let upg of Object.keys(GangMemberUpgrades)) out(upg);
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getEquipmentNames - Outputs the name of every available equipment.`,
`getEquipmentNames`,
`Outputs the name of every available equipment.`);

registerExecutable("getEquipmentNames", getEquipmentNames, MANUAL, true, "gang");
