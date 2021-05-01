// Class definition for a single Augmentation object
import { CONSTANTS } from "../Constants";
import { IMap } from "../types";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

interface IConstructorParams {
    info: string;
    isSpecial?: boolean;
    moneyCost: number;
    name: string;
    prereqs?: string[];
    repCost: number;

    hacking_mult?: number;
    strength_mult?: number;
    defense_mult?: number;
    dexterity_mult?: number;
    agility_mult?: number;
    charisma_mult?: number;
    hacking_exp_mult?: number;
    strength_exp_mult?: number;
    defense_exp_mult?: number;
    dexterity_exp_mult?: number;
    agility_exp_mult?: number;
    charisma_exp_mult?: number;
    hacking_chance_mult?: number;
    hacking_speed_mult?: number;
    hacking_money_mult?: number;
    hacking_grow_mult?: number;
    company_rep_mult?: number;
    faction_rep_mult?: number;
    crime_money_mult?: number;
    crime_success_mult?: number;
    work_money_mult?: number;
    hacknet_node_money_mult?: number;
    hacknet_node_purchase_cost_mult?: number;
    hacknet_node_ram_cost_mult?: number;
    hacknet_node_core_cost_mult?: number;
    hacknet_node_level_cost_mult?: number;
    bladeburner_max_stamina_mult?: number;
    bladeburner_stamina_gain_mult?: number;
    bladeburner_analysis_mult?: number;
    bladeburner_success_chance_mult?: number;
}

export class Augmentation {

    // How much money this costs to buy
    baseCost = 0;

    // How much faction reputation is required to unlock this
    baseRepRequirement = 0;

    // Description of what this Aug is and what it does
    info = "";

    // Any Augmentation not immediately available in BitNode-1 is special (e.g. Bladeburner augs)
    isSpecial = false;

    // Augmentation level - for repeatable Augs like NeuroFlux Governor
    level = 0;

    // Name of Augmentation
    name = "";

    // Whether the player owns this Augmentation
    owned = false;

    // Array of names of all prerequisites
    prereqs: string[] = [];

    // Multipliers given by this Augmentation.  Must match the property name in
    // The Player/Person classes
    mults: IMap<number> = {}

    // Initial cost. Doesn't change when you purchase multiple Augmentation
    startingCost = 0;

    constructor(params: IConstructorParams={ info: "", moneyCost: 0, name: "", repCost: 0 }) {
        this.name = params.name;
        this.info = params.info;
        this.prereqs = params.prereqs ? params.prereqs : [];

        this.baseRepRequirement = params.repCost * CONSTANTS.AugmentationRepMultiplier * BitNodeMultipliers.AugmentationRepCost;
        this.baseCost = params.moneyCost * CONSTANTS.AugmentationCostMultiplier * BitNodeMultipliers.AugmentationMoneyCost;
        this.startingCost = this.baseCost;

        if (params.isSpecial) {
            this.isSpecial = true;
        }

        this.level = 0;

        // Set multipliers
        if (params.hacking_mult) { this.mults.hacking_mult = params.hacking_mult; }
        if (params.strength_mult) { this.mults.strength_mult = params.strength_mult; }
        if (params.defense_mult) { this.mults.defense_mult = params.defense_mult; }
        if (params.dexterity_mult) { this.mults.dexterity_mult = params.dexterity_mult; }
        if (params.agility_mult) { this.mults.agility_mult = params.agility_mult; }
        if (params.charisma_mult) { this.mults.charisma_mult = params.charisma_mult; }
        if (params.hacking_exp_mult) { this.mults.hacking_exp_mult = params.hacking_exp_mult; }
        if (params.strength_exp_mult) { this.mults.strength_exp_mult = params.strength_exp_mult; }
        if (params.defense_exp_mult) { this.mults.defense_exp_mult = params.defense_exp_mult; }
        if (params.dexterity_exp_mult) { this.mults.dexterity_exp_mult = params.dexterity_exp_mult; }
        if (params.agility_exp_mult) { this.mults.agility_exp_mult = params.agility_exp_mult; }
        if (params.charisma_exp_mult) { this.mults.charisma_exp_mult = params.charisma_exp_mult; }
        if (params.hacking_chance_mult) { this.mults.hacking_chance_mult = params.hacking_chance_mult; }
        if (params.hacking_speed_mult) { this.mults.hacking_speed_mult = params.hacking_speed_mult; }
        if (params.hacking_money_mult) { this.mults.hacking_money_mult = params.hacking_money_mult; }
        if (params.hacking_grow_mult) { this.mults.hacking_grow_mult = params.hacking_grow_mult; }
        if (params.company_rep_mult) { this.mults.company_rep_mult = params.company_rep_mult; }
        if (params.faction_rep_mult) { this.mults.faction_rep_mult = params.faction_rep_mult; }
        if (params.crime_money_mult) { this.mults.crime_money_mult = params.crime_money_mult; }
        if (params.crime_success_mult) { this.mults.crime_success_mult = params.crime_success_mult; }
        if (params.work_money_mult) { this.mults.work_money_mult = params.work_money_mult; }
        if (params.hacknet_node_money_mult) { this.mults.hacknet_node_money_mult = params.hacknet_node_money_mult; }
        if (params.hacknet_node_purchase_cost_mult) { this.mults.hacknet_node_purchase_cost_mult = params.hacknet_node_purchase_cost_mult; }
        if (params.hacknet_node_ram_cost_mult) { this.mults.hacknet_node_ram_cost_mult = params.hacknet_node_ram_cost_mult; }
        if (params.hacknet_node_core_cost_mult) { this.mults.hacknet_node_core_cost_mult = params.hacknet_node_core_cost_mult; }
        if (params.hacknet_node_level_cost_mult) { this.mults.hacknet_node_level_cost_mult = params.hacknet_node_level_cost_mult; }
        if (params.bladeburner_max_stamina_mult) { this.mults.bladeburner_max_stamina_mult = params.bladeburner_max_stamina_mult; }
        if (params.bladeburner_stamina_gain_mult) { this.mults.bladeburner_stamina_gain_mult = params.bladeburner_stamina_gain_mult; }
        if (params.bladeburner_analysis_mult) { this.mults.bladeburner_analysis_mult = params.bladeburner_analysis_mult; }
        if (params.bladeburner_success_chance_mult) { this.mults.bladeburner_success_chance_mult = params.bladeburner_success_chance_mult; }
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
        for (const fac in Factions) {
            if (Factions.hasOwnProperty(fac)) {
                const facObj: Faction | null = Factions[fac];
                if (facObj == null) {
                    console.warn(`Invalid Faction object in addToAllFactions(). Key value: ${fac}`);
                    continue;
                }
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
