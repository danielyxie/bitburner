/**
 * Hacknet Node Class
 *
 * Hacknet Nodes are specialized machines that passively earn the player money over time.
 * They can be upgraded to increase their production
 */
import { IHacknetNode } from "./IHacknetNode";

import { CONSTANTS } from "../Constants";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import {
    calculateMoneyGainRate,
    calculateLevelUpgradeCost,
    calculateCoreUpgradeCost,
    calculateRamUpgradeCost,
} from "./formulas/HacknetNodes";
import { HacknetNodeConstants } from "./data/Constants";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { Generic_fromJSON,
         Generic_toJSON,
         Reviver } from "../../utils/JSONReviver";

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
        return calculateCoreUpgradeCost(this.cores, levels, costMult);
    }

    // Get the cost to upgrade this Node's level
    calculateLevelUpgradeCost(levels: number=1, costMult: number): number {
        return calculateLevelUpgradeCost(this.level, levels, costMult);
    }

    // Get the cost to upgrade this Node's RAM
    calculateRamUpgradeCost(levels: number=1, costMult: number): number {
        return calculateRamUpgradeCost(this.ram, levels, costMult);
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
        this.cores = Math.min(HacknetNodeConstants.MaxCores, Math.round(this.cores + levels));
        this.updateMoneyGainRate(prodMult);
    }

    // Upgrade this Node's level, if possible
    // Returns a boolean indicating whether the level was successfully updated
    upgradeLevel(levels: number=1, prodMult: number): void {
        this.level = Math.min(HacknetNodeConstants.MaxLevel, Math.round(this.level + levels));
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
        this.moneyGainRatePerSecond = calculateMoneyGainRate(this.level, this.ram, this.cores, prodMult);
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
