import { BaseServer } from "../../Server/BaseServer";
import {GangMemberUpgrades} from "../../Gang";
import { hasGang } from "./hasGang";

export function getEquipmentType(server: BaseServer, term: any, out:Function, err:Function, args: string[], options:any={type:false, list:false}) {
    let hasGangAlready:boolean = false;
    let hasGangOut = (value:boolean)=>{hasGangAlready=value;};
    hasGang(server, term, hasGangOut, err, [])
    if(!hasGangAlready){
        err(`You dont have a gang`);
        return false;
    }
    if (args.length == 0){
        err(`You must provide at least one equipment`)
        return false;
    }
    let multiple = args.length > 1;

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

        switch (upg.type) {
            case "w":
                if (!multiple) out("Weapon")
                else out(`${upgName}\tWeapon`);
                break;
            case "a":
                if (!multiple) out("Armor")
                else out(`${upgName}\tArmor`);
                break;
            case "v":
                if (!multiple) out("Vehicle")
                else out(`${upgName}\tVehicle`);
                break;
            case "r":
                if (!multiple) out("Rootkit")
                else out(`${upgName}\tRootkit`);
                break;
            case "g":
                if (!multiple) out("Augmentation")
                else out(`${upgName}\tAugmentation`);
                break;
            default:
                if (!multiple) {
                    err(`Unknown upgrade type ${upg.type}`);
                    return false;
                }
                out(`${upgName}\tUnknown`);
        }
    }
    return true;
}

import { registerExecutable, ManualEntry } from "../../Server/lib/sys";

const MANUAL = new ManualEntry(
`getEquipmentType - Outputs the type of specified equipments.`,
`getEquipmentType EQUIPNAME
getEquipmentType EQUIPNAME ...`,
`Outputs the name of specified equipment.`);

registerExecutable("getEquipmentType", getEquipmentType, MANUAL, true, "gang");
