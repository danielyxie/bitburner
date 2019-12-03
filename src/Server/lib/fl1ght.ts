import { HacknetServer } from "../../Hacknet/HacknetServer";
import { getServer } from "../AllServers";
import { BaseServer } from "../BaseServer";
import { Server } from "../Server";
import {registerExecutable, ManualEntry, fetchUsage, fetchExecutable} from "./sys";
import { numeralWrapper } from "../../ui/numeralFormat";
import {Player} from "../../Player";
import {
    calculateHackingTime,
    calculateGrowTime,
    calculateWeakenTime
} from "../../Hacking";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

export function fl1ght(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    const numAugReq = Math.round(BitNodeMultipliers.DaedalusAugsRequirement*30)
    const fulfilled = Player.augmentations.length >= numAugReq &&
        Player.money.gt(1e11) &&
        ((Player.hacking_skill >= 2500)||
        (Player.strength >= 1500 &&
        Player.defense >= 1500 &&
        Player.dexterity >= 1500 &&
        Player.agility >= 1500));
    if(!fulfilled) {
        out(`Augmentations: ${Player.augmentations.length} / ${numAugReq}`);

        out(`Money: ${numeralWrapper.format(Player.money.toNumber(), '($0.000a)')} / ${numeralWrapper.format(1e11, '($0.000a)')}`);
        out("One path below must be fulfilled...");
        out("----------HACKING PATH----------");
        out(`Hacking skill: ${Player.hacking_skill} / 2500`);
        out("----------COMBAT PATH----------");
        out(`Strength: ${Player.strength} / 1500`);
        out(`Defense: ${Player.defense} / 1500`);
        out(`Dexterity: ${Player.dexterity} / 1500`);
        out(`Agility: ${Player.agility} / 1500`);
        return;
    }

    out("We will contact you.");
    out("-- Daedalus --");
}
const MANUAL = new ManualEntry(
`fl1ght.exe - we expect great things from you`,
`fl1ght.exe`,
`We expect great things from you.

Please, fulfill our expectations, bit by bit.

Require the fl1ght.exe program. We will contact you.`)

registerExecutable("fl1ght.exe", fl1ght, MANUAL, true);
