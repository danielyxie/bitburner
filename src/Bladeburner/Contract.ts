import { IBladeburner } from "./IBladeburner";
import { Action, IActionParams } from "./Action";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export class Contract extends Action {
  constructor(params: IActionParams | null = null) {
    super(params);
  }

  getActionTypeSkillSuccessBonus(inst: IBladeburner): number {
    return inst.skillMultipliers.successChanceContract;
  }

  toJSON(): any {
    return Generic_toJSON("Contract", this);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): Contract {
    return Generic_fromJSON(Contract, value.data);
  }
}

Reviver.constructors.Contract = Contract;
