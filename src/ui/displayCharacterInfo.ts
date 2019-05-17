// Displays character info on a given element. This is used to create & update
// the 'Stats' page from the main menu
import { BitNodes } from "../BitNode/BitNode";
import { IPlayer } from "../PersonObjects/IPlayer";

import { numeralWrapper } from "../ui/numeralFormat";
import { MoneySourceTracker } from "../utils/MoneySourceTracker";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";

import { createElement } from "../../utils/uiHelpers/createElement";
import { removeChildrenFromElement } from "../../utils/uiHelpers/removeChildrenFromElement";

export function displayCharacterInfo(elem: HTMLElement, p: IPlayer) {
    removeChildrenFromElement(elem);

    let companyPosition = "";
    if (p.companyName !== "") {
        companyPosition = p.jobs[p.companyName];
    }

    var intText = "";
    if (p.intelligence > 0) {
        intText = 'Intelligence:  ' + (p.intelligence).toLocaleString() + '<br>';
    }

    let bitNodeTimeText = "";
    if(p.sourceFiles.length > 0) {
        bitNodeTimeText = 'Time played since last Bitnode destroyed: ' + convertTimeMsToTimeElapsedString(p.playtimeSinceLastBitnode) + '<br>';
    }

    const unlockedBitnodes: boolean = p.sourceFiles.length !== 0;

    // General info
    elem.appendChild(createElement("pre", {
        display: "block",
        innerHTML:
        '<b>General</b><br><br>' +
        'Current City: ' + p.city + '<br><br>' +
        `Employer at which you last worked: ${p.companyName}<br>` +
        `Job you last worked: ${companyPosition}<br>` +
        `All Employers: ${Object.keys(p.jobs).join(", ")}<br><br>`
    }));

    // Money, and a button to show money breakdown
    elem.appendChild(createElement("pre", {
        display: "inline-block",
        innerHTML: 'Money: ' + numeralWrapper.formatMoney(p.money.toNumber()) + '<br><br><br>',
        margin: "6px",
    }));

    function convertMoneySourceTrackerToString(src: MoneySourceTracker): string {
        let parts: string[] = [`Total: ${numeralWrapper.formatMoney(src.total)}`];
        if (src.bladeburner)     { parts.push(`Bladeburner: ${numeralWrapper.formatMoney(src.bladeburner)}`) };
        if (src.codingcontract)  { parts.push(`Coding Contracts: ${numeralWrapper.formatMoney(src.codingcontract)}`) };
        if (src.work)            { parts.push(`Company Work: ${numeralWrapper.formatMoney(src.work)}`) };
        if (src.corporation)     { parts.push(`Corporation: ${numeralWrapper.formatMoney(src.corporation)}`) };
        if (src.crime)           { parts.push(`Crimes: ${numeralWrapper.formatMoney(src.crime)}`) };
        if (src.gang)            { parts.push(`Gang: ${numeralWrapper.formatMoney(src.gang)}`) };
        if (src.hacking)         { parts.push(`Hacking: ${numeralWrapper.formatMoney(src.hacking)}`) };
        if (src.hacknetnode)     { parts.push(`Hacknet Nodes: ${numeralWrapper.formatMoney(src.hacknetnode)}`) };
        if (src.hospitalization) { parts.push(`Hospitalization: ${numeralWrapper.formatMoney(src.hospitalization)}`) };
        if (src.infiltration)    { parts.push(`Infiltration: ${numeralWrapper.formatMoney(src.infiltration)}`) };
        if (src.stock)           { parts.push(`Stock Market: ${numeralWrapper.formatMoney(src.stock)}`) };

        return parts.join("<br>");
    }

    elem.appendChild(createElement("button", {
        class: "popup-box-button",
        display: "inline-block",
        float: "none",
        innerText: "Money Statistics & Breakdown",
        clickListener: () => {
            let txt: string = "<u>Money earned since you last installed Augmentations:</u><br>" +
                              convertMoneySourceTrackerToString(p.moneySourceA);
            if (unlockedBitnodes) {
                txt += "<br><br><u>Money earned in this BitNode:</u><br>" +
                       convertMoneySourceTrackerToString(p.moneySourceB);
            }

            dialogBoxCreate(txt, false);
        }
    }));

    // Stats and multiplier
    elem.appendChild(createElement("pre", {
        display: "block",
        innerHTML:
        '<b>Stats</b><br><br>' +
        'Hacking Level: ' + (p.hacking_skill).toLocaleString() +
                        ' (' + numeralWrapper.format(p.hacking_exp, '(0.000a)') + ' experience)<br>' +
        'Strength:      ' + (p.strength).toLocaleString() +
                   ' (' + numeralWrapper.format(p.strength_exp, '(0.000a)') + ' experience)<br>' +
        'Defense:       ' + (p.defense).toLocaleString() +
                  ' (' + numeralWrapper.format(p.defense_exp, '(0.000a)') + ' experience)<br>' +
        'Dexterity:     ' + (p.dexterity).toLocaleString() +
                   ' (' + numeralWrapper.format(p.dexterity_exp, '(0.000a)') + ' experience)<br>' +
        'Agility:       ' + (p.agility).toLocaleString() +
                  ' (' + numeralWrapper.format(p.agility_exp, '(0.000a)') + ' experience)<br>' +
        'Charisma:      ' + (p.charisma).toLocaleString() +
                   ' (' + numeralWrapper.format(p.charisma_exp, '(0.000a)') + ' experience)<br>' +
        intText + '<br><br>' +
        '<b>Multipliers</b><br><br>' +
        'Hacking Chance multiplier: ' + numeralWrapper.formatPercentage(p.hacking_chance_mult) + '<br>' +
        'Hacking Speed multiplier:  ' + numeralWrapper.formatPercentage(p.hacking_speed_mult) + '<br>' +
        'Hacking Money multiplier:  ' + numeralWrapper.formatPercentage(p.hacking_money_mult) + '<br>' +
        'Hacking Growth multiplier: ' + numeralWrapper.formatPercentage(p.hacking_grow_mult) + '<br><br>' +
        'Hacking Level multiplier:      ' + numeralWrapper.formatPercentage(p.hacking_mult) + '<br>' +
        'Hacking Experience multiplier: ' + numeralWrapper.formatPercentage(p.hacking_exp_mult) + '<br><br>' +
        'Strength Level multiplier:      ' + numeralWrapper.formatPercentage(p.strength_mult) + '<br>' +
        'Strength Experience multiplier: ' + numeralWrapper.formatPercentage(p.strength_exp_mult) + '<br><br>' +
        'Defense Level multiplier:      ' + numeralWrapper.formatPercentage(p.defense_mult) + '<br>' +
        'Defense Experience multiplier: ' + numeralWrapper.formatPercentage(p.defense_exp_mult) + '<br><br>' +
        'Dexterity Level multiplier:      ' + numeralWrapper.formatPercentage(p.dexterity_mult) + '<br>' +
        'Dexterity Experience multiplier: ' + numeralWrapper.formatPercentage(p.dexterity_exp_mult) + '<br><br>' +
        'Agility Level multiplier:      ' + numeralWrapper.formatPercentage(p.agility_mult) + '<br>' +
        'Agility Experience multiplier: ' + numeralWrapper.formatPercentage(p.agility_exp_mult) + '<br><br>' +
        'Charisma Level multiplier:      ' + numeralWrapper.formatPercentage(p.charisma_mult) + '<br>' +
        'Charisma Experience multiplier: ' + numeralWrapper.formatPercentage(p.charisma_exp_mult) + '<br><br>' +
        'Hacknet Node production multiplier:         ' + numeralWrapper.formatPercentage(p.hacknet_node_money_mult) + '<br>' +
        'Hacknet Node purchase cost multiplier:      ' + numeralWrapper.formatPercentage(p.hacknet_node_purchase_cost_mult) + '<br>' +
        'Hacknet Node RAM upgrade cost multiplier:   ' + numeralWrapper.formatPercentage(p.hacknet_node_ram_cost_mult) + '<br>' +
        'Hacknet Node Core purchase cost multiplier: ' + numeralWrapper.formatPercentage(p.hacknet_node_core_cost_mult) + '<br>' +
        'Hacknet Node level upgrade cost multiplier: ' + numeralWrapper.formatPercentage(p.hacknet_node_level_cost_mult) + '<br><br>' +
        'Company reputation gain multiplier: ' + numeralWrapper.formatPercentage(p.company_rep_mult) + '<br>' +
        'Faction reputation gain multiplier: ' + numeralWrapper.formatPercentage(p.faction_rep_mult) + '<br>' +
        'Salary multiplier: ' + numeralWrapper.formatPercentage(p.work_money_mult) + '<br>' +
        'Crime success multiplier: ' + numeralWrapper.formatPercentage(p.crime_success_mult) + '<br>' +
        'Crime money multiplier: ' + numeralWrapper.formatPercentage(p.crime_money_mult) + '<br><br><br>' +
        '<b>Misc</b><br><br>' +
        'Servers owned:       ' + p.purchasedServers.length + '<br>' +
        'Hacknet Nodes owned: ' + p.hacknetNodes.length + '<br>' +
        'Augmentations installed: ' + p.augmentations.length + '<br>' +
        'Time played since last Augmentation: ' + convertTimeMsToTimeElapsedString(p.playtimeSinceLastAug) + '<br>' +
        bitNodeTimeText +
        'Time played: ' + convertTimeMsToTimeElapsedString(p.totalPlaytime),
    }));

    // BitNode information, if player has gotten that far
    if (unlockedBitnodes) {
        var index = "BitNode" + p.bitNodeN;

        elem.appendChild(createElement("p", {
            width:"60%",
            innerHTML:
                "<br>Current BitNode: " + p.bitNodeN + " (" + BitNodes[index].name + ")<br><br>",
        }));

        elem.appendChild(createElement("p", {
            width:"60%", fontSize: "13px", marginLeft:"4%",
            innerHTML:BitNodes[index].info,
        }))
    }

}
