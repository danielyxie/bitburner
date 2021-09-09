import React, { useState } from "react";
import { IPlayer } from "../../IPlayer";
import { Resleeve } from "../Resleeve";
import { Augmentations } from "../../../Augmentation/Augmentations";
import { generateResleeves, purchaseResleeve } from "../Resleeving";
import { Money } from "../../../ui/React/Money";

import { numeralWrapper } from "../../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../../utils/DialogBox";

interface IProps {
  resleeve: Resleeve;
  player: IPlayer;
}

export function ResleeveElem(props: IProps): React.ReactElement {
  const [aug, setAug] = useState(props.resleeve.augmentations[0].name);

  function openStats(): void {
    dialogBoxCreate(
      <>
        <h2>
          <u>Total Multipliers:</u>
        </h2>
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
      </>,
    );
  }

  function onAugChange(event: React.ChangeEvent<HTMLSelectElement>): void {
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
    <div className="resleeve-elem" style={{ display: "block" }}>
      <div className="resleeve-panel" style={{ width: "30%" }}>
        <p>
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
        </p>
        <button className="std-button" onClick={openStats}>
          Multipliers
        </button>
      </div>
      <div className="resleeve-panel" style={{ width: "50%" }}>
        <select className="resleeve-aug-selector dropdown" onChange={onAugChange}>
          {props.resleeve.augmentations.map((aug) => (
            <option key={aug.name} value={aug.name}>
              {aug.name}
            </option>
          ))}
        </select>
        <p>{currentAug !== undefined && currentAug.info}</p>
      </div>
      <div className="resleeve-panel" style={{ width: "20%" }}>
        <p>
          It costs <Money money={cost} player={props.player} /> to purchase this Sleeve.
        </p>
        <button className="std-button" onClick={purchase}>
          Purchase
        </button>
      </div>
    </div>
  );
}
