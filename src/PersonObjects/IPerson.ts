// Interface that represents either the player (PlayerObject) or
// a Sleeve. Used for functions that need to take in both.

import { IPlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { HP } from "./HP";
import { ITaskTracker } from "./ITaskTracker";
import { Multipliers } from "./Multipliers";
import { Skills } from "./Skills";

export interface IPerson {
  hp: HP;
  skills: Skills;
  exp: Skills;

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
