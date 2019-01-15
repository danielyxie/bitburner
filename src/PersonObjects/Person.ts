// Base class representing a person-like object
import { BitNodeMultipliers } from "../BitNodeMultipliers";
import { Cities } from "../Locations/Cities";
import { CONSTANTS } from "../Constants";
import { IMap } from "../types";

// Interface for an object that represents the player (PlayerObject)
// Used because at the time of implementation, the PlayerObject
// cant be converted to TypeScript.
//
// Only contains the needed properties for Sleeve implementation
export interface IPlayer {
    companyName: string;
    factions: string[];
    jobs: IMap<string>;
    money: any;

    hacking_skill: number;
    strength: number;
    defense: number;
    dexterity: number;
    agility: number;
    charisma: number;
    intelligence: number;

    crime_success_mult: number;

    gainHackingExp(exp: number): void;
    gainStrengthExp(exp: number): void;
    gainDefenseExp(exp: number): void;
    gainDexterityExp(exp: number): void;
    gainAgilityExp(exp: number): void;
    gainCharismaExp(exp: number): void;
    gainMoney(money: number): void;
    loseMoney(money: number): void;
    startCrime(crimeType: string,
               hackExp: number,
               strExp: number,
               defExp: number,
               dexExp: number,
               agiExp: number,
               chaExp: number,
               money: number,
               time: number,
               singParams: any): void;
}

// Interface that defines a generic object used to track experience/money
// earnings for tasks
export interface ITaskTracker {
    hack: number;
    str: number;
    def: number;
    dex: number;
    agi: number;
    cha: number;
    money: number;
}

export function createTaskTracker(): ITaskTracker {
    return {
        hack: 0,
        str: 0,
        def: 0,
        dex: 0,
        agi: 0,
        cha: 0,
        money: 0,
    }
}

export abstract class Person {
    /**
     * Stats
     */
    hacking_skill: number = 1;
    strength: number = 1;
    defense: number = 1;
    dexterity: number = 1;
    agility: number = 1;
    charisma: number = 1;
    hp: number = 10;
    max_hp: number = 10;

    /**
     * Multipliers
     */
    hacking_exp: number = 0;
    strength_exp: number = 0;
    defense_exp: number = 0;
    dexterity_exp: number = 0;
    agility_exp: number = 0;
    charisma_exp: number = 0;
    intelligence_exp: number = 0;

    hacking_mult: number = 1;
    strength_mult: number = 1;
    defense_mult: number = 1;
    dexterity_mult: number = 1;
    agility_mult: number = 1;
    charisma_mult: number = 1;

    hacking_exp_mult: number = 1;
    strength_exp_mult: number = 1;
    defense_exp_mult: number = 1;
    dexterity_exp_mult: number = 1;
    agility_exp_mult: number = 1;
    charisma_exp_mult: number = 1;

    company_rep_mult: number = 1;
    faction_rep_mult: number = 1;

    crime_money_mult: number = 1;
    crime_success_mult: number = 1;

    work_money_mult: number = 1;

    /**
     * Augmentations
     */
    augmentations: string[] = [];
    queuedAugmentations: string[] = [];

    /**
     * City that the person is in
     */
    city: string = Cities.Sector12;

    constructor() {}

    /**
     * Given an experience amount and stat multiplier, calculates the
     * stat level. Stat-agnostic (same formula for every stat)
     */
    calculateStat(exp: number, mult: number=1): number {
        return Math.max(Math.floor(mult*(32 * Math.log(exp + 534.5) - 200)), 1);
    }

    /**
     * Calculate and return the amount of faction reputation earned per cycle
     * when doing Field Work for a faction
     */
    getFactionFieldWorkRepGain(): number {
        const t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
                         this.strength       / CONSTANTS.MaxSkillLevel +
                         this.defense        / CONSTANTS.MaxSkillLevel +
                         this.dexterity      / CONSTANTS.MaxSkillLevel +
                         this.agility        / CONSTANTS.MaxSkillLevel +
                         this.charisma       / CONSTANTS.MaxSkillLevel) / 5.5;
        return t * this.faction_rep_mult;
    }

    /**
     * Calculate and return the amount of faction reputation earned per cycle
     * when doing Hacking Work for a faction
     */
    getFactionHackingWorkRepGain(): number {
        return this.hacking_skill / CONSTANTS.MaxSkillLevel * this.faction_rep_mult;
    }

    /**
     * Calculate and return the amount of faction reputation earned per cycle
     * when doing Security Work for a faction
     */
    getFactionSecurityWorkRepGain(): number {
        const t = 0.9 * (this.hacking_skill  / CONSTANTS.MaxSkillLevel +
                         this.strength       / CONSTANTS.MaxSkillLevel +
                         this.defense        / CONSTANTS.MaxSkillLevel +
                         this.dexterity      / CONSTANTS.MaxSkillLevel +
                         this.agility        / CONSTANTS.MaxSkillLevel) / 4.5;
        return t * this.faction_rep_mult;
    }



    /**
     * Reset all multipliers to 1
     */
    resetMultipliers(): void {
        this.hacking_mult       = 1;
        this.strength_mult      = 1;
        this.defense_mult       = 1;
        this.dexterity_mult     = 1;
        this.agility_mult       = 1;
        this.charisma_mult      = 1;

        this.hacking_exp_mult    = 1;
        this.strength_exp_mult   = 1;
        this.defense_exp_mult    = 1;
        this.dexterity_exp_mult  = 1;
        this.agility_exp_mult    = 1;
        this.charisma_exp_mult   = 1;

        this.company_rep_mult    = 1;
        this.faction_rep_mult    = 1;

        this.crime_money_mult       = 1;
        this.crime_success_mult     = 1;

        this.work_money_mult = 1;
    }

    /**
     * Update all stat levels
     */
    updateStatLevels(): void {
        this.hacking_skill = Math.max(1, Math.floor(this.calculateStat(this.hacking_exp, this.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier)));
    	this.strength      = Math.max(1, Math.floor(this.calculateStat(this.strength_exp, this.strength_mult)));
        this.defense       = Math.max(1, Math.floor(this.calculateStat(this.defense_exp, this.defense_mult)));
        this.dexterity     = Math.max(1, Math.floor(this.calculateStat(this.dexterity_exp, this.dexterity_mult)));
        this.agility       = Math.max(1, Math.floor(this.calculateStat(this.agility_exp, this.agility_mult)));
        this.charisma      = Math.max(1, Math.floor(this.calculateStat(this.charisma_exp, this.charisma_mult)));

        const ratio: number = this.hp / this.max_hp;
        this.max_hp = Math.floor(10 + this.defense / 10);
        this.hp     = Math.round(this.max_hp * ratio);
    }
}
