import { IActionIdentifier } from "./IActionIdentifier";
import { City } from "./City";

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
    automateActionHigh: number;
    automateThreshHigh: number;
    automateActionLow: number;
    automateThreshLow: number;
    consoleHistory: string[];
    consoleLogs: string[];

    getCurrentCity(): City;
    calculateStaminaPenalty(): number;
}