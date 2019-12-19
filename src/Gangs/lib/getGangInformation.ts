import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getGangInformation(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {

    throwIfNoGang(server, term, err);
    const gang: any = term.getPlayer().gang;
    out({
            faction: gang.facName,
            isHacking: gang.isHackingGang,
            moneyGainRate: gang.moneyGainRate,
            power: gang.getPower(),
            respect: gang.respect,
            respectGainRate: gang.respectGainRate,
            territory: gang.getTerritory(),
            territoryClashChance: gang.territoryClashChance,
            territoryWarfareEngaged: gang.territoryWarfareEngaged,
            wantedLevel: gang.wanted,
            wantedLevelGainRate: gang.wantedGainRate,
        });
    return true;
}

const MANUAL = new ManualEntry(
    `getGangInformation - Outputs information about your gang.`,
    `getGangInformation`,
    `Outputs information about your gang.`);

registerExecutable("getGangInformation", getGangInformation, MANUAL, true, "gang");
