import { Player } from "../Player";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { addOffset } from "../utils/helpers/addOffset";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";
import { BladeburnerConstants } from "./data/Constants";
import { IBladeburner } from "./IBladeburner";
import { IAction, ISuccessChanceParams } from "./IAction";

class StatsMultiplier {
  [key: string]: number;

  hack = 0;
  str = 0;
  def = 0;
  dex = 0;
  agi = 0;
  cha = 0;
  int = 0;
}

export interface IActionParams {
  name?: string;
  level?: number;
  maxLevel?: number;
  autoLevel?: boolean;
  baseDifficulty?: number;
  difficultyFac?: number;
  rewardFac?: number;
  successes?: number;
  failures?: number;
  rankGain?: number;
  rankLoss?: number;
  hpLoss?: number;
  hpLost?: number;
  isStealth?: boolean;
  isKill?: boolean;
  count?: number;
  weights?: StatsMultiplier;
  decays?: StatsMultiplier;
  teamCount?: number;
}

export class Action implements IAction {
  name = "";

  // Difficulty scales with level. See getDifficulty() method
  level = 1;
  maxLevel = 1;
  autoLevel = true;
  baseDifficulty = 100;
  difficultyFac = 1.01;

  // Rank increase/decrease is affected by this exponent
  rewardFac = 1.02;

  successes = 0;
  failures = 0;

  // All of these scale with level/difficulty
  rankGain = 0;
  rankLoss = 0;
  hpLoss = 0;
  hpLost = 0;

  // Action Category. Current categories are stealth and kill
  isStealth = false;
  isKill = false;

  /**
   * Number of this contract remaining, and its growth rate
   * Growth rate is an integer and the count will increase by that integer every "cycle"
   */
  count: number = getRandomInt(1e3, 25e3);

  // Weighting of each stat in determining action success rate
  weights: StatsMultiplier = {
    hack: 1 / 7,
    str: 1 / 7,
    def: 1 / 7,
    dex: 1 / 7,
    agi: 1 / 7,
    cha: 1 / 7,
    int: 1 / 7,
  };
  // Diminishing returns of stats (stat ^ decay where 0 <= decay <= 1)
  decays: StatsMultiplier = {
    hack: 0.9,
    str: 0.9,
    def: 0.9,
    dex: 0.9,
    agi: 0.9,
    cha: 0.9,
    int: 0.9,
  };
  teamCount = 0;

  // Base Class for Contracts, Operations, and BlackOps
  constructor(params: IActionParams | null = null) {
    //  | null = null
    if (params && params.name) this.name = params.name;

    if (params && params.baseDifficulty) this.baseDifficulty = addOffset(params.baseDifficulty, 10);
    if (params && params.difficultyFac) this.difficultyFac = params.difficultyFac;

    if (params && params.rewardFac) this.rewardFac = params.rewardFac;
    if (params && params.rankGain) this.rankGain = params.rankGain;
    if (params && params.rankLoss) this.rankLoss = params.rankLoss;
    if (params && params.hpLoss) this.hpLoss = params.hpLoss;

    if (params && params.isStealth) this.isStealth = params.isStealth;
    if (params && params.isKill) this.isKill = params.isKill;

    if (params && params.count) this.count = params.count;

    if (params && params.weights) this.weights = params.weights;
    if (params && params.decays) this.decays = params.decays;

    // Check to make sure weights are summed properly
    let sum = 0;
    for (const weight in this.weights) {
      if (this.weights.hasOwnProperty(weight)) {
        sum += this.weights[weight];
      }
    }
    if (sum - 1 >= 10 * Number.EPSILON) {
      throw new Error(
        "Invalid weights when constructing Action " +
          this.name +
          ". The weights should sum up to 1. They sum up to :" +
          1,
      );
    }

    for (const decay in this.decays) {
      if (this.decays.hasOwnProperty(decay)) {
        if (this.decays[decay] > 1) {
          throw new Error(
            "Invalid decays when constructing " + "Action " + this.name + ". " + "Decay value cannot be greater than 1",
          );
        }
      }
    }
  }

  getDifficulty(): number {
    const difficulty = this.baseDifficulty * Math.pow(this.difficultyFac, this.level - 1);
    if (isNaN(difficulty)) {
      throw new Error("Calculated NaN in Action.getDifficulty()");
    }
    return difficulty;
  }

  /**
   * Tests for success. Should be called when an action has completed
   * @param inst {Bladeburner} - Bladeburner instance
   */
  attempt(inst: IBladeburner): boolean {
    return Math.random() < this.getSuccessChance(inst);
  }

  // To be implemented by subtypes
  getActionTimePenalty(): number {
    return 1;
  }

  getActionTime(inst: IBladeburner): number {
    const difficulty = this.getDifficulty();
    let baseTime = difficulty / BladeburnerConstants.DifficultyToTimeFactor;
    const skillFac = inst.skillMultipliers.actionTime; // Always < 1

    const effAgility = Player.agility * inst.skillMultipliers.effAgi;
    const effDexterity = Player.dexterity * inst.skillMultipliers.effDex;
    const statFac =
      0.5 *
      (Math.pow(effAgility, BladeburnerConstants.EffAgiExponentialFactor) +
        Math.pow(effDexterity, BladeburnerConstants.EffDexExponentialFactor) +
        effAgility / BladeburnerConstants.EffAgiLinearFactor +
        effDexterity / BladeburnerConstants.EffDexLinearFactor); // Always > 1

    baseTime = Math.max(1, (baseTime * skillFac) / statFac);

    return Math.ceil(baseTime * this.getActionTimePenalty());
  }

  // For actions that have teams. To be implemented by subtypes.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getTeamSuccessBonus(inst: IBladeburner): number {
    return 1;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getActionTypeSkillSuccessBonus(inst: IBladeburner): number {
    return 1;
  }

  getChaosCompetencePenalty(inst: IBladeburner, params: ISuccessChanceParams): number {
    const city = inst.getCurrentCity();
    if (params.est) {
      return Math.pow(city.popEst / BladeburnerConstants.PopulationThreshold, BladeburnerConstants.PopulationExponent);
    } else {
      return Math.pow(city.pop / BladeburnerConstants.PopulationThreshold, BladeburnerConstants.PopulationExponent);
    }
  }

  getChaosDifficultyBonus(inst: IBladeburner /*, params: ISuccessChanceParams*/): number {
    const city = inst.getCurrentCity();
    if (city.chaos > BladeburnerConstants.ChaosThreshold) {
      const diff = 1 + (city.chaos - BladeburnerConstants.ChaosThreshold);
      const mult = Math.pow(diff, 0.5);
      return mult;
    }

    return 1;
  }

  getEstSuccessChance(inst: IBladeburner): number[] {
    function clamp(x: number): number {
      return Math.max(0, Math.min(x, 1));
    }
    const est = this.getSuccessChance(inst, { est: true });
    const real = this.getSuccessChance(inst);
    const diff = Math.abs(real - est);
    let low = real - diff;
    let high = real + diff;
    const city = inst.getCurrentCity();
    const r = city.pop / city.popEst;

    if (r < 1) low *= r;
    else high *= r;
    return [clamp(low), clamp(high)];
  }

  /**
   * @inst - Bladeburner Object
   * @params - options:
   *  est (bool): Get success chance estimate instead of real success chance
   */
  getSuccessChance(inst: IBladeburner, params: ISuccessChanceParams = { est: false }): number {
    if (inst == null) {
      throw new Error("Invalid Bladeburner instance passed into Action.getSuccessChance");
    }
    let difficulty = this.getDifficulty();
    let competence = 0;
    for (const stat in this.weights) {
      if (this.weights.hasOwnProperty(stat)) {
        const playerStatLvl = Player.queryStatFromString(stat);
        const key = "eff" + stat.charAt(0).toUpperCase() + stat.slice(1);
        let effMultiplier = inst.skillMultipliers[key];
        if (effMultiplier == null) {
          console.error(`Failed to find Bladeburner Skill multiplier for: ${stat}`);
          effMultiplier = 1;
        }
        competence += this.weights[stat] * Math.pow(effMultiplier * playerStatLvl, this.decays[stat]);
      }
    }
    competence *= Player.getIntelligenceBonus(0.75);
    competence *= inst.calculateStaminaPenalty();

    competence *= this.getTeamSuccessBonus(inst);

    competence *= this.getChaosCompetencePenalty(inst, params);
    difficulty *= this.getChaosDifficultyBonus(inst);

    if (this.name == "Raid" && inst.getCurrentCity().comms <= 0) {
      return 0;
    }

    // Factor skill multipliers into success chance
    competence *= inst.skillMultipliers.successChanceAll;
    competence *= this.getActionTypeSkillSuccessBonus(inst);
    if (this.isStealth) {
      competence *= inst.skillMultipliers.successChanceStealth;
    }
    if (this.isKill) {
      competence *= inst.skillMultipliers.successChanceKill;
    }

    // Augmentation multiplier
    competence *= Player.bladeburner_success_chance_mult;

    if (isNaN(competence)) {
      throw new Error("Competence calculated as NaN in Action.getSuccessChance()");
    }
    return Math.min(1, competence / difficulty);
  }

  getSuccessesNeededForNextLevel(baseSuccessesPerLevel: number): number {
    return Math.ceil(0.5 * this.maxLevel * (2 * baseSuccessesPerLevel + (this.maxLevel - 1)));
  }

  setMaxLevel(baseSuccessesPerLevel: number): void {
    if (this.successes >= this.getSuccessesNeededForNextLevel(baseSuccessesPerLevel)) {
      ++this.maxLevel;
    }
  }

  toJSON(): any {
    return Generic_toJSON("Action", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Action {
    return Generic_fromJSON(Action, value.data);
  }
}

Reviver.constructors.Action = Action;
