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
import { GetServer } from "../Server/AllServers";

import { Hacknet as IHacknet } from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptHacknet(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IHacknet {
  // Utility function to get Hacknet Node object
  const getHacknetNode = function (i: any, callingFn = ""): HacknetNode | HacknetServer {
    if (isNaN(i)) {
      throw helper.makeRuntimeErrorMsg(callingFn, "Invalid index specified for Hacknet Node: " + i);
    }
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
    numNodes: function (): any {
      return player.hacknetNodes.length;
    },
    maxNumNodes: function (): any {
      if (hasHacknetServers(player)) {
        return HacknetServerConstants.MaxServers;
      }
      return Infinity;
    },
    purchaseNode: function (): any {
      return purchaseHacknet(player);
    },
    getPurchaseNodeCost: function (): any {
      if (hasHacknetServers(player)) {
        return getCostOfNextHacknetServer(player);
      } else {
        return getCostOfNextHacknetNode(player);
      }
    },
    getNodeStats: function (i: any): any {
      const node = getHacknetNode(i, "getNodeStats");
      const hasUpgraded = hasHacknetServers(player);
      const res: any = {
        name: node instanceof HacknetServer ? node.hostname : node.name,
        level: node.level,
        ram: node instanceof HacknetServer ? node.maxRam : node.ram,
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
    upgradeLevel: function (i: any, n: any): any {
      const node = getHacknetNode(i, "upgradeLevel");
      return purchaseLevelUpgrade(player, node, n);
    },
    upgradeRam: function (i: any, n: any): any {
      const node = getHacknetNode(i, "upgradeRam");
      return purchaseRamUpgrade(player, node, n);
    },
    upgradeCore: function (i: any, n: any): any {
      const node = getHacknetNode(i, "upgradeCore");
      return purchaseCoreUpgrade(player, node, n);
    },
    upgradeCache: function (i: any, n: any): any {
      if (!hasHacknetServers(player)) {
        return false;
      }
      const node = getHacknetNode(i, "upgradeCache");
      if (!(node instanceof HacknetServer)) {
        workerScript.log("upgradeCache", "Can only be called on hacknet servers");
        return false;
      }
      const res = purchaseCacheUpgrade(player, node, n);
      if (res) {
        updateHashManagerCapacity(player);
      }
      return res;
    },
    getLevelUpgradeCost: function (i: any, n: any): any {
      const node = getHacknetNode(i, "upgradeLevel");
      return node.calculateLevelUpgradeCost(n, player.hacknet_node_level_cost_mult);
    },
    getRamUpgradeCost: function (i: any, n: any): any {
      const node = getHacknetNode(i, "upgradeRam");
      return node.calculateRamUpgradeCost(n, player.hacknet_node_ram_cost_mult);
    },
    getCoreUpgradeCost: function (i: any, n: any): any {
      const node = getHacknetNode(i, "upgradeCore");
      return node.calculateCoreUpgradeCost(n, player.hacknet_node_core_cost_mult);
    },
    getCacheUpgradeCost: function (i: any, n: any): any {
      if (!hasHacknetServers(player)) {
        return Infinity;
      }
      const node = getHacknetNode(i, "upgradeCache");
      if (!(node instanceof HacknetServer)) {
        workerScript.log("getCacheUpgradeCost", "Can only be called on hacknet servers");
        return -1;
      }
      return node.calculateCacheUpgradeCost(n);
    },
    numHashes: function (): any {
      if (!hasHacknetServers(player)) {
        return 0;
      }
      return player.hashManager.hashes;
    },
    hashCapacity: function (): any {
      if (!hasHacknetServers(player)) {
        return 0;
      }
      return player.hashManager.capacity;
    },
    hashCost: function (upgName: any): any {
      if (!hasHacknetServers(player)) {
        return Infinity;
      }

      return player.hashManager.getUpgradeCost(upgName);
    },
    spendHashes: function (upgName: any, upgTarget: any): any {
      if (!hasHacknetServers(player)) {
        return false;
      }
      return purchaseHashUpgrade(player, upgName, upgTarget);
    },
    getHashUpgradeLevel: function (upgName: any): any {
      const level = player.hashManager.upgrades[upgName];
      if (level === undefined) {
        throw helper.makeRuntimeErrorMsg("hacknet.hashUpgradeLevel", `Invalid Hash Upgrade: ${upgName}`);
      }
      return level;
    },
    getStudyMult: function (): any {
      if (!hasHacknetServers(player)) {
        return false;
      }
      return player.hashManager.getStudyMult();
    },
    getTrainingMult: function (): any {
      if (!hasHacknetServers(player)) {
        return false;
      }
      return player.hashManager.getTrainingMult();
    },
  };
}
