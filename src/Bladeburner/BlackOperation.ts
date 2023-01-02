import { Operation, IOperationParams } from "./Operation";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";

export class BlackOperation extends Operation {
  constructor(params: IOperationParams | null = null) {
    super(params);
    this.count = 1;
  }

  // To be implemented by subtypes
  getActionTimePenalty(): number {
    return 1.5;
  }

  getChaosCompetencePenalty(/*inst: Bladeburner, params: ISuccessChanceParams*/): number {
    return 1;
  }

  getChaosDifficultyBonus(/*inst: Bladeburner, params: ISuccessChanceParams*/): number {
    return 1;
  }

  toJSON(): IReviverValue {
    return Generic_toJSON("BlackOperation", this);
  }

  static fromJSON(value: IReviverValue): Operation {
    return Generic_fromJSON(BlackOperation, value.data);
  }
}

Reviver.constructors.BlackOperation = BlackOperation;
