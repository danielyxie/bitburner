import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { StatsTable } from "../../../ui/React/StatsTable";
import * as React from "react";

export function MoreStatsContent(sleeve: Sleeve): React.ReactElement {
    let style = {}
    style = {textAlign: 'right'};
    return (<>
        {StatsTable([
            ['Hacking: ', sleeve.hacking_skill, `(${numeralWrapper.formatBigNumber(sleeve.hacking_exp)} exp)`],
            ['Strength: ', sleeve.strength, `(${numeralWrapper.formatBigNumber(sleeve.strength_exp)} exp)`],
            ['Defense: ', sleeve.defense, `(${numeralWrapper.formatBigNumber(sleeve.defense_exp)} exp)`],
            ['Dexterity: ', sleeve.dexterity, `(${numeralWrapper.formatBigNumber(sleeve.dexterity_exp)} exp)`],
            ['Agility: ', sleeve.agility, `(${numeralWrapper.formatBigNumber(sleeve.agility_exp)} exp)`],
            ['Charisma: ', sleeve.charisma, `(${numeralWrapper.formatBigNumber(sleeve.charisma_exp)} exp)`],
        ], 'Stats:')}
        <br />
        {StatsTable([
            ['Hacking Level multiplier: ', numeralWrapper.formatPercentage(sleeve.hacking_mult)],
            ['Hacking Experience multiplier: ', numeralWrapper.formatPercentage(sleeve.hacking_exp_mult)],
            ['Strength Level multiplier: ', numeralWrapper.formatPercentage(sleeve.strength_mult)],
            ['Strength Experience multiplier: ', numeralWrapper.formatPercentage(sleeve.strength_exp_mult)],
            ['Defense Level multiplier: ', numeralWrapper.formatPercentage(sleeve.defense_mult)],
            ['Defense Experience multiplier: ', numeralWrapper.formatPercentage(sleeve.defense_exp_mult)],
            ['Dexterity Level multiplier: ', numeralWrapper.formatPercentage(sleeve.dexterity_mult)],
            ['Dexterity Experience multiplier: ', numeralWrapper.formatPercentage(sleeve.dexterity_exp_mult)],
            ['Agility Level multiplier: ', numeralWrapper.formatPercentage(sleeve.agility_mult)],
            ['Agility Experience multiplier: ', numeralWrapper.formatPercentage(sleeve.agility_exp_mult)],
            ['Charisma Level multiplier: ', numeralWrapper.formatPercentage(sleeve.charisma_mult)],
            ['Charisma Experience multiplier: ', numeralWrapper.formatPercentage(sleeve.charisma_exp_mult)],
            ['Faction Reputation Gain multiplier: ', numeralWrapper.formatPercentage(sleeve.faction_rep_mult)],
            ['Company Reputation Gain multiplier: ', numeralWrapper.formatPercentage(sleeve.company_rep_mult)],
            ['Salary multiplier: ', numeralWrapper.formatPercentage(sleeve.work_money_mult)],
            ['Crime Money multiplier: ', numeralWrapper.formatPercentage(sleeve.crime_money_mult)],
            ['Crime Success multiplier: ', numeralWrapper.formatPercentage(sleeve.crime_success_mult)],
        ], 'Multipliers:')}
    </>);
}