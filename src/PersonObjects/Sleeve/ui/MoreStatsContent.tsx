import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { StatsTable } from "../../../ui/React/StatsTable";
import * as React from "react";

interface IProps {
  sleeve: Sleeve;
}

export function MoreStatsContent(props: IProps): React.ReactElement {
  return (
    <>
      <StatsTable
        rows={[
          ["Hacking: ", props.sleeve.hacking_skill, `(${numeralWrapper.formatExp(props.sleeve.hacking_exp)} exp)`],
          ["Strength: ", props.sleeve.strength, `(${numeralWrapper.formatExp(props.sleeve.strength_exp)} exp)`],
          ["Defense: ", props.sleeve.defense, `(${numeralWrapper.formatExp(props.sleeve.defense_exp)} exp)`],
          ["Dexterity: ", props.sleeve.dexterity, `(${numeralWrapper.formatExp(props.sleeve.dexterity_exp)} exp)`],
          ["Agility: ", props.sleeve.agility, `(${numeralWrapper.formatExp(props.sleeve.agility_exp)} exp)`],
          ["Charisma: ", props.sleeve.charisma, `(${numeralWrapper.formatExp(props.sleeve.charisma_exp)} exp)`],
        ]}
        title="Stats:"
      />
      <br />
      <StatsTable
        rows={[
          ["Hacking Level multiplier: ", numeralWrapper.formatPercentage(props.sleeve.hacking_mult)],
          ["Hacking Experience multiplier: ", numeralWrapper.formatPercentage(props.sleeve.hacking_exp_mult)],
          ["Strength Level multiplier: ", numeralWrapper.formatPercentage(props.sleeve.strength_mult)],
          ["Strength Experience multiplier: ", numeralWrapper.formatPercentage(props.sleeve.strength_exp_mult)],
          ["Defense Level multiplier: ", numeralWrapper.formatPercentage(props.sleeve.defense_mult)],
          ["Defense Experience multiplier: ", numeralWrapper.formatPercentage(props.sleeve.defense_exp_mult)],
          ["Dexterity Level multiplier: ", numeralWrapper.formatPercentage(props.sleeve.dexterity_mult)],
          ["Dexterity Experience multiplier: ", numeralWrapper.formatPercentage(props.sleeve.dexterity_exp_mult)],
          ["Agility Level multiplier: ", numeralWrapper.formatPercentage(props.sleeve.agility_mult)],
          ["Agility Experience multiplier: ", numeralWrapper.formatPercentage(props.sleeve.agility_exp_mult)],
          ["Charisma Level multiplier: ", numeralWrapper.formatPercentage(props.sleeve.charisma_mult)],
          ["Charisma Experience multiplier: ", numeralWrapper.formatPercentage(props.sleeve.charisma_exp_mult)],
          ["Faction Reputation Gain multiplier: ", numeralWrapper.formatPercentage(props.sleeve.faction_rep_mult)],
          ["Company Reputation Gain multiplier: ", numeralWrapper.formatPercentage(props.sleeve.company_rep_mult)],
          ["Salary multiplier: ", numeralWrapper.formatPercentage(props.sleeve.work_money_mult)],
          ["Crime Money multiplier: ", numeralWrapper.formatPercentage(props.sleeve.crime_money_mult)],
          ["Crime Success multiplier: ", numeralWrapper.formatPercentage(props.sleeve.crime_success_mult)],
        ]}
        title="Multipliers:"
      />
    </>
  );
}
