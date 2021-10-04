/**
 * Hacknet Servers - Reworked Hacknet Node mechanic for BitNode-9
 */
import { CONSTANTS } from "../Constants";

import { IHacknetNode } from "./IHacknetNode";

import { BaseServer } from "../Server/BaseServer";
import { RunningScript } from "../Script/RunningScript";
import { HacknetServerConstants } from "./data/Constants";
import {
  calculateHashGainRate,
  calculateLevelUpgradeCost,
  calculateRamUpgradeCost,
  calculateCoreUpgradeCost,
  calculateCacheUpgradeCost,
} from "./formulas/HacknetServers";

import { createRandomIp } from "../utils/IPAddress";

import { Generic_fromJSON, Generic_toJSON, Reviver } from "../utils/JSONReviver";

interface IConstructorParams {
  adminRights?: boolean;
  hostname: string;
  ip?: string;
  isConnectedTo?: boolean;
  maxRam?: number;
  organizationName?: string;
}

export class HacknetServer extends BaseServer implements IHacknetNode {
  // Cache level. Affects hash Capacity
  cache = 1;

  // Number of cores. Improves hash production
  cores = 1;

  // Number of hashes that can be stored by this Hacknet Server
  hashCapacity = 0;

  // Hashes produced per second
  hashRate = 0;

  // Similar to Node level. Improves hash production
  level = 1;

  // How long this HacknetServer has existed, in seconds
  onlineTimeSeconds = 0;

  // Total number of hashes earned by this server
  totalHashesGenerated = 0;

  constructor(params: IConstructorParams = { hostname: "", ip: createRandomIp() }) {
    super(params);

    this.maxRam = 1;
    this.updateHashCapacity();
  }

  calculateCacheUpgradeCost(levels: number): number {
    return calculateCacheUpgradeCost(this.cache, levels);
  }

  calculateCoreUpgradeCost(levels: number, costMult: number): number {
    return calculateCoreUpgradeCost(this.cores, levels, costMult);
  }

  calculateLevelUpgradeCost(levels: number, costMult: number): number {
    return calculateLevelUpgradeCost(this.level, levels, costMult);
  }

  calculateRamUpgradeCost(levels: number, costMult: number): number {
    return calculateRamUpgradeCost(this.maxRam, levels, costMult);
  }

  // Process this Hacknet Server in the game loop. Returns the number of hashes generated
  process(numCycles = 1): number {
    const seconds = (numCycles * CONSTANTS.MilliPerCycle) / 1000;
    this.onlineTimeSeconds += seconds;

    const hashes = this.hashRate * seconds;
    this.totalHashesGenerated += hashes;

    return hashes;
  }

  upgradeCache(levels: number): void {
    this.cache = Math.min(HacknetServerConstants.MaxCache, Math.round(this.cache + levels));
    this.updateHashCapacity();
  }

  upgradeCore(levels: number, prodMult: number): void {
    this.cores = Math.min(HacknetServerConstants.MaxCores, Math.round(this.cores + levels));
    this.updateHashRate(prodMult);
  }

  upgradeLevel(levels: number, prodMult: number): void {
    this.level = Math.min(HacknetServerConstants.MaxLevel, Math.round(this.level + levels));
    this.updateHashRate(prodMult);
  }

  upgradeRam(levels: number, prodMult: number): boolean {
    for (let i = 0; i < levels; ++i) {
      this.maxRam *= 2;
    }
    this.maxRam = Math.min(HacknetServerConstants.MaxRam, Math.round(this.maxRam));
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
    this.hashRate = calculateHashGainRate(this.level, this.ramUsed, this.maxRam, this.cores, prodMult);

    if (isNaN(this.hashRate)) {
      this.hashRate = 0;
      console.error(
        `Error calculating Hacknet Server hash production. This is a bug. Please report to game dev`,
        false,
      );
    }
  }

  // Serialize the current object to a JSON save state
  toJSON(): any {
    return Generic_toJSON("HacknetServer", this);
  }

  // Initializes a HacknetServer Object from a JSON save state
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): HacknetServer {
    return Generic_fromJSON(HacknetServer, value.data);
  }
}

Reviver.constructors.HacknetServer = HacknetServer;
