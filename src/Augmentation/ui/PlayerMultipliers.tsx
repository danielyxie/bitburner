/**
 * React component for displaying the player's multipliers on the Augmentation UI page
 */
import * as React from "react";

import { Player } from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";

export function PlayerMultipliers(): React.ReactElement {
    return (
        <>
        <p><strong><u>Total Multipliers:</u></strong></p>

        <pre>
            {'Hacking Chance multiplier: ' + numeralWrapper.formatPercentage(Player.hacking_chance_mult)}
        </pre>
        <pre>
            {'Hacking Speed multiplier:  ' + numeralWrapper.formatPercentage(Player.hacking_speed_mult)}
        </pre>
        <pre>
            {'Hacking Money multiplier:  ' + numeralWrapper.formatPercentage(Player.hacking_money_mult)}
        </pre>
        <pre>
            {'Hacking Growth multiplier: ' + numeralWrapper.formatPercentage(Player.hacking_grow_mult)}
        </pre><br />
        <pre>
            {'Hacking Level multiplier:      ' + numeralWrapper.formatPercentage(Player.hacking_mult)}
        </pre>
        <pre>
            {'Hacking Experience multiplier: ' + numeralWrapper.formatPercentage(Player.hacking_exp_mult)}
        </pre>
        <br />
        <pre>
            {'Strength Level multiplier:      ' + numeralWrapper.formatPercentage(Player.strength_mult)}
        </pre>
        <pre>
            {'Strength Experience multiplier: ' + numeralWrapper.formatPercentage(Player.strength_exp_mult)}
        </pre>
        <br />
        <pre>
            {'Defense Level multiplier:      ' + numeralWrapper.formatPercentage(Player.defense_mult)}
        </pre>
        <pre>
            {'Defense Experience multiplier: ' + numeralWrapper.formatPercentage(Player.defense_exp_mult)}
        </pre><br />
        <pre>
            {'Dexterity Level multiplier:      ' + numeralWrapper.formatPercentage(Player.dexterity_mult)}
        </pre>
        <pre>
            {'Dexterity Experience multiplier: ' + numeralWrapper.formatPercentage(Player.dexterity_exp_mult)}
        </pre><br />
        <pre>
            {'Agility Level multiplier:      ' + numeralWrapper.formatPercentage(Player.agility_mult)}
        </pre>
        <pre>
            {'Agility Experience multiplier: ' + numeralWrapper.formatPercentage(Player.agility_exp_mult)}
        </pre><br />
        <pre>
            {'Charisma Level multiplier:      ' + numeralWrapper.formatPercentage(Player.charisma_mult)}
        </pre>
        <pre>
            {'Charisma Experience multiplier: ' + numeralWrapper.formatPercentage(Player.charisma_exp_mult)}
        </pre><br />
        <pre>
            {'Hacknet Node production multiplier:         ' + numeralWrapper.formatPercentage(Player.hacknet_node_money_mult)}
        </pre>
        <pre>
            {'Hacknet Node purchase cost multiplier:      ' + numeralWrapper.formatPercentage(Player.hacknet_node_purchase_cost_mult)}
        </pre>
        <pre>
            {'Hacknet Node RAM upgrade cost multiplier:   ' + numeralWrapper.formatPercentage(Player.hacknet_node_ram_cost_mult)}
        </pre>
        <pre>
            {'Hacknet Node Core purchase cost multiplier: ' + numeralWrapper.formatPercentage(Player.hacknet_node_core_cost_mult)}
        </pre>
        <pre>
            {'Hacknet Node level upgrade cost multiplier: ' + numeralWrapper.formatPercentage(Player.hacknet_node_level_cost_mult)}
        </pre><br />
        <pre>
            {'Company reputation gain multiplier: ' + numeralWrapper.formatPercentage(Player.company_rep_mult)}
        </pre>
        <pre>
            {'Faction reputation gain multiplier: ' + numeralWrapper.formatPercentage(Player.faction_rep_mult)}
        </pre>
        <pre>
            {'Salary multiplier: ' + numeralWrapper.formatPercentage(Player.work_money_mult)}
        </pre><br />
        <pre>
            {'Crime success multiplier: ' + numeralWrapper.formatPercentage(Player.crime_success_mult)}
        </pre>
        <pre>
            {'Crime money multiplier: ' + numeralWrapper.formatPercentage(Player.crime_money_mult)}
        </pre>
        </>
    )
}
