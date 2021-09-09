import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { Money } from "../../../ui/React/Money";
import * as React from "react";
import { StatsTable } from "../../../ui/React/StatsTable";

export function MoreEarningsContent(sleeve: Sleeve): React.ReactElement {
  return (
    <>
      {StatsTable(
        [
          ["Money ", <Money money={sleeve.earningsForTask.money} />],
          ["Hacking Exp ", numeralWrapper.formatExp(sleeve.earningsForTask.hack)],
          ["Strength Exp ", numeralWrapper.formatExp(sleeve.earningsForTask.str)],
          ["Defense Exp ", numeralWrapper.formatExp(sleeve.earningsForTask.def)],
          ["Dexterity Exp ", numeralWrapper.formatExp(sleeve.earningsForTask.dex)],
          ["Agility Exp ", numeralWrapper.formatExp(sleeve.earningsForTask.agi)],
          ["Charisma Exp ", numeralWrapper.formatExp(sleeve.earningsForTask.cha)],
        ],
        "Earnings for Current Task:",
      )}
      <br />
      {StatsTable(
        [
          ["Money: ", <Money money={sleeve.earningsForPlayer.money} />],
          ["Hacking Exp: ", numeralWrapper.formatExp(sleeve.earningsForPlayer.hack)],
          ["Strength Exp: ", numeralWrapper.formatExp(sleeve.earningsForPlayer.str)],
          ["Defense Exp: ", numeralWrapper.formatExp(sleeve.earningsForPlayer.def)],
          ["Dexterity Exp: ", numeralWrapper.formatExp(sleeve.earningsForPlayer.dex)],
          ["Agility Exp: ", numeralWrapper.formatExp(sleeve.earningsForPlayer.agi)],
          ["Charisma Exp: ", numeralWrapper.formatExp(sleeve.earningsForPlayer.cha)],
        ],
        "Total Earnings for Host Consciousness:",
      )}
      <br />
      {StatsTable(
        [
          ["Money: ", <Money money={sleeve.earningsForSleeves.money} />],
          ["Hacking Exp: ", numeralWrapper.formatExp(sleeve.earningsForSleeves.hack)],
          ["Strength Exp: ", numeralWrapper.formatExp(sleeve.earningsForSleeves.str)],
          ["Defense Exp: ", numeralWrapper.formatExp(sleeve.earningsForSleeves.def)],
          ["Dexterity Exp: ", numeralWrapper.formatExp(sleeve.earningsForSleeves.dex)],
          ["Agility Exp: ", numeralWrapper.formatExp(sleeve.earningsForSleeves.agi)],
          ["Charisma Exp: ", numeralWrapper.formatExp(sleeve.earningsForSleeves.cha)],
        ],
        "Total Earnings for Other Sleeves:",
      )}
      <br />
    </>
  );
}
