function StatModifier(params) {
    //Hacking multipliers
    this.hacking_chance_mult = 1;
    this.hacking_speed_mult  = 1;
    this.hacking_money_mult  = 1;
    this.hacking_grow_mult   = 1;

    this.hacking_mult   = 1;
    this.strength_mult  = 1;
    this.defense_mult   = 1;
    this.dexterity_mult = 1;
    this.agility_mult   = 1;
    this.charisma_mult  = 1;

    this.hacking_exp_mult   = 1;
    this.strength_exp_mult  = 1;
    this.defense_exp_mult   = 1;
    this.dexterity_exp_mult = 1;
    this.agility_exp_mult   = 1;
    this.charisma_exp_mult  = 1;

    this.company_rep_mult = 1;
    this.faction_rep_mult = 1;

    this.money = 0;

    this.crime_money_mult   = 1;
    this.crime_success_mult = 1;

    this.work_money_mult = 1;

    this.hasWseAccount   = false;
    this.hasTixApiAccess = false;

    this.hacknet_node_money_mult         = 1;
    this.hacknet_node_purchase_cost_mult = 1;
    this.hacknet_node_ram_cost_mult      = 1;
    this.hacknet_node_core_cost_mult     = 1;
    this.hacknet_node_level_cost_mult    = 1;

    this.bladeburner_access              = false;
    this.bladeburner_max_stamina_mult    = 1;
    this.bladeburner_stamina_gain_mult   = 1;
    this.bladeburner_analysis_mult       = 1;
    this.bladeburner_success_chance_mult = 1;

    this.programs = [];

    Object.assign(this, params);
}


export {StatModifier};