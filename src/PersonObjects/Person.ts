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
import { Skills } from "./Skills";
import { HP } from "./HP";

// Base class representing a person-like object
export abstract class Person implements IPerson {
  hp: HP = { current: 10, max: 10 };
  skills: Skills = {
    hacking: 1,
    strength: 1,
    defense: 1,
    dexterity: 1,
    agility: 1,
    charisma: 1,
    intelligence: 1,
  };
  exp: Skills = {
    hacking: 0,
    strength: 0,
    defense: 0,
    dexterity: 0,
    agility: 0,
    charisma: 0,
    intelligence: 0,
  };

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
        (this.skills.hacking / CONSTANTS.MaxSkillLevel +
          this.skills.strength / CONSTANTS.MaxSkillLevel +
          this.skills.defense / CONSTANTS.MaxSkillLevel +
          this.skills.dexterity / CONSTANTS.MaxSkillLevel +
          this.skills.agility / CONSTANTS.MaxSkillLevel +
          this.skills.charisma / CONSTANTS.MaxSkillLevel)) /
      5.5;
    return t * this.mults.faction_rep;
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Hacking Work for a faction
   */
  getFactionHackingWorkRepGain(): number {
    return (this.skills.hacking / CONSTANTS.MaxSkillLevel) * this.mults.faction_rep;
  }

  /**
   * Calculate and return the amount of faction reputation earned per cycle
   * when doing Security Work for a faction
   */
  getFactionSecurityWorkRepGain(): number {
    const t =
      (0.9 *
        (this.skills.hacking / CONSTANTS.MaxSkillLevel +
          this.skills.strength / CONSTANTS.MaxSkillLevel +
          this.skills.defense / CONSTANTS.MaxSkillLevel +
          this.skills.dexterity / CONSTANTS.MaxSkillLevel +
          this.skills.agility / CONSTANTS.MaxSkillLevel)) /
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
    this.skills.hacking = Math.max(
      1,
      Math.floor(this.calculateStat(this.exp.hacking, this.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier)),
    );
    this.skills.strength = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.exp.strength, this.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier),
      ),
    );
    this.skills.defense = Math.max(
      1,
      Math.floor(this.calculateStat(this.exp.defense, this.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier)),
    );
    this.skills.dexterity = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.exp.dexterity, this.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier),
      ),
    );
    this.skills.agility = Math.max(
      1,
      Math.floor(this.calculateStat(this.exp.agility, this.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier)),
    );
    this.skills.charisma = Math.max(
      1,
      Math.floor(
        this.calculateStat(this.exp.charisma, this.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier),
      ),
    );

    const ratio: number = this.hp.current / this.hp.max;
    this.hp.max = Math.floor(10 + this.skills.defense / 10);
    this.hp.current = Math.round(this.hp.max * ratio);
  }

  getIntelligenceBonus(weight: number): number {
    return calculateIntelligenceBonus(this.skills.intelligence, weight);
  }

  abstract takeDamage(amt: number): boolean;

  abstract whoAmI(): string;
}
