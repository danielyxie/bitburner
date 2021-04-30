import {
    codingContractTypesMetadata,
    DescriptionFunc,
    GeneratorFunc,
    SolverFunc,
} from "./data/codingcontracttypes";

import { IMap } from "./types";

import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver,
} from "../utils/JSONReviver";
import { KEY } from "../utils/helpers/keyCodes";
import { createElement } from "../utils/uiHelpers/createElement";
import { createPopup } from "../utils/uiHelpers/createPopup";
import { removeElementById } from "../utils/uiHelpers/removeElementById";

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
    tries = 0;

    /* String representing the contract's type. Must match type in ContractTypes */
    type: string;

    constructor(fn = "",
                type = "Find Largest Prime Factor",
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

    /**
     * Creates a popup to prompt the player to solve the problem
     */
    async prompt(): Promise<CodingContractResult> {
        // tslint:disable-next-line
        return new Promise<CodingContractResult>((resolve: Function, reject: Function) => {
            const contractType: CodingContractType = CodingContractTypes[this.type];
            const popupId = `coding-contract-prompt-popup-${this.fn}`;
            const title: HTMLElement = createElement("h1", {
                innerHTML: this.type,
            });
            const txt: HTMLElement = createElement("p", {
                innerHTML: ["You are attempting to solve a Coding Contract. You have",
                            `${this.getMaxNumTries() - this.tries} tries remaining,`,
                            "after which the contract will self-destruct.<br><br>",
                            `${contractType.desc(this.data).replace(/\n/g, "<br>")}`].join(" "),
            });
            let answerInput: HTMLInputElement;
            let solveBtn: HTMLElement;
            let cancelBtn: HTMLElement;
            answerInput = createElement("input", {
                onkeydown: (e: any) => {
                    if (e.keyCode === KEY.ENTER && answerInput.value !== "") {
                        e.preventDefault();
                        solveBtn.click();
                    } else if (e.keyCode === KEY.ESC) {
                        e.preventDefault();
                        cancelBtn.click();
                    }
                },
                placeholder: "Enter Solution here",
                width: "50%",
            }) as HTMLInputElement;
            solveBtn = createElement("a", {
                class: "a-link-button",
                clickListener: () => {
                    const answer: string = answerInput.value;
                    if (this.isSolution(answer)) {
                        resolve(CodingContractResult.Success);
                    } else {
                        resolve(CodingContractResult.Failure);
                    }
                    removeElementById(popupId);
                },
                innerText: "Solve",
            });
            cancelBtn = createElement("a", {
                class: "a-link-button",
                clickListener: () => {
                    resolve(CodingContractResult.Cancelled);
                    removeElementById(popupId);
                },
                innerText: "Cancel",
            });
            const lineBreak: HTMLElement = createElement("br");
            createPopup(popupId, [title, lineBreak, txt, lineBreak, lineBreak, answerInput, solveBtn, cancelBtn]);
            answerInput.focus();
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
