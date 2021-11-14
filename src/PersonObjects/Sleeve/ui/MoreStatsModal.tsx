import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { StatsTable } from "../../../ui/React/StatsTable";
import { Modal } from "../../../ui/React/Modal";
import React from "react";

interface IProps {
  open: boolean;
  onClose: () => void;
  sleeve: Sleeve;
}

export function MoreStatsModal(props: IProps): React.ReactElement {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <StatsTable
        rows={[
          [
            <>Hacking:&nbsp;</>,
            props.sleeve.hacking,
            <>&nbsp;({numeralWrapper.formatExp(props.sleeve.hacking_exp)} exp)</>,
          ],
          [
            <>Strength:&nbsp;</>,
            props.sleeve.strength,
            <>&nbsp;({numeralWrapper.formatExp(props.sleeve.strength_exp)} exp)</>,
          ],
          [
            <>Defense:&nbsp;</>,
            props.sleeve.defense,
            <>&nbsp;({numeralWrapper.formatExp(props.sleeve.defense_exp)} exp)</>,
          ],
          [
            <>Dexterity:&nbsp;</>,
            props.sleeve.dexterity,
            <>&nbsp;({numeralWrapper.formatExp(props.sleeve.dexterity_exp)} exp)</>,
          ],
          [
            <>Agility:&nbsp;</>,
            props.sleeve.agility,
            <>&nbsp;({numeralWrapper.formatExp(props.sleeve.agility_exp)} exp)</>,
          ],
          [
            <>Charisma:&nbsp;</>,
            props.sleeve.charisma,
            <>&nbsp;({numeralWrapper.formatExp(props.sleeve.charisma_exp)} exp)</>,
          ],
        ]}
        title="Stats:"
      />
      <br />
      <StatsTable
        rows={[
          [<>Hacking Level multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.hacking_mult)],
          [<>Hacking Experience multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.hacking_exp_mult)],
          [<>Strength Level multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.strength_mult)],
          [<>Strength Experience multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.strength_exp_mult)],
          [<>Defense Level multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.defense_mult)],
          [<>Defense Experience multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.defense_exp_mult)],
          [<>Dexterity Level multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.dexterity_mult)],
          [
            <>Dexterity Experience multiplier:&nbsp;</>,
            numeralWrapper.formatPercentage(props.sleeve.dexterity_exp_mult),
          ],
          [<>Agility Level multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.agility_mult)],
          [<>Agility Experience multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.agility_exp_mult)],
          [<>Charisma Level multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.charisma_mult)],
          [<>Charisma Experience multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.charisma_exp_mult)],
          [
            <>Faction Reputation Gain multiplier:&nbsp;</>,
            numeralWrapper.formatPercentage(props.sleeve.faction_rep_mult),
          ],
          [
            <>Company Reputation Gain multiplier:&nbsp;</>,
            numeralWrapper.formatPercentage(props.sleeve.company_rep_mult),
          ],
          [<>Salary multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.work_money_mult)],
          [<>Crime Money multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.crime_money_mult)],
          [<>Crime Success multiplier:&nbsp;</>, numeralWrapper.formatPercentage(props.sleeve.crime_success_mult)],
        ]}
        title="Multipliers:"
      />
    </Modal>
  );
}
