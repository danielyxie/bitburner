import { CONSTANTS } from "../../Constants";

import { Player } from "@player";
import { Multipliers } from "../Multipliers";

export const calculateEntropy = (stacks = 1): Multipliers => {
  const nerf = CONSTANTS.EntropyEffect ** stacks;
  return {
    hacking_chance: Player.mults.hacking_chance * nerf,
    hacking_speed: Player.mults.hacking_speed * nerf,
    hacking_money: Player.mults.hacking_money * nerf,
    hacking_grow: Player.mults.hacking_grow * nerf,

    hacking: Player.mults.hacking * nerf,
    strength: Player.mults.strength * nerf,
    defense: Player.mults.defense * nerf,
    dexterity: Player.mults.dexterity * nerf,
    agility: Player.mults.agility * nerf,
    charisma: Player.mults.charisma * nerf,

    hacking_exp: Player.mults.hacking_exp * nerf,
    strength_exp: Player.mults.strength_exp * nerf,
    defense_exp: Player.mults.defense_exp * nerf,
    dexterity_exp: Player.mults.dexterity_exp * nerf,
    agility_exp: Player.mults.agility_exp * nerf,
    charisma_exp: Player.mults.charisma_exp * nerf,

    company_rep: Player.mults.company_rep * nerf,
    faction_rep: Player.mults.faction_rep * nerf,

    crime_money: Player.mults.crime_money * nerf,
    crime_success: Player.mults.crime_success * nerf,

    hacknet_node_money: Player.mults.hacknet_node_money * nerf,
    hacknet_node_purchase_cost: Player.mults.hacknet_node_purchase_cost * nerf,
    hacknet_node_ram_cost: Player.mults.hacknet_node_ram_cost * nerf,
    hacknet_node_core_cost: Player.mults.hacknet_node_core_cost * nerf,
    hacknet_node_level_cost: Player.mults.hacknet_node_level_cost * nerf,

    work_money: Player.mults.work_money * nerf,

    bladeburner_max_stamina: Player.mults.bladeburner_max_stamina * nerf,
    bladeburner_stamina_gain: Player.mults.bladeburner_stamina_gain * nerf,
    bladeburner_analysis: Player.mults.bladeburner_analysis * nerf,
    bladeburner_success_chance: Player.mults.bladeburner_success_chance * nerf,
  };
};
