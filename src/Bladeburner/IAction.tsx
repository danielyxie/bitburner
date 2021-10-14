import { IBladeburner } from "./IBladeburner";

interface IStatsMultiplier {
  [key: string]: number;

  hack: number;
  str: number;
  def: number;
  dex: number;
  agi: number;
  cha: number;
  int: number;
}

export interface ISuccessChanceParams {
  est: boolean;
}

export interface IAction {
  name: string;

  // Difficulty scales with level. See getDifficulty() method
  level: number;
  maxLevel: number;
  autoLevel: boolean;
  baseDifficulty: number;
  difficultyFac: number;

  // Rank increase/decrease is affected by this exponent
  rewardFac: number;

  successes: number;
  failures: number;

  // All of these scale with level/difficulty
  rankGain: number;
  rankLoss: number;
  hpLoss: number;
  hpLost: number;

  // Action Category. Current categories are stealth and kill
  isStealth: boolean;
  isKill: boolean;

  /**
   * Number of this contract remaining, and its growth rate
   * Growth rate is an integer and the count will increase by that integer every "cycle"
   */
  count: number;

  // Weighting of each stat in determining action success rate
  weights: IStatsMultiplier;
  // Diminishing returns of stats (stat ^ decay where 0 <= decay <= 1)
  decays: IStatsMultiplier;
  teamCount: number;

  getDifficulty(): number;
  attempt(inst: IBladeburner): boolean;
  getActionTimePenalty(): number;
  getActionTime(inst: IBladeburner): number;
  getTeamSuccessBonus(inst: IBladeburner): number;
  getActionTypeSkillSuccessBonus(inst: IBladeburner): number;
  getChaosCompetencePenalty(inst: IBladeburner, params: ISuccessChanceParams): number;
  getChaosDifficultyBonus(inst: IBladeburner): number;
  getEstSuccessChance(inst: IBladeburner): number[];
  getSuccessChance(inst: IBladeburner, params: ISuccessChanceParams): number;
  getSuccessesNeededForNextLevel(baseSuccessesPerLevel: number): number;
  setMaxLevel(baseSuccessesPerLevel: number): void;
  toJSON(): any;
}
