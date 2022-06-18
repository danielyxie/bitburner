import { IMap } from "../../types";
import { CONSTANTS } from "../../Constants";

import { IPlayer } from "../IPlayer";

export const calculateEntropy = (player: IPlayer, stacks = 1): IMap<number> => {
  const multipliers: IMap<number> = {
    hacking_chance_mult: player.hacking_chance_mult,
    hacking_speed_mult: player.hacking_speed_mult,
    hacking_money_mult: player.hacking_money_mult,
    hacking_grow_mult: player.hacking_grow_mult,

    hacking_mult: player.hacking_mult,
    strength_mult: player.strength_mult,
    defense_mult: player.defense_mult,
    dexterity_mult: player.dexterity_mult,
    agility_mult: player.agility_mult,
    charisma_mult: player.charisma_mult,

    hacking_exp_mult: player.hacking_exp_mult,
    strength_exp_mult: player.strength_exp_mult,
    defense_exp_mult: player.defense_exp_mult,
    dexterity_exp_mult: player.dexterity_exp_mult,
    agility_exp_mult: player.agility_exp_mult,
    charisma_exp_mult: player.charisma_exp_mult,

    company_rep_mult: player.company_rep_mult,
    faction_rep_mult: player.faction_rep_mult,

    crime_money_mult: player.crime_money_mult,
    crime_success_mult: player.crime_success_mult,

    hacknet_node_money_mult: player.hacknet_node_money_mult,
    hacknet_node_purchase_cost_mult: player.hacknet_node_purchase_cost_mult,
    hacknet_node_ram_cost_mult: player.hacknet_node_ram_cost_mult,
    hacknet_node_core_cost_mult: player.hacknet_node_core_cost_mult,
    hacknet_node_level_cost_mult: player.hacknet_node_level_cost_mult,

    work_money_mult: player.work_money_mult,

    bladeburner_max_stamina_mult: player.bladeburner_max_stamina_mult,
    bladeburner_stamina_gain_mult: player.bladeburner_stamina_gain_mult,
    bladeburner_analysis_mult: player.bladeburner_analysis_mult,
    bladeburner_success_chance_mult: player.bladeburner_success_chance_mult,
  };

  for (const [mult, val] of Object.entries(multipliers)) {
    multipliers[mult] = val * CONSTANTS.EntropyEffect ** stacks;
  }

  return multipliers;
};
