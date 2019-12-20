import { GangMemberUpgrades } from "../../Gang";
import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getEquipmentNames(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    throwIfNoGang(server, term, err);
    for (let upg of Object.keys(GangMemberUpgrades)) {
        out(upg);
    }
    return true;
}

const MANUAL = new ManualEntry(
    `getEquipmentNames - Outputs the name of every available equipment.`,
    `getEquipmentNames`,
    `Outputs the name of every available equipment.`);

registerExecutable("getEquipmentNames", getEquipmentNames, MANUAL, true, "gang");
