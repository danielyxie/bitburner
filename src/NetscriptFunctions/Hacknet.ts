import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { HacknetServerConstants } from "../Hacknet/data/Constants";
import {
  getCostOfNextHacknetNode,
  getCostOfNextHacknetServer,
  hasHacknetServers,
  purchaseHacknet,
  purchaseLevelUpgrade,
  purchaseRamUpgrade,
  purchaseCoreUpgrade,
  purchaseCacheUpgrade,
  purchaseHashUpgrade,
  updateHashManagerCapacity,
} from "../Hacknet/HacknetHelpers";
import { HacknetServer } from "../Hacknet/HacknetServer";
import { HacknetNode } from "../Hacknet/HacknetNode";
import { HashUpgrades } from "../Hacknet/HashUpgrades";
import { HashUpgrade } from "../Hacknet/HashUpgrade";
import { GetServer } from "../Server/AllServers";

import { Hacknet as IHacknet, NodeStats } from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptHacknet(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IHacknet {
  // Utility function to get Hacknet Node object
  const getHacknetNode = function (i: number, callingFn = ""): HacknetNode | HacknetServer {
    if (i < 0 || i >= player.hacknetNodes.length) {
      throw helper.makeRuntimeErrorMsg(callingFn, "Index specified for Hacknet Node is out-of-bounds: " + i);
    }

    if (hasHacknetServers(player)) {
      const hi = player.hacknetNodes[i];
      if (typeof hi !== "string") throw new Error("hacknet node was not a string");
      const hserver = GetServer(hi);
      if (!(hserver instanceof HacknetServer)) throw new Error("hacknet server was not actually hacknet server");
      if (hserver == null) {
        throw helper.makeRuntimeErrorMsg(
          callingFn,
          `Could not get Hacknet Server for index ${i}. This is probably a bug, please report to game dev`,
        );
      }

      return hserver;
    } else {
      const node = player.hacknetNodes[i];
      if (!(node instanceof HacknetNode)) throw new Error("hacknet node was not node.");
      return node;
    }
  };

  return {
    numNodes: function (): number {
      return player.hacknetNodes.length;
    },
    maxNumNodes: function (): number {
      if (hasHacknetServers(player)) {
        return HacknetServerConstants.MaxServers;
      }
      return Infinity;
    },
    purchaseNode: function (): number {
      return purchaseHacknet(player);
    },
    getPurchaseNodeCost: function (): number {
      if (hasHacknetServers(player)) {
        return getCostOfNextHacknetServer(player);
      } else {
        return getCostOfNextHacknetNode(player);
      }
    },
    getNodeStats: function (_i: unknown): NodeStats {
      const i = helper.number("getNodeStats", "i", _i);
      const node = getHacknetNode(i, "getNodeStats");
      const hasUpgraded = hasHacknetServers(player);
      const res: any = {
        name: node instanceof HacknetServer ? node.hostname : node.name,
        level: node.level,
        ram: node instanceof HacknetServer ? node.maxRam : node.ram,
        ramUsed: node instanceof HacknetServer ? node.ramUsed : undefined,
        cores: node.cores,
        production: node instanceof HacknetServer ? node.hashRate : node.moneyGainRatePerSecond,
        timeOnline: node.onlineTimeSeconds,
        totalProduction: node instanceof HacknetServer ? node.totalHashesGenerated : node.totalMoneyGenerated,
      };

      if (hasUpgraded && node instanceof HacknetServer) {
        res.cache = node.cache;
        res.hashCapacity = node.hashCapacity;
      }

      return res;
    },
    upgradeLevel: function (_i: unknown, _n: unknown = 1): boolean {
      const i = helper.number("upgradeLevel", "i", _i);
      const n = helper.number("upgradeLevel", "n", _n);
      const node = getHacknetNode(i, "upgradeLevel");
      return purchaseLevelUpgrade(player, node, n);
    },
    upgradeRam: function (_i: unknown, _n: unknown = 1): boolean {
      const i = helper.number("upgradeRam", "i", _i);
      const n = helper.number("upgradeRam", "n", _n);
      const node = getHacknetNode(i, "upgradeRam");
      return purchaseRamUpgrade(player, node, n);
    },
    upgradeCore: function (_i: unknown, _n: unknown = 1): boolean {
      const i = helper.number("upgradeCore", "i", _i);
      const n = helper.number("upgradeCore", "n", _n);
      const node = getHacknetNode(i, "upgradeCore");
      return purchaseCoreUpgrade(player, node, n);
    },
    upgradeCache: function (_i: unknown, _n: unknown = 1): boolean {
      const i = helper.number("upgradeCache", "i", _i);
      const n = helper.number("upgradeCache", "n", _n);
      if (!hasHacknetServers(player)) {
        return false;
      }
      const node = getHacknetNode(i, "upgradeCache");
      if (!(node instanceof HacknetServer)) {
        workerScript.log("hacknet.upgradeCache", () => "Can only be called on hacknet servers");
        return false;
      }
      const res = purchaseCacheUpgrade(player, node, n);
      if (res) {
        updateHashManagerCapacity(player);
      }
      return res;
    },
    getLevelUpgradeCost: function (_i: unknown, _n: unknown = 1): number {
      const i = helper.number("getLevelUpgradeCost", "i", _i);
      const n = helper.number("getLevelUpgradeCost", "n", _n);
      const node = getHacknetNode(i, "upgradeLevel");
      return node.calculateLevelUpgradeCost(n, player.hacknet_node_level_cost_mult);
    },
    getRamUpgradeCost: function (_i: unknown, _n: unknown = 1): number {
      const i = helper.number("getRamUpgradeCost", "i", _i);
      const n = helper.number("getRamUpgradeCost", "n", _n);
      const node = getHacknetNode(i, "upgradeRam");
      return node.calculateRamUpgradeCost(n, player.mults.hacknet_node_ram_cost);
    },
    getCoreUpgradeCost: function (_i: unknown, _n: unknown = 1): number {
      const i = helper.number("getCoreUpgradeCost", "i", _i);
      const n = helper.number("getCoreUpgradeCost", "n", _n);
      const node = getHacknetNode(i, "upgradeCore");
      return node.calculateCoreUpgradeCost(n, player.hacknet_node_core_cost_mult);
    },
    getCacheUpgradeCost: function (_i: unknown, _n: unknown = 1): number {
      const i = helper.number("getCacheUpgradeCost", "i", _i);
      const n = helper.number("getCacheUpgradeCost", "n", _n);
      if (!hasHacknetServers(player)) {
        return Infinity;
      }
      const node = getHacknetNode(i, "upgradeCache");
      if (!(node instanceof HacknetServer)) {
        workerScript.log("hacknet.getCacheUpgradeCost", () => "Can only be called on hacknet servers");
        return -1;
      }
      return node.calculateCacheUpgradeCost(n);
    },
    numHashes: function (): number {
      if (!hasHacknetServers(player)) {
        return 0;
      }
      return player.hashManager.hashes;
    },
    hashCapacity: function (): number {
      if (!hasHacknetServers(player)) {
        return 0;
      }
      return player.hashManager.capacity;
    },
    hashCost: function (_upgName: unknown): number {
      const upgName = helper.string("hashCost", "upgName", _upgName);
      if (!hasHacknetServers(player)) {
        return Infinity;
      }

      return player.hashManager.getUpgradeCost(upgName);
    },
    spendHashes: function (_upgName: unknown, _upgTarget: unknown = ""): boolean {
      const upgName = helper.string("spendHashes", "upgName", _upgName);
      const upgTarget = helper.string("spendHashes", "upgTarget", _upgTarget);
      if (!hasHacknetServers(player)) {
        return false;
      }
      return purchaseHashUpgrade(player, upgName, upgTarget);
    },
    getHashUpgrades: function (): string[] {
      if (!hasHacknetServers(player)) {
        return [];
      }
      return Object.values(HashUpgrades).map((upgrade: HashUpgrade) => upgrade.name);
    },
    getHashUpgradeLevel: function (_upgName: unknown): number {
      const upgName = helper.string("getHashUpgradeLevel", "upgName", _upgName);
      const level = player.hashManager.upgrades[upgName];
      if (level === undefined) {
        throw helper.makeRuntimeErrorMsg("hacknet.hashUpgradeLevel", `Invalid Hash Upgrade: ${upgName}`);
      }
      return level;
    },
    getStudyMult: function (): number {
      if (!hasHacknetServers(player)) {
        return 1;
      }
      return player.hashManager.getStudyMult();
    },
    getTrainingMult: function (): number {
      if (!hasHacknetServers(player)) {
        return 1;
      }
      return player.hashManager.getTrainingMult();
    },
  };
}
