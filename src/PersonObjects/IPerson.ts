// Interface that represents either the player (PlayerObject) or
// a Sleeve. Used for functions that need to take in both.

import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { ITaskTracker } from "./ITaskTracker";

export interface IPerson {
  // Stats
  hacking: number;
  strength: number;
  defense: number;
  dexterity: number;
  agility: number;
  charisma: number;
  intelligence: number;
  hp: number;
  max_hp: number;

  // Experience
  hacking_exp: number;
  strength_exp: number;
  defense_exp: number;
  dexterity_exp: number;
  agility_exp: number;
  charisma_exp: number;
  intelligence_exp: number;

  // Multipliers
  hacking_exp_mult: number;
  strength_exp_mult: number;
  defense_exp_mult: number;
  dexterity_exp_mult: number;
  agility_exp_mult: number;
  charisma_exp_mult: number;
  hacking_mult: number;
  strength_mult: number;
  defense_mult: number;
  dexterity_mult: number;
  agility_mult: number;
  charisma_mult: number;

  company_rep_mult: number;
  faction_rep_mult: number;

  crime_money_mult: number;
  crime_success_mult: number;

  bladeburner_analysis_mult: number;

  augmentations: IPlayerOwnedAugmentation[];

  getIntelligenceBonus(weight: number): number;
  gainHackingExp(exp: number): void;
  gainStrengthExp(exp: number): void;
  gainDefenseExp(exp: number): void;
  gainDexterityExp(exp: number): void;
  gainAgilityExp(exp: number): void;
  gainCharismaExp(exp: number): void;
  gainIntelligenceExp(exp: number): void;
  gainStats(retValue: ITaskTracker): void;
  calculateSkill(exp: number, mult?: number): number;
  takeDamage(amt: number): boolean;
  regenerateHp: (amt: number) => void;
  queryStatFromString: (str: string) => number;
  whoAmI: () => string;
}
