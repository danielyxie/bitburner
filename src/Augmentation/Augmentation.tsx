// Class definition for a single Augmentation object
import * as React from "react";
import { IMap } from "../types";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";
import { numeralWrapper } from "../ui/numeralFormat";
import { Money } from "../ui/React/Money";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

interface IConstructorParams {
    info: string | JSX.Element;
    stats?: JSX.Element;
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

    startingMoney?: number;
    programs?: string[];
}

function generateStatsDescription(mults: IMap<number>, programs?: string[], startingMoney?: number): JSX.Element {
    const f = (x: number, decimals: number = 0) => {
        // look, I don't know how to make a "smart decimals"
        // todo, make it smarter
        if(x === 1.0777-1) return "7.77%";
        if(x === 1.777-1) return "77.7%";
        return numeralWrapper.formatPercentage(x, decimals);
    };
    let desc = <>This augmentation: </>;

    if(mults.hacking_mult &&
        mults.hacking_mult == mults.strength_mult &&
        mults.hacking_mult == mults.defense_mult &&
        mults.hacking_mult == mults.dexterity_mult &&
        mults.hacking_mult == mults.agility_mult &&
        mults.hacking_mult == mults.charisma_mult){
        desc = <>{desc}<br />- Increases all skills by {f(mults.hacking_mult-1)}</>
    } else {
        if(mults.hacking_mult)
            desc = <>{desc}<br />- Increases Hacking by {f(mults.hacking_mult-1)}</>

        if(mults.strength_mult &&
            mults.strength_mult == mults.defense_mult &&
            mults.strength_mult == mults.dexterity_mult &&
            mults.strength_mult == mults.agility_mult) {
            desc = <>{desc}<br />- Increases all combat skills by {f(mults.strength_mult-1)}</>
        } else {
            if(mults.strength_mult)
                desc = <>{desc}<br />- Increases Strength by {f(mults.strength_mult-1)}</>
            if(mults.defense_mult)
                desc = <>{desc}<br />- Increases Defense by {f(mults.defense_mult-1)}</>
            if(mults.dexterity_mult)
                desc = <>{desc}<br />- Increases Dexterity by {f(mults.dexterity_mult-1)}</>
            if(mults.agility_mult)
                desc = <>{desc}<br />- Increases Agility by {f(mults.agility_mult-1)}</>
        }
        if(mults.charisma_mult)
            desc = <>{desc}<br />- Increases Charisma by {f(mults.charisma_mult-1)}</>
    }

    if(mults.hacking_exp_mult && 
        mults.hacking_exp_mult === mults.strength_exp_mult &&
        mults.hacking_exp_mult === mults.defense_exp_mult &&
        mults.hacking_exp_mult === mults.dexterity_exp_mult &&
        mults.hacking_exp_mult === mults.agility_exp_mult &&
        mults.hacking_exp_mult === mults.charisma_exp_mult) {
        desc = <>{desc}<br />- Increases experience gain for all skills by {f(mults.hacking_exp_mult-1)}</>
    } else {
        if(mults.hacking_exp_mult)
            desc = <>{desc}<br />- Increases Hacking experience gain by {f(mults.hacking_exp_mult-1)}</>

        if(mults.strength_exp_mult && 
            mults.strength_exp_mult === mults.defense_exp_mult &&
            mults.strength_exp_mult === mults.dexterity_exp_mult &&
            mults.strength_exp_mult === mults.agility_exp_mult) {
            desc = <>{desc}<br />- Increases experience gain for all combat skills by {f(mults.strength_exp_mult-1)}</>
        } else {
            if(mults.strength_exp_mult)
                desc = <>{desc}<br />- Increases Strength experience gain by {f(mults.strength_exp_mult-1)}</>
            if(mults.defense_exp_mult)
                desc = <>{desc}<br />- Increases Defense experience gain by {f(mults.defense_exp_mult-1)}</>
            if(mults.dexterity_exp_mult)
                desc = <>{desc}<br />- Increases Dexterity experience gain by {f(mults.dexterity_exp_mult-1)}</>
            if(mults.agility_exp_mult)
                desc = <>{desc}<br />- Increases Agility experience gain by {f(mults.agility_exp_mult-1)}</>
        }
        if(mults.charisma_exp_mult)
            desc = <>{desc}<br />- Increases Charisma experience gain by {f(mults.charisma_exp_mult-1)}</>
    }

    if(mults.hacking_speed_mult)
        desc = <>{desc}<br />- Increases Hacking speed by {f(mults.hacking_speed_mult-1)}</>
    if(mults.hacking_chance_mult)
        desc = <>{desc}<br />- Increases hack() success chance by {f(mults.hacking_chance_mult-1)}</>
    if(mults.hacking_money_mult)
        desc = <>{desc}<br />- Increases hack() power by {f(mults.hacking_money_mult-1)}</>
    if(mults.hacking_grow_mult)
        desc = <>{desc}<br />- Increases grow() by {f(mults.hacking_grow_mult-1)}</>

    if(mults.faction_rep_mult &&
        mults.faction_rep_mult === mults.company_rep_mult) {
        desc = <>{desc}<br />- Increases reputation gain from factions and companies by {f(mults.faction_rep_mult-1)}</>
    } else {
        if(mults.faction_rep_mult)
            desc = <>{desc}<br />- Increases reputation gain from factions by {f(mults.faction_rep_mult-1)}</>
        if(mults.company_rep_mult)
            desc = <>{desc}<br />- Increases reputation gain from companies by {f(mults.company_rep_mult-1)}</>
    }

    if(mults.crime_money_mult)
        desc = <>{desc}<br />- Increases money gained from committing crimes by {f(mults.crime_money_mult-1)}</>
    if(mults.crime_success_mult)
        desc = <>{desc}<br />- Increases crime success rate by {f(mults.crime_success_mult-1)}</>
    if(mults.work_money_mult)
        desc = <>{desc}<br />- Increases money gained from working by {f(mults.work_money_mult-1)}</>

    if(mults.hacknet_node_money_mult)
        desc = <>{desc}<br />- Increases Hacknet production by {f(mults.hacknet_node_money_mult-1)}</>
    if(mults.hacknet_node_purchase_cost_mult)
        desc = <>{desc}<br />- Decreases the purchase cost of Hacknet Nodes by {f(-(mults.hacknet_node_purchase_cost_mult-1))}</>
    if(mults.hacknet_node_level_cost_mult)
        desc = <>{desc}<br />- Decreases the upgrade cost of Hacknet Nodes by {f(-(mults.hacknet_node_level_cost_mult-1))}</>

    if(mults.bladeburner_max_stamina_mult)
        desc = <>{desc}<br />- Increases Bladeburner Max Stamina by {f(mults.bladeburner_max_stamina_mult-1)}</>
    if(mults.bladeburner_stamina_gain_mult)
        desc = <>{desc}<br />- Increases Bladeburner Stamina gain by {f(mults.bladeburner_stamina_gain_mult-1)}</>
    if(mults.bladeburner_analysis_mult)
        desc = <>{desc}<br />- Increases Bladeburner Field Analysis effectiveness by {f(mults.bladeburner_analysis_mult-1)}</>
    if(mults.bladeburner_success_chance_mult)
        desc = <>{desc}<br />- Increases success chance in Bladeburner Contracts and Operations by {f(mults.bladeburner_success_chance_mult-1)}</>

    if(startingMoney)
        desc = <>{desc}<br />- Provides {Money(startingMoney)} after a reset.</>

    if(programs)
        desc = <>{desc}<br />- Provides {programs.join(' and ')} after a reset.</>
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
    stats: JSX.Element;

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

        this.baseRepRequirement = params.repCost * BitNodeMultipliers.AugmentationRepCost;
        this.baseCost = params.moneyCost * BitNodeMultipliers.AugmentationMoneyCost;
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

        if(params.stats)
            this.stats = params.stats;
        else 
            this.stats = generateStatsDescription(this.mults, params.programs, params.startingMoney);
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
