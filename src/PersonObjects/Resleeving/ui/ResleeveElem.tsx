import React, { useState } from "react";
import { IPlayer } from "../../IPlayer";
import { Resleeve } from "../Resleeve";
import { Augmentations } from "../../../Augmentation/Augmentations";
import { purchaseResleeve } from "../Resleeving";
import { Money } from "../../../ui/React/Money";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";

interface IProps {
  resleeve: Resleeve;
  player: IPlayer;
}

export function ResleeveElem(props: IProps): React.ReactElement {
  const [aug, setAug] = useState(props.resleeve.augmentations[0].name);

  function openStats(): void {
    dialogBoxCreate(
      <>
        <Typography variant="h5" color="primary">
          Total Multipliers:
        </Typography>
        <Typography>
          Hacking Level multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacking_mult)}
          <br />
          Hacking Experience multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacking_exp_mult)}
          <br />
          Strength Level multiplier: {numeralWrapper.formatPercentage(props.resleeve.strength_mult)}
          <br />
          Strength Experience multiplier: {numeralWrapper.formatPercentage(props.resleeve.strength_exp_mult)}
          <br />
          Defense Level multiplier: {numeralWrapper.formatPercentage(props.resleeve.defense_mult)}
          <br />
          Defense Experience multiplier: {numeralWrapper.formatPercentage(props.resleeve.defense_exp_mult)}
          <br />
          Dexterity Level multiplier: {numeralWrapper.formatPercentage(props.resleeve.dexterity_mult)}
          <br />
          Dexterity Experience multiplier: {numeralWrapper.formatPercentage(props.resleeve.dexterity_exp_mult)}
          <br />
          Agility Level multiplier: {numeralWrapper.formatPercentage(props.resleeve.agility_mult)}
          <br />
          Agility Experience multiplier: {numeralWrapper.formatPercentage(props.resleeve.agility_exp_mult)}
          <br />
          Charisma Level multiplier: {numeralWrapper.formatPercentage(props.resleeve.charisma_mult)}
          <br />
          Charisma Experience multiplier: {numeralWrapper.formatPercentage(props.resleeve.charisma_exp_mult)}
          <br />
          Hacking Chance multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacking_chance_mult)}
          <br />
          Hacking Speed multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacking_speed_mult)}
          <br />
          Hacking Money multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacking_money_mult)}
          <br />
          Hacking Growth multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacking_grow_mult)}
          <br />
          Salary multiplier: {numeralWrapper.formatPercentage(props.resleeve.work_money_mult)}
          <br />
          Company Reputation Gain multiplier: {numeralWrapper.formatPercentage(props.resleeve.company_rep_mult)}
          <br />
          Faction Reputation Gain multiplier: {numeralWrapper.formatPercentage(props.resleeve.faction_rep_mult)}
          <br />
          Crime Money multiplier: {numeralWrapper.formatPercentage(props.resleeve.crime_money_mult)}
          <br />
          Crime Success multiplier: {numeralWrapper.formatPercentage(props.resleeve.crime_success_mult)}
          <br />
          Hacknet Income multiplier: {numeralWrapper.formatPercentage(props.resleeve.hacknet_node_money_mult)}
          <br />
          Hacknet Purchase Cost multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.hacknet_node_purchase_cost_mult)}
          <br />
          Hacknet Level Upgrade Cost multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.hacknet_node_level_cost_mult)}
          <br />
          Hacknet Ram Upgrade Cost multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.hacknet_node_ram_cost_mult)}
          <br />
          Hacknet Core Upgrade Cost multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.hacknet_node_core_cost_mult)}
          <br />
          Bladeburner Max Stamina multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.bladeburner_max_stamina_mult)}
          <br />
          Bladeburner Stamina Gain multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.bladeburner_stamina_gain_mult)}
          <br />
          Bladeburner Field Analysis multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.bladeburner_analysis_mult)}
          <br />
          Bladeburner Success Chance multiplier:
          {numeralWrapper.formatPercentage(props.resleeve.bladeburner_success_chance_mult)}
        </Typography>
      </>,
    );
  }

  function onAugChange(event: SelectChangeEvent<string>): void {
    setAug(event.target.value);
  }

  const currentAug = Augmentations[aug];
  const cost = props.resleeve.getCost();

  function purchase(): void {
    if (!purchaseResleeve(props.resleeve, props.player)) return;
    dialogBoxCreate(
      <>
        You re-sleeved for <Money money={cost} />!
      </>,
    );
  }

  return (
    <Paper sx={{ my: 1 }}>
      <Grid container>
        <Grid item xs={3}>
          <Typography>
            Hacking: {numeralWrapper.formatSkill(props.resleeve.hacking_skill)} (
            {numeralWrapper.formatExp(props.resleeve.hacking_exp)} exp)
            <br />
            Strength: {numeralWrapper.formatSkill(props.resleeve.strength)} (
            {numeralWrapper.formatExp(props.resleeve.strength_exp)} exp)
            <br />
            Defense: {numeralWrapper.formatSkill(props.resleeve.defense)} (
            {numeralWrapper.formatExp(props.resleeve.defense_exp)} exp)
            <br />
            Dexterity: {numeralWrapper.formatSkill(props.resleeve.dexterity)} (
            {numeralWrapper.formatExp(props.resleeve.dexterity_exp)} exp)
            <br />
            Agility: {numeralWrapper.formatSkill(props.resleeve.agility)} (
            {numeralWrapper.formatExp(props.resleeve.agility_exp)} exp)
            <br />
            Charisma: {numeralWrapper.formatSkill(props.resleeve.charisma)} (
            {numeralWrapper.formatExp(props.resleeve.charisma_exp)} exp)
            <br /># Augmentations: {props.resleeve.augmentations.length}
          </Typography>
          <Button onClick={openStats}>Multipliers</Button>
        </Grid>
        <Grid item xs={6}>
          <Select value={aug} onChange={onAugChange}>
            {props.resleeve.augmentations.map((aug) => (
              <MenuItem key={aug.name} value={aug.name}>
                {aug.name}
              </MenuItem>
            ))}
          </Select>
          <Typography>{currentAug !== undefined && currentAug.info}</Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography>
            It costs <Money money={cost} player={props.player} /> to purchase this Sleeve.
          </Typography>
          <Button onClick={purchase}>Purchase</Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
