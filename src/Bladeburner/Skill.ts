import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";

interface ISkillParams {
  name: string;
  desc: string;

  baseCost?: number;
  costInc?: number;
  maxLvl?: number;

  successChanceAll?: number;
  successChanceStealth?: number;
  successChanceKill?: number;
  successChanceContract?: number;
  successChanceOperation?: number;
  successChanceEstimate?: number;

  actionTime?: number;

  effHack?: number;
  effStr?: number;
  effDef?: number;
  effDex?: number;
  effAgi?: number;
  effCha?: number;

  stamina?: number;
  money?: number;
  expGain?: number;
}

export class Skill {
  name: string;
  desc: string;
  // Cost is in Skill Points
  baseCost = 1;
  // Additive cost increase per level
  costInc = 1;
  maxLvl = 0;

  /**
   * These benefits are additive. So total multiplier will be level (handled externally) times the
   * effects below
   */
  successChanceAll = 0;
  successChanceStealth = 0;
  successChanceKill = 0;
  successChanceContract = 0;
  successChanceOperation = 0;

  /**
   * This multiplier affects everything that increases synthoid population/community estimate
   * e.g. Field analysis, Investigation Op, Undercover Op
   */
  successChanceEstimate = 0;
  actionTime = 0;
  effHack = 0;
  effStr = 0;
  effDef = 0;
  effDex = 0;
  effAgi = 0;
  effCha = 0;
  stamina = 0;
  money = 0;
  expGain = 0;

  constructor(params: ISkillParams = { name: "foo", desc: "foo" }) {
    if (!params.name) {
      throw new Error("Failed to initialize Bladeburner Skill. No name was specified in ctor");
    }
    if (!params.desc) {
      throw new Error("Failed to initialize Bladeburner Skills. No desc was specified in ctor");
    }
    this.name = params.name;
    this.desc = params.desc;
    this.baseCost = params.baseCost ? params.baseCost : 1;
    this.costInc = params.costInc ? params.costInc : 1;

    if (params.maxLvl) {
      this.maxLvl = params.maxLvl;
    }

    if (params.successChanceAll) {
      this.successChanceAll = params.successChanceAll;
    }
    if (params.successChanceStealth) {
      this.successChanceStealth = params.successChanceStealth;
    }
    if (params.successChanceKill) {
      this.successChanceKill = params.successChanceKill;
    }
    if (params.successChanceContract) {
      this.successChanceContract = params.successChanceContract;
    }
    if (params.successChanceOperation) {
      this.successChanceOperation = params.successChanceOperation;
    }

    if (params.successChanceEstimate) {
      this.successChanceEstimate = params.successChanceEstimate;
    }

    if (params.actionTime) {
      this.actionTime = params.actionTime;
    }
    if (params.effHack) {
      this.effHack = params.effHack;
    }
    if (params.effStr) {
      this.effStr = params.effStr;
    }
    if (params.effDef) {
      this.effDef = params.effDef;
    }
    if (params.effDex) {
      this.effDex = params.effDex;
    }
    if (params.effAgi) {
      this.effAgi = params.effAgi;
    }
    if (params.effCha) {
      this.effCha = params.effCha;
    }

    if (params.stamina) {
      this.stamina = params.stamina;
    }
    if (params.money) {
      this.money = params.money;
    }
    if (params.expGain) {
      this.expGain = params.expGain;
    }
  }

  calculateCost(currentLevel: number): number {
    return Math.floor((this.baseCost + currentLevel * this.costInc) * BitNodeMultipliers.BladeburnerSkillCost);
  }

  getMultiplier(name: string): number {
    if (name === "successChanceAll") return this.successChanceAll;
    if (name === "successChanceStealth") return this.successChanceStealth;
    if (name === "successChanceKill") return this.successChanceKill;
    if (name === "successChanceContract") return this.successChanceContract;
    if (name === "successChanceOperation") return this.successChanceOperation;
    if (name === "successChanceEstimate") return this.successChanceEstimate;

    if (name === "actionTime") return this.actionTime;

    if (name === "effHack") return this.effHack;
    if (name === "effStr") return this.effStr;
    if (name === "effDef") return this.effDef;
    if (name === "effDex") return this.effDex;
    if (name === "effAgi") return this.effAgi;
    if (name === "effCha") return this.effCha;

    if (name === "stamina") return this.stamina;
    if (name === "money") return this.money;
    if (name === "expGain") return this.expGain;
    return 0;
  }
}
