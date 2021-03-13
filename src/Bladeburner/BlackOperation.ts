import { Operation, IOperationParams } from "./Operation";
import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";

export class BlackOperation extends Operation {
    constructor(params: IOperationParams | null = null) {
        super(params);
        this.count = 1;
        this.countGrowth = 0;
    }

    // To be implemented by subtypes
    getActionTimePenalty(): number {
        return 1.5;
    }

    getChaosCompetencePenalty(inst: any, params: any): number {
        return 1;
    }

    getChaosDifficultyBonus(inst: any, params: any): number {
        return 1;
    }

    static fromJSON(value: any): Operation {
        return Generic_fromJSON(BlackOperation, value.data);
    }

    toJSON(): any {
        return Generic_toJSON("BlackOperation", this);
    }
}

Reviver.constructors.BlackOperation = BlackOperation;