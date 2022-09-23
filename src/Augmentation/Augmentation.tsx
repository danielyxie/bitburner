// Class definition for a single Augmentation object
import * as React from "react";

import { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";
import { numeralWrapper } from "../ui/numeralFormat";
import { Money } from "../ui/React/Money";

import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";
import { FactionNames } from "../Faction/data/FactionNames";
import { IPlayer } from "../PersonObjects/IPlayer";
import { AugmentationNames } from "./data/AugmentationNames";
import { CONSTANTS } from "../Constants";
import { StaticAugmentations } from "./StaticAugmentations";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { getBaseAugmentationPriceMultiplier, getGenericAugmentationPriceMultiplier } from "./AugmentationHelpers";
import { initSoAAugmentations } from "./data/AugmentationCreator";
import { Multipliers, defaultMultipliers } from "../PersonObjects/Multipliers";

export interface AugmentationCosts {
  moneyCost: number;
  repCost: number;
}

export interface IConstructorParams {
  info: string | JSX.Element;
  stats?: JSX.Element | null;
  isSpecial?: boolean;
  moneyCost: number;
  name: string;
  prereqs?: string[];
  repCost: number;
  factions: string[];

  hacking?: number;
  strength?: number;
  defense?: number;
  dexterity?: number;
  agility?: number;
  charisma?: number;
  hacking_exp?: number;
  strength_exp?: number;
  defense_exp?: number;
  dexterity_exp?: number;
  agility_exp?: number;
  charisma_exp?: number;
  hacking_chance?: number;
  hacking_speed?: number;
  hacking_money?: number;
  hacking_grow?: number;
  company_rep?: number;
  faction_rep?: number;
  crime_money?: number;
  crime_success?: number;
  work_money?: number;
  hacknet_node_money?: number;
  hacknet_node_purchase_cost?: number;
  hacknet_node_ram_cost?: number;
  hacknet_node_core_cost?: number;
  hacknet_node_level_cost?: number;
  bladeburner_max_stamina?: number;
  bladeburner_stamina_gain?: number;
  bladeburner_analysis?: number;
  bladeburner_success_chance?: number;

  startingMoney?: number;
  programs?: string[];
}

function generateStatsDescription(mults: Multipliers, programs?: string[], startingMoney?: number): JSX.Element {
  const f = (x: number, decimals = 0): string => {
    // look, I don't know how to make a "smart decimals"
    // todo, make it smarter
    if (x === 1.0777 - 1) return "7.77%";
    if (x === 1.777 - 1) return "77.7%";
    return numeralWrapper.formatPercentage(x, decimals);
  };
  let desc = <>Effects:</>;

  if (
    mults.hacking !== 1 &&
    mults.hacking == mults.strength &&
    mults.hacking == mults.defense &&
    mults.hacking == mults.dexterity &&
    mults.hacking == mults.agility &&
    mults.hacking == mults.charisma
  ) {
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking - 1)} all skills
      </>
    );
  } else {
    if (mults.hacking !== 1)
      desc = (
        <>
          {desc}
          <br />+{f(mults.hacking - 1)} hacking skill
        </>
      );

    if (
      mults.strength !== 1 &&
      mults.strength == mults.defense &&
      mults.strength == mults.dexterity &&
      mults.strength == mults.agility
    ) {
      desc = (
        <>
          {desc}
          <br />+{f(mults.strength - 1)} combat skills
        </>
      );
    } else {
      if (mults.strength !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.strength - 1)} strength skill
          </>
        );
      if (mults.defense !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.defense - 1)} defense skill
          </>
        );
      if (mults.dexterity !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.dexterity - 1)} dexterity skill
          </>
        );
      if (mults.agility !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.agility - 1)} agility skill
          </>
        );
    }
    if (mults.charisma !== 1)
      desc = (
        <>
          {desc}
          <br />+{f(mults.charisma - 1)} charisma skill
        </>
      );
  }

  if (
    mults.hacking_exp !== 1 &&
    mults.hacking_exp === mults.strength_exp &&
    mults.hacking_exp === mults.defense_exp &&
    mults.hacking_exp === mults.dexterity_exp &&
    mults.hacking_exp === mults.agility_exp &&
    mults.hacking_exp === mults.charisma_exp
  ) {
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_exp - 1)} exp for all skills
      </>
    );
  } else {
    if (mults.hacking_exp !== 1)
      desc = (
        <>
          {desc}
          <br />+{f(mults.hacking_exp - 1)} hacking exp
        </>
      );

    if (
      mults.strength_exp !== 1 &&
      mults.strength_exp === mults.defense_exp &&
      mults.strength_exp === mults.dexterity_exp &&
      mults.strength_exp === mults.agility_exp
    ) {
      desc = (
        <>
          {desc}
          <br />+{f(mults.strength_exp - 1)} combat exp
        </>
      );
    } else {
      if (mults.strength_exp !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.strength_exp - 1)} strength exp
          </>
        );
      if (mults.defense_exp !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.defense_exp - 1)} defense exp
          </>
        );
      if (mults.dexterity_exp !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.dexterity_exp - 1)} dexterity exp
          </>
        );
      if (mults.agility_exp !== 1)
        desc = (
          <>
            {desc}
            <br />+{f(mults.agility_exp - 1)} agility exp
          </>
        );
    }
    if (mults.charisma_exp !== 1)
      desc = (
        <>
          {desc}
          <br />+{f(mults.charisma_exp - 1)} charisma exp
        </>
      );
  }

  if (mults.hacking_speed !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_speed - 1)} faster hack(), grow(), and weaken()
      </>
    );
  if (mults.hacking_chance !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_chance - 1)} hack() success chance
      </>
    );
  if (mults.hacking_money !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_money - 1)} hack() power
      </>
    );
  if (mults.hacking_grow !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_grow - 1)} grow() power
      </>
    );

  if (mults.faction_rep !== 1 && mults.faction_rep === mults.company_rep) {
    desc = (
      <>
        {desc}
        <br />+{f(mults.faction_rep - 1)} reputation from factions and companies
      </>
    );
  } else {
    if (mults.faction_rep !== 1)
      desc = (
        <>
          {desc}
          <br />+{f(mults.faction_rep - 1)} reputation from factions
        </>
      );
    if (mults.company_rep !== 1)
      desc = (
        <>
          {desc}
          <br />+{f(mults.company_rep - 1)} reputation from companies
        </>
      );
  }

  if (mults.crime_money !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.crime_money - 1)} crime money
      </>
    );
  if (mults.crime_success !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.crime_success - 1)} crime success rate
      </>
    );
  if (mults.work_money !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.work_money - 1)} work money
      </>
    );

  if (mults.hacknet_node_money !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacknet_node_money - 1)} hacknet production
      </>
    );
  if (mults.hacknet_node_purchase_cost !== 1)
    desc = (
      <>
        {desc}
        <br />-{f(-(mults.hacknet_node_purchase_cost - 1))} hacknet nodes cost
      </>
    );
  if (mults.hacknet_node_level_cost !== 1)
    desc = (
      <>
        {desc}
        <br />-{f(-(mults.hacknet_node_level_cost - 1))} hacknet nodes upgrade cost
      </>
    );

  if (mults.bladeburner_max_stamina !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_max_stamina - 1)} Bladeburner Max Stamina
      </>
    );
  if (mults.bladeburner_stamina_gain !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_stamina_gain - 1)} Bladeburner Stamina gain
      </>
    );
  if (mults.bladeburner_analysis !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_analysis - 1)} Bladeburner Field Analysis effectiveness
      </>
    );
  if (mults.bladeburner_success_chance !== 1)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_success_chance - 1)} Bladeburner Contracts and Operations success chance
      </>
    );
  if (startingMoney)
    desc = (
      <>
        {desc}
        <br />
        Start with <Money money={startingMoney} /> after installing Augmentations.
      </>
    );

  if (programs)
    desc = (
      <>
        {desc}
        <br />
        Start with {programs.join(" and ")} after installing Augmentations.
      </>
    );
  return desc;
}

export class Augmentation {
  // How much money this costs to buy before multipliers
  baseCost = 0;

  // How much faction reputation is required to unlock this  before multipliers
  baseRepRequirement = 0;

  // Description of what this Aug is and what it does
  info: string | JSX.Element;

  // Description of the stats, often autogenerated, sometimes manually written.
  stats: JSX.Element | null;

  // Any Augmentation not immediately available in BitNode-1 is special (e.g. Bladeburner augs)
  isSpecial = false;

  // Name of Augmentation
  name = "";

  // Array of names of all prerequisites
  prereqs: string[] = [];

  // Multipliers given by this Augmentation.  Must match the property name in
  // The Player/Person classes
  mults: Multipliers = defaultMultipliers();

  // Factions that offer this aug.
  factions: string[] = [];

  constructor(
    params: IConstructorParams = {
      info: "",
      moneyCost: 0,
      name: "",
      repCost: 0,
      factions: [],
    },
  ) {
    this.name = params.name;
    this.info = params.info;
    this.prereqs = params.prereqs ? params.prereqs : [];

    this.baseRepRequirement = params.repCost;
    Object.freeze(this.baseRepRequirement);
    this.baseCost = params.moneyCost;
    Object.freeze(this.baseCost);
    this.factions = params.factions;

    if (params.isSpecial) {
      this.isSpecial = true;
    }

    // Set multipliers
    if (params.hacking) {
      this.mults.hacking = params.hacking;
    }
    if (params.strength) {
      this.mults.strength = params.strength;
    }
    if (params.defense) {
      this.mults.defense = params.defense;
    }
    if (params.dexterity) {
      this.mults.dexterity = params.dexterity;
    }
    if (params.agility) {
      this.mults.agility = params.agility;
    }
    if (params.charisma) {
      this.mults.charisma = params.charisma;
    }
    if (params.hacking_exp) {
      this.mults.hacking_exp = params.hacking_exp;
    }
    if (params.strength_exp) {
      this.mults.strength_exp = params.strength_exp;
    }
    if (params.defense_exp) {
      this.mults.defense_exp = params.defense_exp;
    }
    if (params.dexterity_exp) {
      this.mults.dexterity_exp = params.dexterity_exp;
    }
    if (params.agility_exp) {
      this.mults.agility_exp = params.agility_exp;
    }
    if (params.charisma_exp) {
      this.mults.charisma_exp = params.charisma_exp;
    }
    if (params.hacking_chance) {
      this.mults.hacking_chance = params.hacking_chance;
    }
    if (params.hacking_speed) {
      this.mults.hacking_speed = params.hacking_speed;
    }
    if (params.hacking_money) {
      this.mults.hacking_money = params.hacking_money;
    }
    if (params.hacking_grow) {
      this.mults.hacking_grow = params.hacking_grow;
    }
    if (params.company_rep) {
      this.mults.company_rep = params.company_rep;
    }
    if (params.faction_rep) {
      this.mults.faction_rep = params.faction_rep;
    }
    if (params.crime_money) {
      this.mults.crime_money = params.crime_money;
    }
    if (params.crime_success) {
      this.mults.crime_success = params.crime_success;
    }
    if (params.work_money) {
      this.mults.work_money = params.work_money;
    }
    if (params.hacknet_node_money) {
      this.mults.hacknet_node_money = params.hacknet_node_money;
    }
    if (params.hacknet_node_purchase_cost) {
      this.mults.hacknet_node_purchase_cost = params.hacknet_node_purchase_cost;
    }
    if (params.hacknet_node_ram_cost) {
      this.mults.hacknet_node_ram_cost = params.hacknet_node_ram_cost;
    }
    if (params.hacknet_node_core_cost) {
      this.mults.hacknet_node_core_cost = params.hacknet_node_core_cost;
    }
    if (params.hacknet_node_level_cost) {
      this.mults.hacknet_node_level_cost = params.hacknet_node_level_cost;
    }
    if (params.bladeburner_max_stamina) {
      this.mults.bladeburner_max_stamina = params.bladeburner_max_stamina;
    }
    if (params.bladeburner_stamina_gain) {
      this.mults.bladeburner_stamina_gain = params.bladeburner_stamina_gain;
    }
    if (params.bladeburner_analysis) {
      this.mults.bladeburner_analysis = params.bladeburner_analysis;
    }
    if (params.bladeburner_success_chance) {
      this.mults.bladeburner_success_chance = params.bladeburner_success_chance;
    }

    if (params.stats === undefined)
      this.stats = generateStatsDescription(this.mults, params.programs, params.startingMoney);
    else this.stats = params.stats;
  }

  // Adds this Augmentation to the specified Factions
  addToFactions(factionList: string[]): void {
    for (let i = 0; i < factionList.length; ++i) {
      const faction: Faction | null = Factions[factionList[i]];
      if (faction == null) {
        console.warn(`In Augmentation.addToFactions(), could not find faction with this name: ${factionList[i]}`);
        continue;
      }
      faction.augmentations.push(this.name);
    }
  }

  getCost(player: IPlayer): AugmentationCosts {
    const augmentationReference = StaticAugmentations[this.name];
    let moneyCost = augmentationReference.baseCost;
    let repCost = augmentationReference.baseRepRequirement;

    if (augmentationReference.name === AugmentationNames.NeuroFluxGovernor) {
      let nextLevel = this.getLevel(player);
      --nextLevel;
      const multiplier = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
      repCost = augmentationReference.baseRepRequirement * multiplier * BitNodeMultipliers.AugmentationRepCost;
      moneyCost = augmentationReference.baseCost * multiplier * BitNodeMultipliers.AugmentationMoneyCost;

      for (let i = 0; i < player.queuedAugmentations.length; ++i) {
        moneyCost *= getBaseAugmentationPriceMultiplier();
      }
    } else if (augmentationReference.factions.includes(FactionNames.ShadowsOfAnarchy)) {
      const soaAugmentationNames = initSoAAugmentations().map((augmentation) => augmentation.name);
      const soaMultiplier = Math.pow(
        CONSTANTS.SoACostMult,
        soaAugmentationNames.filter((augmentationName) => player.hasAugmentation(augmentationName)).length,
      );
      moneyCost = augmentationReference.baseCost * soaMultiplier;
      if (soaAugmentationNames.find((augmentationName) => augmentationName === augmentationReference.name)) {
        repCost = augmentationReference.baseRepRequirement * soaMultiplier;
      }
    } else {
      moneyCost =
        augmentationReference.baseCost *
        getGenericAugmentationPriceMultiplier() *
        BitNodeMultipliers.AugmentationMoneyCost;
      repCost = augmentationReference.baseRepRequirement * BitNodeMultipliers.AugmentationRepCost;
    }
    return { moneyCost, repCost };
  }

  getLevel(player: IPlayer): number {
    // Get current Neuroflux level based on Player's augmentations
    if (this.name === AugmentationNames.NeuroFluxGovernor) {
      let currLevel = 0;
      for (let i = 0; i < player.augmentations.length; ++i) {
        if (player.augmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
          currLevel = player.augmentations[i].level;
        }
      }

      // Account for purchased but uninstalled Augmentations
      for (let i = 0; i < player.queuedAugmentations.length; ++i) {
        if (player.queuedAugmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
          ++currLevel;
        }
      }
      return currLevel + 1;
    }
    return 0;
  }

  // Adds this Augmentation to all Factions
  addToAllFactions(): void {
    for (const fac of Object.keys(Factions)) {
      if (Factions.hasOwnProperty(fac)) {
        const facObj: Faction | null = Factions[fac];
        if (facObj == null) {
          console.warn(`Invalid Faction object in addToAllFactions(). Key value: ${fac}`);
          continue;
        }
        if (facObj.getInfo().special) continue;
        facObj.augmentations.push(this.name);
      }
    }
  }

  // Serialize the current object to a JSON save state.
  toJSON(): IReviverValue {
    return Generic_toJSON("Augmentation", this);
  }

  // Initializes a Augmentation object from a JSON save state.
  static fromJSON(value: IReviverValue): Augmentation {
    return Generic_fromJSON(Augmentation, value.data);
  }
}

Reviver.constructors.Augmentation = Augmentation;
