import { AugmentationStats } from "../ScriptEditor/NetscriptDefinitions";

export interface Multipliers {
  hacking_chance: number;
  hacking_speed: number;
  hacking_money: number;
  hacking_grow: number;
  hacking: number;
  hacking_exp: number;
  strength: number;
  strength_exp: number;
  defense: number;
  defense_exp: number;
  dexterity: number;
  dexterity_exp: number;
  agility: number;
  agility_exp: number;
  charisma: number;
  charisma_exp: number;
  hacknet_node_money: number;
  hacknet_node_purchase_cost: number;
  hacknet_node_ram_cost: number;
  hacknet_node_core_cost: number;
  hacknet_node_level_cost: number;
  company_rep: number;
  faction_rep: number;
  work_money: number;
  crime_success: number;
  crime_money: number;
  bladeburner_max_stamina: number;
  bladeburner_stamina_gain: number;
  bladeburner_analysis: number;
  bladeburner_success_chance: number;
}

export const defaultMultipliers = (): Multipliers => {
  return {
    hacking_chance: 1,
    hacking_speed: 1,
    hacking_money: 1,
    hacking_grow: 1,
    hacking: 1,
    hacking_exp: 1,
    strength: 1,
    strength_exp: 1,
    defense: 1,
    defense_exp: 1,
    dexterity: 1,
    dexterity_exp: 1,
    agility: 1,
    agility_exp: 1,
    charisma: 1,
    charisma_exp: 1,
    hacknet_node_money: 1,
    hacknet_node_purchase_cost: 1,
    hacknet_node_ram_cost: 1,
    hacknet_node_core_cost: 1,
    hacknet_node_level_cost: 1,
    company_rep: 1,
    faction_rep: 1,
    work_money: 1,
    crime_success: 1,
    crime_money: 1,
    bladeburner_max_stamina: 1,
    bladeburner_stamina_gain: 1,
    bladeburner_analysis: 1,
    bladeburner_success_chance: 1,
  };
};

export const mergeMultipliers = (m0: Multipliers, m1: Multipliers): Multipliers => {
  return {
    hacking_chance: m0.hacking_chance * m1.hacking_chance,
    hacking_speed: m0.hacking_speed * m1.hacking_speed,
    hacking_money: m0.hacking_money * m1.hacking_money,
    hacking_grow: m0.hacking_grow * m1.hacking_grow,
    hacking: m0.hacking * m1.hacking,
    hacking_exp: m0.hacking_exp * m1.hacking_exp,
    strength: m0.strength * m1.strength,
    strength_exp: m0.strength_exp * m1.strength_exp,
    defense: m0.defense * m1.defense,
    defense_exp: m0.defense_exp * m1.defense_exp,
    dexterity: m0.dexterity * m1.dexterity,
    dexterity_exp: m0.dexterity_exp * m1.dexterity_exp,
    agility: m0.agility * m1.agility,
    agility_exp: m0.agility_exp * m1.agility_exp,
    charisma: m0.charisma * m1.charisma,
    charisma_exp: m0.charisma_exp * m1.charisma_exp,
    hacknet_node_money: m0.hacknet_node_money * m1.hacknet_node_money,
    hacknet_node_purchase_cost: m0.hacknet_node_purchase_cost * m1.hacknet_node_purchase_cost,
    hacknet_node_ram_cost: m0.hacknet_node_ram_cost * m1.hacknet_node_ram_cost,
    hacknet_node_core_cost: m0.hacknet_node_core_cost * m1.hacknet_node_core_cost,
    hacknet_node_level_cost: m0.hacknet_node_level_cost * m1.hacknet_node_level_cost,
    company_rep: m0.company_rep * m1.company_rep,
    faction_rep: m0.faction_rep * m1.faction_rep,
    work_money: m0.work_money * m1.work_money,
    crime_success: m0.crime_success * m1.crime_success,
    crime_money: m0.crime_money * m1.crime_money,
    bladeburner_max_stamina: m0.bladeburner_max_stamina * m1.bladeburner_max_stamina,
    bladeburner_stamina_gain: m0.bladeburner_stamina_gain * m1.bladeburner_stamina_gain,
    bladeburner_analysis: m0.bladeburner_analysis * m1.bladeburner_analysis,
    bladeburner_success_chance: m0.bladeburner_success_chance * m1.bladeburner_success_chance,
  };
};

export const scaleMultipliers = (m0: Multipliers, v: number): Multipliers => {
  return {
    hacking_chance: (m0.hacking_chance - 1) * v + 1,
    hacking_speed: (m0.hacking_speed - 1) * v + 1,
    hacking_money: (m0.hacking_money - 1) * v + 1,
    hacking_grow: (m0.hacking_grow - 1) * v + 1,
    hacking: (m0.hacking - 1) * v + 1,
    hacking_exp: (m0.hacking_exp - 1) * v + 1,
    strength: (m0.strength - 1) * v + 1,
    strength_exp: (m0.strength_exp - 1) * v + 1,
    defense: (m0.defense - 1) * v + 1,
    defense_exp: (m0.defense_exp - 1) * v + 1,
    dexterity: (m0.dexterity - 1) * v + 1,
    dexterity_exp: (m0.dexterity_exp - 1) * v + 1,
    agility: (m0.agility - 1) * v + 1,
    agility_exp: (m0.agility_exp - 1) * v + 1,
    charisma: (m0.charisma - 1) * v + 1,
    charisma_exp: (m0.charisma_exp - 1) * v + 1,
    hacknet_node_money: (m0.hacknet_node_money - 1) * v + 1,
    hacknet_node_purchase_cost: (m0.hacknet_node_purchase_cost - 1) * v + 1,
    hacknet_node_ram_cost: (m0.hacknet_node_ram_cost - 1) * v + 1,
    hacknet_node_core_cost: (m0.hacknet_node_core_cost - 1) * v + 1,
    hacknet_node_level_cost: (m0.hacknet_node_level_cost - 1) * v + 1,
    company_rep: (m0.company_rep - 1) * v + 1,
    faction_rep: (m0.faction_rep - 1) * v + 1,
    work_money: (m0.work_money - 1) * v + 1,
    crime_success: (m0.crime_success - 1) * v + 1,
    crime_money: (m0.crime_money - 1) * v + 1,
    bladeburner_max_stamina: (m0.bladeburner_max_stamina - 1) * v + 1,
    bladeburner_stamina_gain: (m0.bladeburner_stamina_gain - 1) * v + 1,
    bladeburner_analysis: (m0.bladeburner_analysis - 1) * v + 1,
    bladeburner_success_chance: (m0.bladeburner_success_chance - 1) * v + 1,
  };
};
