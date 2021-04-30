/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import * as React from "react";

import { Player } from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Augmentations} from "../Augmentations";

function calculateAugmentedStats() {
    const augP: any = {};
    for(const aug of Player.queuedAugmentations) {
        const augObj = Augmentations[aug.name];
        for (const mult in augObj.mults) {
            const v = augP[mult] ? augP[mult] : 1;
            augP[mult] = v * augObj.mults[mult];
        }
    }
    return augP;
}

export function PlayerMultipliers(): React.ReactElement {
    const mults = calculateAugmentedStats();
    function MultiplierTable(rows: any[]): React.ReactElement {
        function improvements(r: number) {
            let elems: any[] = [];
            if(r) {
                elems = [
                    <td key="2">&nbsp;{"=>"}&nbsp;</td>,
                    <td key="3">{numeralWrapper.formatPercentage(r)}</td>,
                ];
            }
            return elems;
        }

        return <table>
            <tbody>
                {rows.map((r: any) => <tr key={r[0]}>
                    <td key="0"><span>{r[0]} multiplier:&nbsp;</span></td>
                    <td key="1" style={{textAlign: 'right'}}>{numeralWrapper.formatPercentage(r[1])}</td>
                    {improvements(r[2])}
                </tr>)}
            </tbody>
        </table>
    }

    return (
        <>
        <p><strong><u>Multipliers:</u></strong></p><br />
        {MultiplierTable([
            ['Hacking Chance ', Player.hacking_chance_mult, Player.hacking_chance_mult*mults.hacking_chance_mult],
            ['Hacking Speed ', Player.hacking_speed_mult, Player.hacking_speed_mult*mults.hacking_speed_mult],
            ['Hacking Money ', Player.hacking_money_mult, Player.hacking_money_mult*mults.hacking_money_mult],
            ['Hacking Growth ', Player.hacking_grow_mult, Player.hacking_grow_mult*mults.hacking_grow_mult],
        ])}<br />

        {MultiplierTable([
            ['Hacking Level ', Player.hacking_mult, Player.hacking_mult*mults.hacking_mult],
            ['Hacking Experience ', Player.hacking_exp_mult, Player.hacking_exp_mult*mults.hacking_exp_mult],
        ])}<br />


        {MultiplierTable([
            ['Strength Level ', Player.strength_mult, Player.strength_mult*mults.strength_mult],
            ['Strength Experience ', Player.strength_exp_mult, Player.strength_exp_mult*mults.strength_exp_mult],
        ])}<br />

        {MultiplierTable([
            ['Defense Level ', Player.defense_mult, Player.defense_mult*mults.defense_mult],
            ['Defense Experience ', Player.defense_exp_mult, Player.defense_exp_mult*mults.defense_exp_mult],
        ])}<br />

        {MultiplierTable([
            ['Dexterity Level ', Player.dexterity_mult, Player.dexterity_mult*mults.dexterity_mult],
            ['Dexterity Experience ', Player.dexterity_exp_mult, Player.dexterity_exp_mult*mults.dexterity_exp_mult],
        ])}<br />

        {MultiplierTable([
            ['Agility Level ', Player.agility_mult, Player.agility_mult*mults.agility_mult],
            ['Agility Experience ', Player.agility_exp_mult, Player.agility_exp_mult*mults.agility_exp_mult],
        ])}<br />

        {MultiplierTable([
            ['Charisma Level ', Player.charisma_mult, Player.charisma_mult*mults.charisma_mult],
            ['Charisma Experience ', Player.charisma_exp_mult, Player.charisma_exp_mult*mults.charisma_exp_mult],
        ])}<br />

        {MultiplierTable([
            ['Hacknet Node production ', Player.hacknet_node_money_mult, Player.hacknet_node_money_mult*mults.hacknet_node_money_mult],
            ['Hacknet Node purchase cost ', Player.hacknet_node_purchase_cost_mult, Player.hacknet_node_purchase_cost_mult*mults.hacknet_node_purchase_cost_mult],
            ['Hacknet Node RAM upgrade cost ', Player.hacknet_node_ram_cost_mult, Player.hacknet_node_ram_cost_mult*mults.hacknet_node_ram_cost_mult],
            ['Hacknet Node Core purchase cost ', Player.hacknet_node_core_cost_mult, Player.hacknet_node_core_cost_mult*mults.hacknet_node_core_cost_mult],
            ['Hacknet Node level upgrade cost ', Player.hacknet_node_level_cost_mult, Player.hacknet_node_level_cost_mult*mults.hacknet_node_level_cost_mult],
        ])}<br />

        {MultiplierTable([
            ['Company reputation gain ', Player.company_rep_mult, Player.company_rep_mult*mults.company_rep_mult],
            ['Faction reputation gain ', Player.faction_rep_mult, Player.faction_rep_mult*mults.faction_rep_mult],
            ['Salary ', Player.work_money_mult, Player.work_money_mult*mults.work_money_mult],
        ])}<br />

        {MultiplierTable([
            ['Crime success ', Player.crime_success_mult, Player.crime_success_mult*mults.crime_success_mult],
            ['Crime money ', Player.crime_money_mult, Player.crime_money_mult*mults.crime_money_mult],
        ])}<br />
        </>
    )
}
