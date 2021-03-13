// import { BladeburnerConstants } from "./data/Constants";
import { Action, IActionParams } from "./Action";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export class Contract extends Action {

    constructor(params: IActionParams | null = null) {
        super(params);
    }

    getActionTypeSkillSuccessBonus(inst: any): number {
        return inst.skillMultipliers.successChanceContract;
    }

    static fromJSON(value: any): Contract {
        return Generic_fromJSON(Contract, value.data);
    }

    toJSON(): any {
        return Generic_toJSON("Contract", this);
    }
}

Reviver.constructors.Contract = Contract;