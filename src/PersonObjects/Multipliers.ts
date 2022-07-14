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
