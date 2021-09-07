import { Operation, IOperationParams } from "./Operation";
import {
  Generic_fromJSON,
  Generic_toJSON,
  Reviver,
} from "../../utils/JSONReviver";

export class BlackOperation extends Operation {
  constructor(params: IOperationParams | null = null) {
    super(params);
    this.count = 1;
  }

  // To be implemented by subtypes
  getActionTimePenalty(): number {
    return 1.5;
  }

  getChaosCompetencePenalty(/*inst: IBladeburner, params: ISuccessChanceParams*/): number {
    return 1;
  }

  getChaosDifficultyBonus(/*inst: IBladeburner, params: ISuccessChanceParams*/): number {
    return 1;
  }

  toJSON(): any {
    return Generic_toJSON("BlackOperation", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Operation {
    return Generic_fromJSON(BlackOperation, value.data);
  }
}

Reviver.constructors.BlackOperation = BlackOperation;
