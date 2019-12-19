import {BaseServer} from "../../Server/BaseServer";
import {GangMemberUpgrades} from "../../Gang";
import {throwIfNoGang} from "./throwIfNoGang";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";

export function getEquipmentNames(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    throwIfNoGang(server, term, err);
    for (let upg of Object.keys(GangMemberUpgrades)) out(upg);
    return true;
}

const MANUAL = new ManualEntry(
    `getEquipmentNames - Outputs the name of every available equipment.`,
    `getEquipmentNames`,
    `Outputs the name of every available equipment.`);

registerExecutable("getEquipmentNames", getEquipmentNames, MANUAL, true, "gang");
