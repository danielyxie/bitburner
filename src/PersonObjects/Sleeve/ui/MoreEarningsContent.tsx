import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { Money } from "../../../ui/React/Money";
import * as React from "react";
import { StatsTable } from "../../../ui/React/StatsTable";

interface IProps {
  sleeve: Sleeve;
}

export function MoreEarningsContent(props: IProps): React.ReactElement {
  return (
    <>
      {StatsTable(
        [
          ["Money ", <Money money={props.sleeve.earningsForTask.money} />],
          ["Hacking Exp ", numeralWrapper.formatExp(props.sleeve.earningsForTask.hack)],
          ["Strength Exp ", numeralWrapper.formatExp(props.sleeve.earningsForTask.str)],
          ["Defense Exp ", numeralWrapper.formatExp(props.sleeve.earningsForTask.def)],
          ["Dexterity Exp ", numeralWrapper.formatExp(props.sleeve.earningsForTask.dex)],
          ["Agility Exp ", numeralWrapper.formatExp(props.sleeve.earningsForTask.agi)],
          ["Charisma Exp ", numeralWrapper.formatExp(props.sleeve.earningsForTask.cha)],
        ],
        "Earnings for Current Task:",
      )}
      <br />
      {StatsTable(
        [
          ["Money: ", <Money money={props.sleeve.earningsForPlayer.money} />],
          ["Hacking Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForPlayer.hack)],
          ["Strength Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForPlayer.str)],
          ["Defense Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForPlayer.def)],
          ["Dexterity Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForPlayer.dex)],
          ["Agility Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForPlayer.agi)],
          ["Charisma Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForPlayer.cha)],
        ],
        "Total Earnings for Host Consciousness:",
      )}
      <br />
      {StatsTable(
        [
          ["Money: ", <Money money={props.sleeve.earningsForSleeves.money} />],
          ["Hacking Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForSleeves.hack)],
          ["Strength Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForSleeves.str)],
          ["Defense Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForSleeves.def)],
          ["Dexterity Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForSleeves.dex)],
          ["Agility Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForSleeves.agi)],
          ["Charisma Exp: ", numeralWrapper.formatExp(props.sleeve.earningsForSleeves.cha)],
        ],
        "Total Earnings for Other Sleeves:",
      )}
      <br />
    </>
  );
}
