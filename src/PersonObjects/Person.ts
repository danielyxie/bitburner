import * as personMethods from "./PersonMethods";
import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { CityName } from "../Locations/data/CityNames";
import { calculateSkill } from "./formulas/skill";
import { calculateIntelligenceBonus } from "./formulas/intelligence";
import { defaultMultipliers } from "./Multipliers";
import { Skills } from "./Skills";
import { HP } from "./HP";
import { IReviverValue } from "../utils/JSONReviver";

// Base class representing a person-like object
export abstract class Person {
  hp: HP = { current: 10, max: 10 };
  skills: Skills = {
    hacking: 1,
    strength: 1,
    defense: 1,
    dexterity: 1,
    agility: 1,
    charisma: 1,
    intelligence: 0,
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

  gainHackingExp = personMethods.gainHackingExp;
  gainStrengthExp = personMethods.gainStrengthExp;
  gainDefenseExp = personMethods.gainDefenseExp;
  gainDexterityExp = personMethods.gainDexterityExp;
  gainAgilityExp = personMethods.gainAgilityExp;
  gainCharismaExp = personMethods.gainCharismaExp;
  gainIntelligenceExp = personMethods.gainIntelligenceExp;
  gainStats = personMethods.gainStats;
  regenerateHp = personMethods.regenerateHp;
  queryStatFromString = personMethods.queryStatFromString;
  updateSkillLevels = personMethods.updateSkillLevels;
  calculateSkill = calculateSkill; //Class version is equal to imported version

  /**
   * Reset all multipliers to 1
   */
  resetMultipliers() {
    this.mults = defaultMultipliers();
  }

  getIntelligenceBonus(weight: number): number {
    return calculateIntelligenceBonus(this.skills.intelligence, weight);
  }

  abstract takeDamage(amt: number): boolean;
  abstract whoAmI(): string;
  abstract toJSON(): IReviverValue;
}
