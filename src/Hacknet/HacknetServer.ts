/**
 * Hacknet Servers - Reworked Hacknet Node mechanic for BitNode-9
 */
import { CONSTANTS } from "../Constants";

import { IHacknetNode } from "./IHacknetNode";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { BaseServer } from "../Server/BaseServer";
import { RunningScript } from "../Script/RunningScript";

import { createRandomIp } from "../../utils/IPAddress";

import {
    Generic_fromJSON,
    Generic_toJSON,
    Reviver
} from "../../utils/JSONReviver";

// Constants for Hacknet Server stats/production
export const HacknetServerHashesPerLevel: number = 0.001;

// Constants for Hacknet Server purchase/upgrade costs
export const BaseCostForHacknetServer: number = 50e3;
export const BaseCostFor1GBHacknetServerRam: number = 200e3;
export const BaseCostForHacknetServerCore: number = 1e6;
export const BaseCostForHacknetServerCache: number = 10e6;

export const HacknetServerPurchaseMult: number = 3.2;       // Multiplier for puchasing an additional Hacknet Server
export const HacknetServerUpgradeLevelMult: number = 1.1;   // Multiplier for cost when upgrading level
export const HacknetServerUpgradeRamMult: number = 1.4;     // Multiplier for cost when upgrading RAM
export const HacknetServerUpgradeCoreMult: number = 1.55;   // Multiplier for cost when buying another core
export const HacknetServerUpgradeCacheMult: number = 1.85;  // Multiplier for cost when upgrading cache

export const MaxNumberHacknetServers: number = 20;          // Max number of Hacknet Servers you can own

// Constants for max upgrade levels for Hacknet Server
export const HacknetServerMaxLevel: number = 300;
export const HacknetServerMaxRam: number = 8192;
export const HacknetServerMaxCores: number = 128;
export const HacknetServerMaxCache: number = 15;

interface IConstructorParams {
    adminRights?: boolean;
    hostname: string;
    ip?: string;
    isConnectedTo?: boolean;
    maxRam?: number;
    organizationName?: string;
}

export class HacknetServer extends BaseServer implements IHacknetNode {
    // Initializes a HacknetServer Object from a JSON save state
    static fromJSON(value: any): HacknetServer {
        return Generic_fromJSON(HacknetServer, value.data);
    }

    // Cache level. Affects hash Capacity
    cache: number = 1;

    // Number of cores. Improves hash production
    cores: number = 1;

    // Number of hashes that can be stored by this Hacknet Server
    hashCapacity: number = 0;

    // Hashes produced per second
    hashRate: number = 0;

    // Similar to Node level. Improves hash production
    level: number = 1;

    // How long this HacknetServer has existed, in seconds
    onlineTimeSeconds: number = 0;

    // Total number of hashes earned by this
    totalHashesGenerated: number = 0;

    constructor(params: IConstructorParams={ hostname: "", ip: createRandomIp() }) {
        super(params);

        this.maxRam = 1;
        this.updateHashCapacity();
    }

    calculateCacheUpgradeCost(levels: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.cache >= HacknetServerMaxCache) {
            return Infinity;
        }

        const mult = HacknetServerUpgradeCacheMult;
        let totalCost = 0;
        let currentCache = this.cache;
        for (let i = 0; i < sanitizedLevels; ++i) {
            totalCost += Math.pow(mult, currentCache - 1);
            ++currentCache;
        }
        totalCost *= BaseCostForHacknetServerCache;

        return totalCost;
    }

    calculateCoreUpgradeCost(levels: number, costMult: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.cores >= HacknetServerMaxCores) {
            return Infinity;
        }

        const mult  = HacknetServerUpgradeCoreMult;
        let totalCost = 0;
        let currentCores = this.cores;
        for (let i = 0; i < sanitizedLevels; ++i) {
            totalCost += Math.pow(mult, currentCores-1);
            ++currentCores;
        }
        totalCost *= BaseCostForHacknetServerCore;
        totalCost *= costMult;

        return totalCost;
    }

    calculateLevelUpgradeCost(levels: number, costMult: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.level >= HacknetServerMaxLevel) {
            return Infinity;
        }

        const mult = HacknetServerUpgradeLevelMult;
        let totalMultiplier = 0;
        let currLevel = this.level;
        for (let i = 0; i < sanitizedLevels; ++i) {
            totalMultiplier += Math.pow(mult, currLevel);
            ++currLevel;
        }

        return 10 * BaseCostForHacknetServer * totalMultiplier * costMult;
    }

    calculateRamUpgradeCost(levels: number, costMult: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.maxRam >= HacknetServerMaxRam) {
            return Infinity;
        }

        let totalCost = 0;
        let numUpgrades = Math.round(Math.log2(this.maxRam));
        let currentRam = this.maxRam;
        for (let i = 0; i < sanitizedLevels; ++i) {
            let baseCost = currentRam * BaseCostFor1GBHacknetServerRam;
            let mult = Math.pow(HacknetServerUpgradeRamMult, numUpgrades);

            totalCost += (baseCost * mult);

            currentRam *= 2;
            ++numUpgrades;
        }
        totalCost *= costMult;

        return totalCost;
    }

    // Process this Hacknet Server in the game loop. Returns the number of hashes generated
    process(numCycles: number=1): number {
        const seconds = numCycles * CONSTANTS.MilliPerCycle / 1000;

        return this.hashRate * seconds;
    }

    upgradeCache(levels: number): void {
        this.cache = Math.min(HacknetServerMaxCache, Math.round(this.cache + levels));
        this.updateHashCapacity();
    }

    upgradeCore(levels: number, prodMult: number): void {
        this.cores = Math.min(HacknetServerMaxCores, Math.round(this.cores + levels));
        this.updateHashRate(prodMult);
    }

    upgradeLevel(levels: number, prodMult: number): void {
        this.level = Math.min(HacknetServerMaxLevel, Math.round(this.level + levels));
        this.updateHashRate(prodMult);
    }

    upgradeRam(levels: number, prodMult: number): boolean {
        for (let i = 0; i < levels; ++i) {
            this.maxRam *= 2;
        }
        this.maxRam = Math.min(HacknetServerMaxRam, Math.round(this.maxRam));
        this.updateHashRate(prodMult);

        return true;
    }
    
    // Whenever a script is run, we must update this server's hash rate
    runScript(script: RunningScript, prodMult?: number): void {
        super.runScript(script);
        if (prodMult != null && typeof prodMult === "number") {
            this.updateHashRate(prodMult);
        }
    }

    updateHashCapacity(): void {
        this.hashCapacity = 32 * Math.pow(2, this.cache);
    }

    updateHashRate(prodMult: number): void {
        const baseGain = HacknetServerHashesPerLevel * this.level;
        const ramMultiplier = Math.pow(1.07, Math.log2(this.maxRam));
        const coreMultiplier = 1 + (this.cores - 1) / 5;
        const ramRatio = (1 - this.ramUsed / this.maxRam);

        const hashRate = baseGain * ramMultiplier * coreMultiplier * ramRatio;

        this.hashRate = hashRate * prodMult * BitNodeMultipliers.HacknetNodeMoney;

        if (isNaN(this.hashRate)) {
            this.hashRate = 0;
            console.error(`Error calculating Hacknet Server hash production. This is a bug. Please report to game dev`, false);
        }
    }

    // Serialize the current object to a JSON save state
    toJSON(): any {
        return Generic_toJSON("HacknetServer", this);
    }
}

Reviver.constructors.HacknetServer = HacknetServer;
