import * as generalMethods from "./Player/PlayerObjectGeneralMethods";
import { Augmentation } from "../Augmentation/Augmentation";
import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CityName } from "../Locations/data/CityNames";
import { CONSTANTS } from "../Constants";
import { calculateSkill } from "./formulas/skill";
import { calculateIntelligenceBonus } from "./formulas/intelligence";
import { IPerson } from "./IPerson";
import { Reviver } from "../utils/JSONReviver";
import { ITaskTracker } from "./ITaskTracker";

// Base class representing a person-like object
export abstract class Person implements IPerson {
  /**
   * Stats
   */
  hacking;
  strength;
  defense;
  dexterity;
  agility;
  charisma;
  intelligence;
  hp;
  max_hp;
  money;

  /**
   * Experience
   */
  hacking_exp;
  strength_exp;
  defense_exp;
  dexterity_exp;
  agility_exp;
  charisma_exp;
  intelligence_exp;

  /**
   * Multipliers
   */
  hacking_mult;
  strength_mult;
  defense_mult;
  dexterity_mult;
  agility_mult;
  charisma_mult;

  hacking_exp_mult;
  strength_exp_mult;
  defense_exp_mult;
  dexterity_exp_mult;
  agility_exp_mult;
  charisma_exp_mult;

  hacking_chance_mult;
  hacking_speed_mult;
  hacking_money_mult;
  hacking_grow_mult;

  company_rep_mult;
  faction_rep_mult;

  crime_money_mult;
  crime_success_mult;

  work_money_mult;

  hacknet_node_money_mult;
  hacknet_node_purchase_cost_mult;
  hacknet_node_ram_cost_mult;
  hacknet_node_core_cost_mult;
  hacknet_node_level_cost_mult;

  bladeburner_max_stamina_mult;
  bladeburner_stamina_gain_mult;
  bladeburner_analysis_mult;
  bladeburner_success_chance_mult;

  /**
   * Augmentations
   */
  augmentations: IPlayerOwnedAugmentation[];
  queuedAugmentations: IPlayerOwnedAugmentation[];

  /**
   * City that the person is in
   */
  city: CityName = CityName.Sector12;

  gainHackingExp: (exp: number) => void;
  gainStrengthExp: (exp: number) => void;
  gainDefenseExp: (exp: number) => void;
  gainDexterityExp: (exp: number) => void;
  gainAgilityExp: (exp: number) => void;
  gainCharismaExp: (exp: number) => void;
  gainIntelligenceExp: (exp: number) => void;
  gainStats: (retValue: ITaskTracker) => void;
  calculateSkill: (exp: number, mult: number) => number;
  regenerateHp: (amt: number) => void;
  queryStatFromString: (str: string) => number;

  constructor() {
    /**
     * Stats
     */
    this.hacking = 1;
    this.strength = 1;
    this.defense = 1;
    this.dexterity = 1;
    this.agility = 1;
    this.charisma = 1;
    this.intelligence = 1;
    this.hp = 10;
    this.max_hp = 10;
    this.money = 0;

    /**
     * Experience
     */
    this.hacking_exp = 0;
    this.strength_exp = 0;
    this.defense_exp = 0;
    this.dexterity_exp = 0;
    this.agility_exp = 0;
    this.charisma_exp = 0;
    this.intelligence_exp = 0;

    /**
     * Multipliers
     */
    this.hacking_mult = 1;
    this.strength_mult = 1;
    this.defense_mult = 1;
    this.dexterity_mult = 1;
    this.agility_mult = 1;
    this.charisma_mult = 1;

    this.hacking_exp_mult = 1;
    this.strength_exp_mult = 1;
    this.defense_exp_mult = 1;
    this.dexterity_exp_mult = 1;
    this.agility_exp_mult = 1;
    this.charisma_exp_mult = 1;

    this.hacking_chance_mult = 1;
    this.hacking_speed_mult = 1;
    this.hacking_money_mult = 1;
    this.hacking_grow_mult = 1;

    this.company_rep_mult = 1;
    this.faction_rep_mult = 1;

    this.crime_money_mult = 1;
    this.crime_success_mult = 1;

    this.work_money_mult = 1;

    this.hacknet_node_money_mult = 1;
    this.hacknet_node_purchase_cost_mult = 1;
    this.hacknet_node_ram_cost_mult = 1;
    this.hacknet_node_core_cost_mult = 1;
    this.hacknet_node_level_cost_mult = 1;

    this.bladeburner_max_stamina_mult = 1;
    this.bladeburner_stamina_gain_mult = 1;
    this.bladeburner_analysis_mult = 1;
    this.bladeburner_success_chance_mult = 1;

    /**
     * Augmentations
     */
    this.augmentations = [];
    this.queuedAugmentations = [];

    /**
     * City that the person is in
     */
    this.city = CityName.Sector12;

    this.gainHackingExp = generalMethods.gainHackingExp;
    this.gainStrengthExp = generalMethods.gainStrengthExp;
    this.gainDefenseExp = generalMethods.gainDefenseExp;
    this.gainDexterityExp = generalMethods.gainDexterityExp;
    this.gainAgilityExp = generalMethods.gainAgilityExp;
    this.gainCharismaExp = generalMethods.gainCharismaExp;
    this.gainIntelligenceExp = generalMethods.gainIntelligenceExp;
    this.gainStats = generalMethods.gainStats;
    this.calculateSkill = generalMethods.calculateSkill;
    this.regenerateHp = generalMethods.regenerateHp;
    this.queryStatFromString = generalMethods.queryStatFromString;
  }

  /**
   * Updates this object's multipliers for the given augmentation
   */
  applyAugmentation(aug: Augmentation): void {
    for (const mult of Object.keys(aug.mults)) {
      if ((this as any)[mult] == null) {
        console.warn(`Augmentation has unrecognized multiplier property: ${mult}`);
      } else {
        (this as any)[mult] *= aug.mults[mult];
      }
    }
  }

  /**
   * Given an experience amount and stat multiplier, calculates the
   * stat level. Stat-agnostic (same formula for every stat)
   */
  calculateStat(exp: number, mult = 1): number {
    return calculateSkill(exp, mult);
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Field Work for a faction
   */
  getFactionFieldWorkRepGain(): number {
    const t =
      (0.9 *
        (this.hacking / CONSTANTS.MaxSkillLevel +
          this.strength / CONSTANTS.MaxSkillLevel +
          this.defense / CONSTANTS.MaxSkillLevel +
          this.dexterity / CONSTANTS.MaxSkillLevel +
          this.agility / CONSTANTS.MaxSkillLevel +
          this.charisma / CONSTANTS.MaxSkillLevel)) /
      5.5;
    return t * this.faction_rep_mult;
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Hacking Work for a faction
   */
  getFactionHackingWorkRepGain(): number {
    return (this.hacking / CONSTANTS.MaxSkillLevel) * this.faction_rep_mult;
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Security Work for a faction
   */
  getFactionSecurityWorkRepGain(): number {
    const t =
      (0.9 *
        (this.hacking / CONSTANTS.MaxSkillLevel +
          this.strength / CONSTANTS.MaxSkillLevel +
          this.defense / CONSTANTS.MaxSkillLevel +
          this.dexterity / CONSTANTS.MaxSkillLevel +
          this.agility / CONSTANTS.MaxSkillLevel)) /
      4.5;
    return t * this.faction_rep_mult;
  }

  /**
   * Reset all multipliers to 1
   */
  resetMultipliers(): void {
    this.hacking_mult = 1;
    this.strength_mult = 1;
    this.defense_mult = 1;
    this.dexterity_mult = 1;
    this.agility_mult = 1;
    this.charisma_mult = 1;

    this.hacking_exp_mult = 1;
    this.strength_exp_mult = 1;
    this.defense_exp_mult = 1;
    this.dexterity_exp_mult = 1;
    this.agility_exp_mult = 1;
    this.charisma_exp_mult = 1;

    this.company_rep_mult = 1;
    this.faction_rep_mult = 1;

    this.crime_money_mult = 1;
    this.crime_success_mult = 1;

    this.work_money_mult = 1;
  }

  /**
   * Update all stat levels
   */
  updateStatLevels(): void {
    this.hacking = Math.max(
      1,
      Math.floor(this.calculateStat(this.hacking_exp, this.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier)),
    );
    this.strength = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.strength_exp, this.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier),
      ),
    );
    this.defense = Math.max(
      1,
      Math.floor(this.calculateStat(this.defense_exp, this.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier)),
    );
    this.dexterity = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.dexterity_exp, this.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier),
      ),
    );
    this.agility = Math.max(
      1,
      Math.floor(this.calculateStat(this.agility_exp, this.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier)),
    );
    this.charisma = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.charisma_exp, this.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier),
      ),
    );

    const ratio: number = this.hp / this.max_hp;
    this.max_hp = Math.floor(10 + this.defense / 10);
    this.hp = Math.round(this.max_hp * ratio);
  }

  getIntelligenceBonus(weight: number): number {
    return calculateIntelligenceBonus(this.intelligence, weight);
  }

  abstract takeDamage(amt: number): boolean;

  abstract whoAmI(): string;
}

Reviver.constructors.Person = Person;
