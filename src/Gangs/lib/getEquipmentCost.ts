import { BaseServer } from "../../Server/BaseServer";
import {GangMemberUpgrades} from "../../Gang";
import {throwIfNoGang} from "./throwIfNoGang";

export function getEquipmentCost(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {

    throwIfNoGang(server, term, err);
    if (args.length == 0){
        err(`You must provide at least one equipment`)
        return false;
    }
    let multiple = args.length > 1;
    let discount = term.getPlayer().gang.getDiscount()

    for(let upgName of args){
        const upg = GangMemberUpgrades[upgName];
        if (upg === undefined){
            if (!multiple) {
                err(`Unknown equipment ${upgName}`);
                return false;
            }
            out(`Unknown equipment ${upgName}`);
            continue;
        }

        let actualCost = upg.cost / discount
        if (!multiple) out(`${actualCost}`)
        else out(`${upgName}\t${actualCost}`);
    }
    return true;
}
import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getEquipmentCost - Outputs the cost of specified equipments.`,
`getEquipmentCost EQUIPNAME
getEquipmentCost EQUIPNAME ...`,
`Outputs the cost of specified equipments.`);

registerExecutable("getEquipmentCost", getEquipmentCost, MANUAL, true, "gang");
