import { BaseServer } from "../../Server/BaseServer";
import { ManualEntry, registerExecutable } from "../../Server/lib/sys";
import { throwIfNoGang } from "./throwIfNoGang";

export function getMemberInformation(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {}) {
    throwIfNoGang(server, term, err);
    const gang = term.getPlayer().gang;
    if (args.length !== 1) {
        err(`You must provide a name and only one`);
        return false;
    }
    const name: string = args.shift() as string;
    if (name === "") {
        err(`You must provide a non-empty name`);
        return false;
    }
    if (!Object.keys(gang.members).includes(name)) {
        err(`No member named ${name} found`);
        return false;
    }
    const member = gang.members[name];
    const CYCLES_PER_SEC = 5;

    out({
            agility: member.agi,
            agilityEquipMult: member.agi_mult,
            agilityAscensionMult: member.agi_asc_mult,
            augmentations: member.augmentations.slice(),
            charisma: member.cha,
            charismaEquipMult: member.cha_mult,
            charismaAscensionMult: member.cha_asc_mult,
            defense: member.def,
            defenseEquipMult: member.def_mult,
            defenseAscensionMult: member.def_asc_mult,
            dexterity: member.dex,
            dexterityEquipMult: member.dex_mult,
            dexterityAscensionMult: member.dex_asc_mult,
            equipment: member.upgrades.slice(),
            hacking: member.hack,
            hackingEquipMult: member.hack_mult,
            hackingAscensionMult: member.hack_asc_mult,
            strength: member.str,
            strengthEquipMult: member.str_mult,
            strengthAscensionMult: member.str_asc_mult,
            task: member.task,
            respectGainRate: CYCLES_PER_SEC * member.calculateRespectGain(term.getPlayer().gang),
            wantedLevelGainRate: CYCLES_PER_SEC * member.calculateWantedLevelGain(term.getPlayer().gang),
            moneyGainRate: CYCLES_PER_SEC * member.calculateMoneyGain(term.getPlayer().gang)
        });
    return true;
}

const MANUAL = new ManualEntry(
    `getMemberInformation - Returns a specific gang member information.`,
    `getMemberInformation MEMBERNAME`,
    `Returns a specific gang member information.`);

registerExecutable("getMemberInformation", getMemberInformation, MANUAL, true, "gang");
