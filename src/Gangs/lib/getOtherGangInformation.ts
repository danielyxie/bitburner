import { AllGangs } from "../../Gang";
import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getOtherGangInformation(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {

    throwIfNoGang(server, term, err);
    const cpy: any = {};
    for (const gang of Object.keys(AllGangs)) {
        cpy[gang] = {...AllGangs[gang]};
    }
    out(cpy);
    return true;
}

const MANUAL = new ManualEntry(
    `getOtherGangInformation - Outputs other information about all the gangs.`,
    `getOtherGangInformation`,
    `Outputs other information about all the gangs.`);

registerExecutable("getOtherGangInformation", getOtherGangInformation, MANUAL, true, "gang");
