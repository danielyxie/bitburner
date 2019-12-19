import {BaseServer} from "../../Server/BaseServer";
import {throwIfNoGang} from "./throwIfNoGang";
import {GangMemberUpgrade, GangMemberUpgrades, UIElems} from "../../Gang";

import {Page, routing} from "../../ui/navigationTracking";
import {ManualEntry, registerExecutable} from "../../Server/lib/sys";

export function purchaseEquipment(server: BaseServer, term: any, out: Function, err: Function, args: string[], options: any = {
    type: false,
    list: false
}) {

    const HELP_MESSAGE: string = "Usage: purchaseEquipment [-e] EQUIPNAME [-m] MEMBERNAME";
    let memberName: string | undefined;
    let equipName: string | undefined;
    while (args.length > 0) {
        const arg = args.shift() as string;
        switch (arg) {
            case "-h":
            case "--help":
                out(HELP_MESSAGE);
                return false;
            case "-e":
            case "--equip":
                if (args.length < 1) {
                    err(`No equipment specified after -e`);
                    return false;
                }
                equipName = args.shift() as string;
                break;
            case "-m":
            case "--member":
                if (args.length < 1) {
                    err(`No member specified after -m`);
                    return false;
                }
                memberName = args.shift() as string;
                break;
            default:
                if (memberName === undefined) {
                    memberName = arg as string;
                } else if (equipName === undefined) {
                    equipName = arg as string;
                } else {
                    err(`Too many arguments: ${arg}`);
                    return false;
                }
                break;
        }
    }

    let player = term.getPlayer();

    throwIfNoGang(server, term, err);
    let gang = player.gang;
    try {
        const member = term.getPlayer().gang.getMember(memberName);
        if (member === undefined) {
            err(`No gang member could be found with name ${memberName}`);
            return false;
        }

        if (typeof equipName === 'string') {
            var upg = GangMemberUpgrades[equipName];
        }

        if (!(upg instanceof GangMemberUpgrade)) {
            err(`No equipment could be found with name ${equipName}`);
            return false;
        }

        if (member.augmentations.includes(upg.name) || member.upgrades.includes(upg.name)) {
            err(`${memberName} already has ${equipName}`);
            return false;
        }

        if (player.money.lt(upg.getCost(gang))) {
            err(`You do not have enough money to afford this.`);
            return false;
        }

        player.loseMoney(upg.getCost(gang));

        if (upg.type === "g") {
            member.augmentations.push(upg.name);
        } else {
            member.upgrades.push(upg.name);
        }

        upg.apply(member);

        if (routing.isOn(Page.Gang) && UIElems.gangMemberUpgradeBoxOpened) {
            var initFilterValue = UIElems.gangMemberUpgradeBoxFilter.value.toString();
            gang.createGangMemberUpgradeBox(player, initFilterValue);
        }

        out(`Purchased ${equipName} for Gang member ${memberName}`);

        return true;
    } catch (e) {
        err(e);
    }
}

const MANUAL = new ManualEntry(
    `purchaseEquipment - Purchase a specific equipment for a specific gang member.`,
    `purchaseEquipment [-e] EQUIPNAME [-m] MEMBERNAME`,
    `Purchase a specific equipment for a specific gang member.`);

registerExecutable("purchaseEquipment", purchaseEquipment, MANUAL, true, "gang");
