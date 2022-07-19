import { CONSTANTS } from "../../Constants";

import { IPlayer } from "../IPlayer";
import { Multipliers } from "../Multipliers";

export const calculateEntropy = (player: IPlayer, stacks = 1): Multipliers => {
  const nerf = CONSTANTS.EntropyEffect ** stacks;
  return {
    hacking_chance: player.mults.hacking_chance * nerf,
    hacking_speed: player.mults.hacking_speed * nerf,
    hacking_money: player.mults.hacking_money * nerf,
    hacking_grow: player.mults.hacking_grow * nerf,

    hacking: player.mults.hacking * nerf,
    strength: player.mults.strength * nerf,
    defense: player.mults.defense * nerf,
    dexterity: player.mults.dexterity * nerf,
    agility: player.mults.agility * nerf,
    charisma: player.mults.charisma * nerf,

    hacking_exp: player.mults.hacking_exp * nerf,
    strength_exp: player.mults.strength_exp * nerf,
    defense_exp: player.mults.defense_exp * nerf,
    dexterity_exp: player.mults.dexterity_exp * nerf,
    agility_exp: player.mults.agility_exp * nerf,
    charisma_exp: player.mults.charisma_exp * nerf,

    company_rep: player.mults.company_rep * nerf,
    faction_rep: player.mults.faction_rep * nerf,

    crime_money: player.mults.crime_money * nerf,
    crime_success: player.mults.crime_success * nerf,

    hacknet_node_money: player.mults.hacknet_node_money * nerf,
    hacknet_node_purchase_cost: player.mults.hacknet_node_purchase_cost * nerf,
    hacknet_node_ram_cost: player.mults.hacknet_node_ram_cost * nerf,
    hacknet_node_core_cost: player.mults.hacknet_node_core_cost * nerf,
    hacknet_node_level_cost: player.mults.hacknet_node_level_cost * nerf,

    work_money: player.mults.work_money * nerf,

    bladeburner_max_stamina: player.mults.bladeburner_max_stamina * nerf,
    bladeburner_stamina_gain: player.mults.bladeburner_stamina_gain * nerf,
    bladeburner_analysis: player.mults.bladeburner_analysis * nerf,
    bladeburner_success_chance: player.mults.bladeburner_success_chance * nerf,
  };
};
