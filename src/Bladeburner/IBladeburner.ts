import { IActionIdentifier } from "./IActionIdentifier";
import { City } from "./City";
import { Skill } from "./Skill";

export interface IBladeburner {
    numHosp: number;
    moneyLost: number;
    rank: number;
    maxRank: number;
    skillPoints: number;
    totalSkillPoints: number;
    teamSize: number;
    teamLost: number;
    storedCycles: number;
    randomEventCounter: number;
    actionTimeToComplete: number;
    actionTimeCurrent: number;
    actionTimeOverflow: number;
    action: IActionIdentifier;
    cities: any;
    city: string;
    skills: any;
    skillMultipliers: any;
    staminaBonus: number;
    maxStamina: number;
    stamina: number;
    contracts: any;
    operations: any;
    blackops: any;
    logging: any;
    automateEnabled: boolean;
    automateActionHigh: IActionIdentifier;
    automateThreshHigh: number;
    automateActionLow: IActionIdentifier;
    automateThreshLow: number;
    consoleHistory: string[];
    consoleLogs: string[];

    getCurrentCity(): City;
    calculateStaminaPenalty(): number;
    startAction(action: IActionIdentifier): void;
    upgradeSkill(skill: Skill): void;
    executeConsoleCommands(command: string): void;
    postToConsole(input: string, saveToLogs?: boolean): void;
    log(input: string): void;
    resetAction(): void;
    clearConsole(): void;
}