/**
 * Hacknet Node Class
 *
 * Hacknet Nodes are specialized machines that passively earn the player money over time.
 * They can be upgraded to increase their production
 */
import { IHacknetNode } from "./IHacknetNode";

import { CONSTANTS } from "../Constants";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { IPlayer } from "../PersonObjects/IPlayer";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";

// Constants for Hacknet Node production
export const HacknetNodeMoneyGainPerLevel: number = 1.6;    // Base production per level

// Constants for Hacknet Node purchase/upgrade costs
export const BaseCostForHacknetNode: number = 1000;
export const BaseCostFor1GBOfRamHacknetNode: number = 30e3;
export const BaseCostForHacknetNodeCore: number = 500e3;
export const HacknetNodePurchaseNextMult: number = 1.85;    // Multiplier when purchasing an additional hacknet node
export const HacknetNodeUpgradeLevelMult: number = 1.04;    // Multiplier for cost when upgrading level
export const HacknetNodeUpgradeRamMult: number = 1.28;      // Multiplier for cost when upgrading RAM
export const HacknetNodeUpgradeCoreMult: number = 1.48;     // Multiplier for cost when buying another core

// Constants for max upgrade levels for Hacknet Nodes
export const HacknetNodeMaxLevel:  number = 200;
export const HacknetNodeMaxRam: number = 64;
export const HacknetNodeMaxCores: number = 16;

export class HacknetNode implements IHacknetNode {
    /**
     * Initiatizes a HacknetNode object from a JSON save state.
     */
    static fromJSON(value: any): HacknetNode {
        return Generic_fromJSON(HacknetNode, value.data);
    }

    // Node's number of cores
    cores: number = 1;

    // Node's Level
    level: number = 1;

    // Node's production per second
    moneyGainRatePerSecond: number = 0;

    // Identifier for Node. Includes the full "name" (hacknet-node-N)
    name: string;

    // How long this Node has existed, in seconds
    onlineTimeSeconds: number = 0;

    // Node's RAM (GB)
    ram: number = 1;

    // Total money earned by this Node
    totalMoneyGenerated: number = 0;

    constructor(name: string="", prodMult: number=1) {
        this.name       = name;

        this.updateMoneyGainRate(prodMult);
    }

    // Get the cost to upgrade this Node's number of cores
    calculateCoreUpgradeCost(levels: number=1, costMult: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.cores >= HacknetNodeMaxCores) {
            return Infinity;
        }

        const coreBaseCost  = BaseCostForHacknetNodeCore;
        const mult          = HacknetNodeUpgradeCoreMult;
        let totalCost       = 0;
        let currentCores    = this.cores;
        for (let i = 0; i < sanitizedLevels; ++i) {
            totalCost += (coreBaseCost * Math.pow(mult, currentCores-1));
            ++currentCores;
        }

        totalCost *= costMult;

        return totalCost;
    }

    // Get the cost to upgrade this Node's level
    calculateLevelUpgradeCost(levels: number=1, costMult: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.level >= HacknetNodeMaxLevel) {
            return Infinity;
        }

        const mult = HacknetNodeUpgradeLevelMult;
        let totalMultiplier = 0;
        let currLevel = this.level;
        for (let i = 0; i < sanitizedLevels; ++i) {
            totalMultiplier += Math.pow(mult, currLevel);
            ++currLevel;
        }

        return BaseCostForHacknetNode / 2 * totalMultiplier * costMult;
    }

    // Get the cost to upgrade this Node's RAM
    calculateRamUpgradeCost(levels: number=1, costMult: number): number {
        const sanitizedLevels = Math.round(levels);
        if (isNaN(sanitizedLevels) || sanitizedLevels < 1) {
            return 0;
        }

        if (this.ram >= HacknetNodeMaxRam) {
            return Infinity;
        }

        let totalCost = 0;
        let numUpgrades = Math.round(Math.log2(this.ram));
        let currentRam = this.ram;

        for (let i = 0; i < sanitizedLevels; ++i) {
            let baseCost = currentRam * BaseCostFor1GBOfRamHacknetNode;
            let mult = Math.pow(HacknetNodeUpgradeRamMult, numUpgrades);

            totalCost += (baseCost * mult);

            currentRam *= 2;
            ++numUpgrades;
        }

        totalCost *= costMult;

        return totalCost;
    }

    // Process this Hacknet Node in the game loop.
    // Returns the amount of money generated
    process(numCycles: number=1): number {
        const seconds = numCycles * CONSTANTS.MilliPerCycle / 1000;
        let gain = this.moneyGainRatePerSecond * seconds;
        if (isNaN(gain)) {
            console.error(`Hacknet Node ${this.name} calculated earnings of NaN`);
            gain = 0;
        }

        this.totalMoneyGenerated += gain;
        this.onlineTimeSeconds += seconds;

        return gain;
    }

    // Upgrade this Node's number of cores, if possible
    // Returns a boolean indicating whether new cores were successfully bought
    upgradeCore(levels: number=1, prodMult: number): void {
        this.cores = Math.min(HacknetNodeMaxCores, Math.round(this.cores + levels));
        this.updateMoneyGainRate(prodMult);
    }

    // Upgrade this Node's level, if possible
    // Returns a boolean indicating whether the level was successfully updated
    upgradeLevel(levels: number=1, prodMult: number): void {
        this.level = Math.min(HacknetNodeMaxLevel, Math.round(this.level + levels));
        this.updateMoneyGainRate(prodMult);
    }

    // Upgrade this Node's RAM, if possible
    // Returns a boolean indicating whether the RAM was successfully upgraded
    upgradeRam(levels: number=1, prodMult: number): void {
        for (let i = 0; i < levels; ++i) {
            this.ram *= 2; // Ram is always doubled
        }
        this.ram = Math.round(this.ram); // Handle any floating point precision issues
        this.updateMoneyGainRate(prodMult);
    }

    // Re-calculate this Node's production and update the moneyGainRatePerSecond prop
    updateMoneyGainRate(prodMult: number): void {
        //How much extra $/s is gained per level
        var gainPerLevel = HacknetNodeMoneyGainPerLevel;

        this.moneyGainRatePerSecond = (this.level * gainPerLevel) *
                                      Math.pow(1.035, this.ram - 1) *
                                      ((this.cores + 5) / 6) *
                                      prodMult *
                                      BitNodeMultipliers.HacknetNodeMoney;
        if (isNaN(this.moneyGainRatePerSecond)) {
            this.moneyGainRatePerSecond = 0;
            dialogBoxCreate("Error in calculating Hacknet Node production. Please report to game developer", false);
        }
    }

    /**
     * Serialize the current object to a JSON save state.
     */
    toJSON(): any {
        return Generic_toJSON("HacknetNode", this);
    }
}

Reviver.constructors.HacknetNode = HacknetNode;
