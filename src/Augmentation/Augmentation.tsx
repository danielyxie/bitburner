// Class definition for a single Augmentation object
import * as React from "react";

import { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";
import { numeralWrapper } from "../ui/numeralFormat";
import { Money } from "../ui/React/Money";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { IAugmentationMults } from "src/PersonObjects/IMults";

export interface IConstructorParams {
  info: string | JSX.Element;
  stats?: JSX.Element | null;
  isSpecial?: boolean;
  moneyCost: number;
  name: string;
  prereqs?: string[];
  repCost: number;
  factions: string[];

  mults?: {
    [mult: string]: number | undefined;

    hacking_chance?: number;
    hacking_speed?: number;
    hacking_money?: number;
    hacking_grow?: number;

    hacking?: number;
    hacking_exp?: number;

    strength?: number;
    strength_exp?: number;

    defense?: number;
    defense_exp?: number;

    dexterity?: number;
    dexterity_exp?: number;

    agility?: number;
    agility_exp?: number;

    charisma?: number;
    charisma_exp?: number;

    hacknet_node_money?: number;
    hacknet_node_purchase_cost?: number;
    hacknet_node_ram_cost?: number;
    hacknet_node_core_cost?: number;
    hacknet_node_level_cost?: number;

    company_rep?: number;
    faction_rep?: number;
    work_money?: number;

    crime_success?: number;
    crime_money?: number;

    bladeburner_max_stamina?: number;
    bladeburner_stamina_gain?: number;
    bladeburner_analysis?: number;
    bladeburner_success_chance?: number;
  };

  startingMoney?: number;
  programs?: string[];
}

function generateStatsDescription(mults: IAugmentationMults, programs?: string[], startingMoney?: number): JSX.Element {
  const f = (x: number, decimals = 0): string => {
    // look, I don't know how to make a "smart decimals"
    // todo, make it smarter
    if (x === 1.0777 - 1) return "7.77%";
    if (x === 1.777 - 1) return "77.7%";
    return numeralWrapper.formatPercentage(x, decimals);
  };
  let desc = <>Effects:</>;

  if (
    mults.hacking &&
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
    if (mults.hacking)
      desc = (
        <>
          {desc}
          <br />+{f(mults.hacking - 1)} hacking skill
        </>
      );

    if (
      mults.strength &&
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
      if (mults.strength)
        desc = (
          <>
            {desc}
            <br />+{f(mults.strength - 1)} strength skill
          </>
        );
      if (mults.defense)
        desc = (
          <>
            {desc}
            <br />+{f(mults.defense - 1)} defense skill
          </>
        );
      if (mults.dexterity)
        desc = (
          <>
            {desc}
            <br />+{f(mults.dexterity - 1)} dexterity skill
          </>
        );
      if (mults.agility)
        desc = (
          <>
            {desc}
            <br />+{f(mults.agility - 1)} agility skill
          </>
        );
    }
    if (mults.charisma)
      desc = (
        <>
          {desc}
          <br />+{f(mults.charisma - 1)} charisma skill
        </>
      );
  }

  if (
    mults.hacking_exp &&
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
    if (mults.hacking_exp)
      desc = (
        <>
          {desc}
          <br />+{f(mults.hacking_exp - 1)} hacking exp
        </>
      );

    if (
      mults.strength_exp &&
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
      if (mults.strength_exp)
        desc = (
          <>
            {desc}
            <br />+{f(mults.strength_exp - 1)} strength exp
          </>
        );
      if (mults.defense_exp)
        desc = (
          <>
            {desc}
            <br />+{f(mults.defense_exp - 1)} defense exp
          </>
        );
      if (mults.dexterity_exp)
        desc = (
          <>
            {desc}
            <br />+{f(mults.dexterity_exp - 1)} dexterity exp
          </>
        );
      if (mults.agility_exp)
        desc = (
          <>
            {desc}
            <br />+{f(mults.agility_exp - 1)} agility exp
          </>
        );
    }
    if (mults.charisma_exp)
      desc = (
        <>
          {desc}
          <br />+{f(mults.charisma_exp - 1)} charisma exp
        </>
      );
  }

  if (mults.hacking_speed)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_speed - 1)} faster hack(), grow(), and weaken()
      </>
    );
  if (mults.hacking_chance)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_chance - 1)} hack() success chance
      </>
    );
  if (mults.hacking_money)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_money - 1)} hack() power
      </>
    );
  if (mults.hacking_grow)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacking_grow - 1)} grow() power
      </>
    );

  if (mults.faction_rep && mults.faction_rep === mults.company_rep) {
    desc = (
      <>
        {desc}
        <br />+{f(mults.faction_rep - 1)} reputation from factions and companies
      </>
    );
  } else {
    if (mults.faction_rep)
      desc = (
        <>
          {desc}
          <br />+{f(mults.faction_rep - 1)} reputation from factions
        </>
      );
    if (mults.company_rep)
      desc = (
        <>
          {desc}
          <br />+{f(mults.company_rep - 1)} reputation from companies
        </>
      );
  }

  if (mults.crime_money)
    desc = (
      <>
        {desc}
        <br />+{f(mults.crime_money - 1)} crime money
      </>
    );
  if (mults.crime_success)
    desc = (
      <>
        {desc}
        <br />+{f(mults.crime_success - 1)} crime success rate
      </>
    );
  if (mults.work_money)
    desc = (
      <>
        {desc}
        <br />+{f(mults.work_money - 1)} work money
      </>
    );

  if (mults.hacknet_node_money)
    desc = (
      <>
        {desc}
        <br />+{f(mults.hacknet_node_money - 1)} hacknet production
      </>
    );
  if (mults.hacknet_node_purchase_cost)
    desc = (
      <>
        {desc}
        <br />-{f(-(mults.hacknet_node_purchase_cost - 1))} hacknet nodes cost
      </>
    );
  if (mults.hacknet_node_level_cost)
    desc = (
      <>
        {desc}
        <br />-{f(-(mults.hacknet_node_level_cost - 1))} hacknet nodes upgrade cost
      </>
    );

  if (mults.bladeburner_max_stamina)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_max_stamina - 1)} Bladeburner Max Stamina
      </>
    );
  if (mults.bladeburner_stamina_gain)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_stamina_gain - 1)} Bladeburner Stamina gain
      </>
    );
  if (mults.bladeburner_analysis)
    desc = (
      <>
        {desc}
        <br />+{f(mults.bladeburner_analysis - 1)} Bladeburner Field Analysis effectiveness
      </>
    );
  if (mults.bladeburner_success_chance)
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
  // How much money this costs to buy
  baseCost = 0;

  // How much faction reputation is required to unlock this
  baseRepRequirement = 0;

  // Description of what this Aug is and what it does
  info: string | JSX.Element;

  // Description of the stats, often autogenerated, sometimes manually written.
  stats: JSX.Element | null;

  // Any Augmentation not immediately available in BitNode-1 is special (e.g. Bladeburner augs)
  isSpecial = false;

  // Augmentation level - for repeatable Augs like NeuroFlux Governor
  level = 0;

  // Name of Augmentation
  name = "";

  // Array of names of all prerequisites
  prereqs: string[] = [];

  // Multipliers given by this Augmentation.  Must match the property name in
  // The Player/Person classes
  mults: IAugmentationMults = {};

  // Initial cost. Doesn't change when you purchase multiple Augmentation
  startingCost = 0;

  // Factions that offer this aug.
  factions: string[] = [];

  constructor(
    params: IConstructorParams = {
      info: "",
      moneyCost: 0,
      name: "",
      repCost: 0,
      factions: [],
      mults: {},
    },
  ) {
    this.name = params.name;
    this.info = params.info;
    this.prereqs = params.prereqs ? params.prereqs : [];

    this.baseRepRequirement = params.repCost;
    this.baseCost = params.moneyCost;
    this.startingCost = this.baseCost;
    this.factions = params.factions;

    if (params.isSpecial) {
      this.isSpecial = true;
    }

    this.level = 0;

    // Set multipliers
    Object.assign(this.mults, params.mults);

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
  toJSON(): any {
    return Generic_toJSON("Augmentation", this);
  }

  // Initiatizes a Augmentation object from a JSON save state.
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Augmentation {
    return Generic_fromJSON(Augmentation, value.data);
  }
}

Reviver.constructors.Augmentation = Augmentation;
