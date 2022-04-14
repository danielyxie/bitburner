import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";

import { Action } from "./Action";
import type { IActionParams } from "./Action";
import type { IBladeburner } from "./IBladeburner";

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
