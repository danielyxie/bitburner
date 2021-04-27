import {
    codingContractTypesMetadata,
    DescriptionFunc,
    GeneratorFunc,
    SolverFunc
} from "./data/codingcontracttypes";

import { CodingContractPopup } from "./ui/CodingContractPopup";

import { IMap } from "./types";

import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver
} from "../utils/JSONReviver";
import { createPopup, removePopup } from "./ui/React/createPopup";

/* tslint:disable:no-magic-numbers completed-docs max-classes-per-file no-console */

/* Represents different types of problems that a Coding Contract can have */
export class CodingContractType {
    /**
     * Function that generates a description of the problem
     */
    desc: DescriptionFunc;

    /**
     * Number that generally represents the problem's difficulty. Bigger numbers = harder
     */
    difficulty: number;

    /**
     * A function that randomly generates a valid 'data' for the problem
     */
    generate: GeneratorFunc;

    /**
     * Name of the type of problem
     */
    name: string;

    /**
     * The maximum number of tries the player gets on this kind of problem before it self-destructs
     */
    numTries: number;

    /**
     * Stores a function that checks if the provided answer is correct
     */
    solver: SolverFunc;

    constructor(name: string,
                desc: DescriptionFunc,
                gen: GeneratorFunc,
                solver: SolverFunc,
                diff: number,
                numTries: number) {
        this.name = name;
        this.desc = desc;
        this.generate = gen;
        this.solver = solver;
        this.difficulty = diff;
        this.numTries = numTries;
    }
}

/* Contract Types */
// tslint:disable-next-line
export const CodingContractTypes: IMap<CodingContractType> = {};

for (const md of codingContractTypesMetadata) {
    // tslint:disable-next-line
    CodingContractTypes[md.name] = new CodingContractType(md.name, md.desc, md.gen, md.solver, md.difficulty, md.numTries);
}

/**
 * Enum representing the different types of rewards a Coding Contract can give
 */
export enum CodingContractRewardType {
    FactionReputation,
    FactionReputationAll,
    CompanyReputation,
    Money, // This must always be the last reward type
}

/**
 * Enum representing the result when trying to solve the Contract
 */
export enum CodingContractResult {
    Success,
    Failure,
    Cancelled,
}

/**
 * A class that represents the type of reward a contract gives
 */
export interface ICodingContractReward {
    /* Name of Company/Faction name for reward, if applicable */
    name?: string;
    type: CodingContractRewardType;
}

/**
 * A Coding Contract is a file that poses a programming-related problem to the Player.
 * The player receives a reward if the problem is solved correctly
 */
export class CodingContract {
    /**
     * Initiatizes a CodingContract from a JSON save state.
     */
    static fromJSON(value: any): CodingContract {
        return Generic_fromJSON(CodingContract, value.data);
    }

    /* Relevant data for the contract's problem */
    data: any;

    /* Contract's filename */
    fn: string;

    /* Describes the reward given if this Contract is solved. The reward is actually
       processed outside of this file */
    reward: ICodingContractReward | null;

    /* Number of times the Contract has been attempted */
    tries: number = 0;

    /* String representing the contract's type. Must match type in ContractTypes */
    type: string;
    /* The id used for the popup. We need this to close it later. */
    popupId: string;

    constructor(fn: string = "",
                type: string = "Find Largest Prime Factor",
                reward: ICodingContractReward | null = null) {
        this.fn = fn;
        if (!this.fn.endsWith(".cct")) {
            this.fn += ".cct";
        }

        // tslint:disable-next-line
        if (CodingContractTypes[type] == null) {
            throw new Error(`Error: invalid contract type: ${type} please contact developer`);
        }

        this.type = type;
        this.data = CodingContractTypes[type].generate();
        this.reward = reward;
        this.popupId = `coding-contract-prompt-popup-${this.fn}`;
        // this.popup = new CodingContractPopup({c:this});
    }

    getData(): any {
        return this.data;
    }

    getDescription(): string {
        return CodingContractTypes[this.type].desc(this.data);
    }

    getDifficulty(): number {
        return CodingContractTypes[this.type].difficulty;
    }

    getMaxNumTries(): number {
        return CodingContractTypes[this.type].numTries;
    }

    getType(): string {
        return CodingContractTypes[this.type].name;
    }

    isSolution(solution: string): boolean {
        return CodingContractTypes[this.type].solver(this.data, solution);
    }

    isCancelled() {
        //
    }
    /**
     * Creates a popup to prompt the player to solve the problem
     */
    async prompt(){
        return new Promise<CodingContractResult>((resolve: Function, reject: Function) => {
            let popup = new CodingContractPopup({c:this, 
                onCloseClick: () => {
                    resolve(CodingContractResult.Cancelled); 
                    removePopup(this.popupId);
                },
                onSolveClick: () => {
                    const answer: string = popup.getValue();
                    if (this.isSolution(answer)) {
                        resolve(CodingContractResult.Success);
                    } else {
                        resolve(CodingContractResult.Failure);
                    }
                    removePopup(this.popupId);
                }
            });
            createPopup(this.popupId, CodingContractPopup, popup.props);
        });
    }

    /**
     * Serialize the current file to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("CodingContract", this);
    }
}

Reviver.constructors.CodingContract = CodingContract;
