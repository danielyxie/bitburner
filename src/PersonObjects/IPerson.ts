// Interface that represents either the player (PlayerObject) or
// a Sleeve. Used for functions that need to take in both.

import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { ITaskTracker } from "./ITaskTracker";
import { Multipliers } from "./Multipliers";

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

  mults: Multipliers;

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
