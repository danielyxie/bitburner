import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";

import { Action } from "./Action";
import type { IActionParams } from "./Action";
import { BladeburnerConstants } from "./data/Constants";
import type { IBladeburner } from "./IBladeburner";

export interface IOperationParams extends IActionParams {
  reqdRank?: number;
  teamCount?: number;
}

export class Operation extends Action {
  reqdRank = 100;
  teamCount = 0;

  constructor(params: IOperationParams | null = null) {
    super(params);
    if (params && params.reqdRank) this.reqdRank = params.reqdRank;
    if (params && params.teamCount) this.teamCount = params.teamCount;
  }

  // For actions that have teams. To be implemented by subtypes.
  getTeamSuccessBonus(inst: IBladeburner): number {
    if (this.teamCount && this.teamCount > 0) {
      this.teamCount = Math.min(this.teamCount, inst.teamSize);
      const teamMultiplier = Math.pow(this.teamCount, 0.05);
      return teamMultiplier;
    }

    return 1;
  }

  getActionTypeSkillSuccessBonus(inst: IBladeburner): number {
    return inst.skillMultipliers.successChanceOperation;
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

  toJSON(): any {
    return Generic_toJSON("Operation", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Operation {
    return Generic_fromJSON(Operation, value.data);
  }
}

Reviver.constructors.Operation = Operation;
