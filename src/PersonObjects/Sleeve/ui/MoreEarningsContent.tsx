import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import * as React from "react";
import { StatsTable } from "../../../ui/React/StatsTable";

export function MoreEarningsContent(sleeve: Sleeve): React.ReactElement {
    let style = {}
    style = {textAlign: 'right'};
    return (<>
        {StatsTable([
            ['Money ', numeralWrapper.formatMoney(sleeve.earningsForTask.money)],
            ['Hacking Exp ', numeralWrapper.formatBigNumber(sleeve.earningsForTask.hack)],
            ['Strength Exp ', numeralWrapper.formatBigNumber(sleeve.earningsForTask.str)],
            ['Defense Exp ', numeralWrapper.formatBigNumber(sleeve.earningsForTask.def)],
            ['Dexterity Exp ', numeralWrapper.formatBigNumber(sleeve.earningsForTask.dex)],
            ['Agility Exp ', numeralWrapper.formatBigNumber(sleeve.earningsForTask.agi)],
            ['Charisma Exp ', numeralWrapper.formatBigNumber(sleeve.earningsForTask.cha)],
        ], 'Earnings for Current Task:')}
        <br />
        {StatsTable([
            ['Money: ', numeralWrapper.formatMoney(sleeve.earningsForPlayer.money)],
            ['Hacking Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.hack)],
            ['Strength Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.str)],
            ['Defense Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.def)],
            ['Dexterity Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.dex)],
            ['Agility Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.agi)],
            ['Charisma Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForPlayer.cha)],
        ], 'Total Earnings for Host Consciousness:')}
        <br />
        {StatsTable([
            ['Money: ', numeralWrapper.formatMoney(sleeve.earningsForSleeves.money)],
            ['Hacking Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.hack)],
            ['Strength Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.str)],
            ['Defense Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.def)],
            ['Dexterity Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.dex)],
            ['Agility Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.agi)],
            ['Charisma Exp: ', numeralWrapper.formatBigNumber(sleeve.earningsForSleeves.cha)],
        ], 'Total Earnings for Other Sleeves:')}
        <br />
    </>);
}