// Base class representing a person-like object
import { Augmentation } from "../Augmentation/Augmentation";
import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CityName } from "../Locations/data/CityNames";
import { CONSTANTS } from "../Constants";
import { calculateSkill } from "./formulas/skill";
import { calculateIntelligenceBonus } from "./formulas/intelligence";

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
  };
}

export abstract class Person {
  /**
   * Stats
   */
  hacking_skill = 1;
  strength = 1;
  defense = 1;
  dexterity = 1;
  agility = 1;
  charisma = 1;
  intelligence = 1;
  hp = 10;
  max_hp = 10;

  /**
   * Experience
   */
  hacking_exp = 0;
  strength_exp = 0;
  defense_exp = 0;
  dexterity_exp = 0;
  agility_exp = 0;
  charisma_exp = 0;
  intelligence_exp = 0;

  /**
   * Multipliers
   */
  hacking_mult = 1;
  strength_mult = 1;
  defense_mult = 1;
  dexterity_mult = 1;
  agility_mult = 1;
  charisma_mult = 1;

  hacking_exp_mult = 1;
  strength_exp_mult = 1;
  defense_exp_mult = 1;
  dexterity_exp_mult = 1;
  agility_exp_mult = 1;
  charisma_exp_mult = 1;

  hacking_chance_mult = 1;
  hacking_speed_mult = 1;
  hacking_money_mult = 1;
  hacking_grow_mult = 1;

  company_rep_mult = 1;
  faction_rep_mult = 1;

  crime_money_mult = 1;
  crime_success_mult = 1;

  work_money_mult = 1;

  hacknet_node_money_mult = 1;
  hacknet_node_purchase_cost_mult = 1;
  hacknet_node_ram_cost_mult = 1;
  hacknet_node_core_cost_mult = 1;
  hacknet_node_level_cost_mult = 1;

  bladeburner_max_stamina_mult = 1;
  bladeburner_stamina_gain_mult = 1;
  bladeburner_analysis_mult = 1;
  bladeburner_success_chance_mult = 1;

  /**
   * Augmentations
   */
  augmentations: IPlayerOwnedAugmentation[] = [];
  queuedAugmentations: IPlayerOwnedAugmentation[] = [];

  /**
   * City that the person is in
   */
  city: CityName = CityName.Sector12;

  /**
   * Updates this object's multipliers for the given augmentation
   */
  applyAugmentation(aug: Augmentation): void {
    for (const mult in aug.mults) {
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
        (this.hacking_skill / CONSTANTS.MaxSkillLevel +
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
    return (this.hacking_skill / CONSTANTS.MaxSkillLevel) * this.faction_rep_mult;
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Security Work for a faction
   */
  getFactionSecurityWorkRepGain(): number {
    const t =
      (0.9 *
        (this.hacking_skill / CONSTANTS.MaxSkillLevel +
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
    this.hacking_skill = Math.max(
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
}
