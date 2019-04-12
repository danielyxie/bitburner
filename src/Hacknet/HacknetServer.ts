/**
 * Hacknet Servers - Reworked Hacknet Node mechanic for BitNode-9
 */
import { CONSTANTS } from "../Constants";

import { IHacknetNode } from "./IHacknetNode";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { IPlayer } from "../PersonObjects/IPlayer";
import { BaseServer } from "../Server/BaseServer";
import { RunningScript } from "../Script/RunningScript";

import { createRandomIp } from "../../utils/IPAddress";

import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";

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

export const MaxNumberHacknetServers: number = 25;          // Max number of Hacknet Servers you can own

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
    player?: IPlayer;
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

        if (params.player) {
            this.updateHashRate(params.player);
        }
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

    calculateCoreUpgradeCost(levels: number, p: IPlayer): number {
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
        totalCost *= p.hacknet_node_core_cost_mult;

        return totalCost;
    }

    calculateLevelUpgradeCost(levels: number, p: IPlayer): number {
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

        return 10 * BaseCostForHacknetServer * totalMultiplier * p.hacknet_node_level_cost_mult;
    }

    calculateRamUpgradeCost(levels: number, p: IPlayer): number {
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
        totalCost *= p.hacknet_node_ram_cost_mult;

        return totalCost;
    }

    // Process this Hacknet Server in the game loop.
    // Returns the number of hashes generated
    process(numCycles: number=1): number {
        const seconds = numCycles * CONSTANTS.MilliPerCycle / 1000;

        return this.hashRate * seconds;
    }

    // Returns a boolean indicating whether the cache was successfully upgraded
    purchaseCacheUpgrade(levels: number, p: IPlayer): boolean {
        const sanitizedLevels = Math.round(levels);
        const cost = this.calculateCacheUpgradeCost(levels);
        if (isNaN(cost) || cost <= 0 || sanitizedLevels <= 0) {
            return false;
        }

        if (this.cache >= HacknetServerMaxCache) {
            return false;
        }

        // If the specified number of upgrades would exceed the max, try to purchase
        // the maximum possible
        if (this.cache + levels > HacknetServerMaxCache) {
            const diff = Math.max(0, HacknetServerMaxCache - this.cache);
            return this.purchaseCacheUpgrade(diff, p);
        }

        if (!p.canAfford(cost)) {
            return false;
        }

        p.loseMoney(cost);
        this.cache = Math.round(this.cache + sanitizedLevels);
        this.updateHashCapacity();

        return true;
    }

    // Returns a boolean indicating whether the number of cores was successfully upgraded
    purchaseCoreUpgrade(levels: number, p: IPlayer): boolean {
        const sanitizedLevels = Math.round(levels);
        const cost = this.calculateCoreUpgradeCost(sanitizedLevels, p);
        if (isNaN(cost) || cost <= 0 || sanitizedLevels <= 0) {
            return false;
        }

        if (this.cores >= HacknetServerMaxCores) {
            return false;
        }

        // If the specified number of upgrades would exceed the max, try to purchase
        // the maximum possible
        if (this.cores + sanitizedLevels > HacknetServerMaxCores) {
            const diff = Math.max(0, HacknetServerMaxCores - this.cores);
            return this.purchaseCoreUpgrade(diff, p);
        }

        if (!p.canAfford(cost)) {
            return false;
        }

        p.loseMoney(cost);
        this.cores = Math.round(this.cores + sanitizedLevels);
        this.updateHashRate(p);

        return true;
    }

    // Returns a boolean indicating whether the level was successfully upgraded
    purchaseLevelUpgrade(levels: number, p: IPlayer): boolean {
        const sanitizedLevels = Math.round(levels);
        const cost = this.calculateLevelUpgradeCost(sanitizedLevels, p);
        if (isNaN(cost) || cost <= 0 || sanitizedLevels <= 0) {
            return false;
        }

        if (this.level >= HacknetServerMaxLevel) {
            return false;
        }

        // If the specified number of upgrades would exceed the max, try to purchase the
        // maximum possible
        if (this.level + sanitizedLevels > HacknetServerMaxLevel) {
            const diff = Math.max(0, HacknetServerMaxLevel - this.level);
            return this.purchaseLevelUpgrade(diff, p);
        }

        if (!p.canAfford(cost)) {
            return false;
        }

        p.loseMoney(cost);
        this.level = Math.round(this.level + sanitizedLevels);
        this.updateHashRate(p);

        return true;
    }

    // Returns a boolean indicating whether the RAM was successfully upgraded
    purchaseRamUpgrade(levels: number, p: IPlayer): boolean {
        const sanitizedLevels = Math.round(levels);
        const cost = this.calculateRamUpgradeCost(sanitizedLevels, p);
        if(isNaN(cost) || cost <= 0 || sanitizedLevels <= 0) {
            return false;
        }

        if (this.maxRam >= HacknetServerMaxRam) {
            return false;
        }

        // If the specified number of upgrades would exceed the max, try to purchase
        // just the maximum possible
        if (this.maxRam * Math.pow(2, sanitizedLevels) > HacknetServerMaxRam) {
            const diff = Math.max(0, Math.log2(Math.round(HacknetServerMaxRam / this.maxRam)));
            return this.purchaseRamUpgrade(diff, p);
        }

        if (!p.canAfford(cost)) {
            return false;
        }

        p.loseMoney(cost);
        for (let i = 0; i < sanitizedLevels; ++i) {
            this.maxRam *= 2;
        }
        this.maxRam = Math.round(this.maxRam);
        this.updateHashRate(p);

        return true;
    }

    /**
     * Whenever a script is run, we must update this server's hash rate
     */
    runScript(script: RunningScript, p?: IPlayer): void {
        super.runScript(script);
        if (p) {
            this.updateHashRate(p);
        }
    }

    updateHashCapacity(): void {
        this.hashCapacity = 32 * Math.pow(2, this.cache);
    }

    updateHashRate(p: IPlayer): void {
        const baseGain = HacknetServerHashesPerLevel * this.level;
        const ramMultiplier = Math.pow(1.07, Math.log2(this.maxRam));
        const coreMultiplier = 1 + (this.cores - 1) / 5;
        const ramRatio = (1 - this.ramUsed / this.maxRam);

        const hashRate = baseGain * ramMultiplier * coreMultiplier * ramRatio;

        this.hashRate = hashRate * p.hacknet_node_money_mult * BitNodeMultipliers.HacknetNodeMoney;

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
