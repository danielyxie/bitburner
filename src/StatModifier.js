function StatModifier(params) {
    //Hacking multipliers
    this.hacking_chance_mult = params.hacking_chance_mult ? params.hacking_chance_mult : 1;
    this.hacking_speed_mult  = params.hacking_speed_mult  ? params.hacking_speed_mult  : 1;
    this.hacking_money_mult  = params.hacking_money_mult  ? params.hacking_money_mult  : 1;
    this.hacking_grow_mult   = params.hacking_grow_mult   ? params.hacking_grow_mult   : 1;

    this.hacking_mult   = params.hacking_mult   ? params.hacking_mult   : 1;
    this.strength_mult  = params.strength_mult  ? params.strength_mult  : 1;
    this.defense_mult   = params.defense_mult   ? params.defense_mult   : 1;
    this.dexterity_mult = params.dexterity_mult ? params.dexterity_mult : 1;
    this.agility_mult   = params.agility_mult   ? params.agility_mult   : 1;
    this.charisma_mult  = params.charisma_mult  ? params.charisma_mult  : 1;

    this.hacking_exp_mult   = params.hacking_exp_mult   ? params.hacking_exp_mult   : 1;
    this.strength_exp_mult  = params.strength_exp_mult  ? params.strength_exp_mult  : 1;
    this.defense_exp_mult   = params.defense_exp_mult   ? params.defense_exp_mult   : 1;
    this.dexterity_exp_mult = params.dexterity_exp_mult ? params.dexterity_exp_mult : 1;
    this.agility_exp_mult   = params.agility_exp_mult   ? params.agility_exp_mult   : 1;
    this.charisma_exp_mult  = params.charisma_exp_mult  ? params.charisma_exp_mult  : 1;

    this.company_rep_mult = params.company_rep_mult ? params.company_rep_mult : 1;
    this.faction_rep_mult = params.faction_rep_mult ? params.faction_rep_mult : 1;

    this.money = params.money ? params.money : 0;

    this.crime_money_mult   = params.crime_money_mult   ? params.crime_money_mult   : 1;
    this.crime_success_mult = params.crime_success_mult ? params.crime_success_mult : 1;

    this.work_money_mult = params.work_money_mult ? params.work_money_mult : 1;

    this.hasWseAccount   = params.hasWseAccount   ? params.hasWseAccount   : false;
    this.hasTixApiAccess = params.hasTixApiAccess ? params.hasTixApiAccess : false;

    this.hacknet_node_money_mult         = params.hacknet_node_money_mult         ? params.hacknet_node_money_mult         : 1;
    this.hacknet_node_purchase_cost_mult = params.hacknet_node_purchase_cost_mult ? params.hacknet_node_purchase_cost_mult : 1;
    this.hacknet_node_ram_cost_mult      = params.hacknet_node_ram_cost_mult      ? params.hacknet_node_ram_cost_mult      : 1;
    this.hacknet_node_core_cost_mult     = params.hacknet_node_core_cost_mult     ? params.hacknet_node_core_cost_mult     : 1;
    this.hacknet_node_level_cost_mult    = params.hacknet_node_level_cost_mult    ? params.hacknet_node_level_cost_mult    : 1;

    this.bladeburner_access              = params.bladeburner_access              ? params.bladeburner_access              :false;
    this.bladeburner_max_stamina_mult    = params.bladeburner_max_stamina_mult    ? params.bladeburner_max_stamina_mult    : 1;
    this.bladeburner_stamina_gain_mult   = params.bladeburner_stamina_gain_mult   ? params.bladeburner_stamina_gain_mult   : 1;
    this.bladeburner_analysis_mult       = params.bladeburner_analysis_mult       ? params.bladeburner_analysis_mult       : 1;
    this.bladeburner_success_chance_mult = params.bladeburner_success_chance_mult ? params.bladeburner_success_chance_mult : 1;

    this.programs = params.programs ? params.programs : [];

    // handle sing functions
    // handle corp access
    // handle unlock int
    // handle bn11 favor gets more money
    // handle short stock and wse limit/stop order
}

export {StatModifier};