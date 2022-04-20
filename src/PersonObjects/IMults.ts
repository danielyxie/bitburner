export interface IPersonMults {
  [mult: string]: number;

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

export interface IAugmentationMults {
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
}
