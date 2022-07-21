import * as generalMethods from "./Player/PlayerObjectGeneralMethods";
import { Augmentation } from "../Augmentation/Augmentation";
import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CityName } from "../Locations/data/CityNames";
import { CONSTANTS } from "../Constants";
import { calculateSkill } from "./formulas/skill";
import { calculateIntelligenceBonus } from "./formulas/intelligence";
import { IPerson } from "./IPerson";
import { defaultMultipliers, mergeMultipliers } from "./Multipliers";

// Base class representing a person-like object
export abstract class Person implements IPerson {
  /**
   * Stats
   */
  hacking = 1;
  strength = 1;
  defense = 1;
  dexterity = 1;
  agility = 1;
  charisma = 1;
  intelligence = 0;
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

  mults = defaultMultipliers();

  /**
   * Augmentations
   */
  augmentations: IPlayerOwnedAugmentation[] = [];

  /**
   * City that the person is in
   */
  city: CityName = CityName.Sector12;

  gainHackingExp = generalMethods.gainHackingExp;
  gainStrengthExp = generalMethods.gainStrengthExp;
  gainDefenseExp = generalMethods.gainDefenseExp;
  gainDexterityExp = generalMethods.gainDexterityExp;
  gainAgilityExp = generalMethods.gainAgilityExp;
  gainCharismaExp = generalMethods.gainCharismaExp;
  gainIntelligenceExp = generalMethods.gainIntelligenceExp;
  gainStats = generalMethods.gainStats;
  calculateSkill = generalMethods.calculateSkill;
  regenerateHp = generalMethods.regenerateHp;
  queryStatFromString = generalMethods.queryStatFromString;

  /**
   * Updates this object's multipliers for the given augmentation
   */
  applyAugmentation(aug: Augmentation): void {
    this.mults = mergeMultipliers(this.mults, aug.mults);
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
    return t * this.mults.faction_rep;
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Hacking Work for a faction
   */
  getFactionHackingWorkRepGain(): number {
    return (this.hacking / CONSTANTS.MaxSkillLevel) * this.mults.faction_rep;
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
    return t * this.mults.faction_rep;
  }

  /**
   * Reset all multipliers to 1
   */
  resetMultipliers(): void {
    this.mults = defaultMultipliers();
  }

  /**
   * Update all stat levels
   */
  updateStatLevels(): void {
    this.hacking = Math.max(
      1,
      Math.floor(this.calculateStat(this.hacking_exp, this.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier)),
    );
    this.strength = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.strength_exp, this.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier),
      ),
    );
    this.defense = Math.max(
      1,
      Math.floor(this.calculateStat(this.defense_exp, this.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier)),
    );
    this.dexterity = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.dexterity_exp, this.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier),
      ),
    );
    this.agility = Math.max(
      1,
      Math.floor(this.calculateStat(this.agility_exp, this.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier)),
    );
    this.charisma = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.charisma_exp, this.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier),
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
