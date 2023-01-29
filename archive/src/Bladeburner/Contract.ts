import { IBladeburner } from "./IBladeburner";
import { Action, IActionParams } from "./Action";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../utils/JSONReviver";

export class Contract extends Action {
  constructor(params: IActionParams | null = null) {
    super(params);
  }

  getActionTypeSkillSuccessBonus(inst: IBladeburner): number {
    return inst.skillMultipliers.successChanceContract;
  }

  toJSON(): IReviverValue {
    return Generic_toJSON("Contract", this);
  }

  static fromJSON(value: IReviverValue): Contract {
    return Generic_fromJSON(Contract, value.data);
  }
}

Reviver.constructors.Contract = Contract;
