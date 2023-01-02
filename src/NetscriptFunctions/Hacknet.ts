import { Player as player } from "../Player";
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

import { Hacknet as IHacknet, NodeStats } from "@nsdefs";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { helpers } from "../Netscript/NetscriptHelpers";

export function NetscriptHacknet(): InternalAPI<IHacknet> {
  // Utility function to get Hacknet Node object
  const getHacknetNode = function (ctx: NetscriptContext, i: number): HacknetNode | HacknetServer {
    if (i < 0 || i >= player.hacknetNodes.length) {
      throw helpers.makeRuntimeErrorMsg(ctx, "Index specified for Hacknet Node is out-of-bounds: " + i);
    }

    if (hasHacknetServers()) {
      const hi = player.hacknetNodes[i];
      if (typeof hi !== "string") throw new Error("hacknet node was not a string");
      const hserver = GetServer(hi);
      if (!(hserver instanceof HacknetServer)) throw new Error("hacknet server was not actually hacknet server");
      if (hserver == null) {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
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
    numNodes: () => () => {
      return player.hacknetNodes.length;
    },
    maxNumNodes: () => () => {
      if (hasHacknetServers()) {
        return HacknetServerConstants.MaxServers;
      }
      return Infinity;
    },
    purchaseNode: () => () => {
      return purchaseHacknet();
    },
    getPurchaseNodeCost: () => () => {
      if (hasHacknetServers()) {
        return getCostOfNextHacknetServer();
      } else {
        return getCostOfNextHacknetNode();
      }
    },
    getNodeStats: (ctx) => (_i) => {
      const i = helpers.number(ctx, "i", _i);
      const node = getHacknetNode(ctx, i);
      const hasUpgraded = hasHacknetServers();
      const res: NodeStats = {
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
        res.ramUsed = node.ramUsed;
      }

      return res;
    },
    upgradeLevel:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        const node = getHacknetNode(ctx, i);
        return purchaseLevelUpgrade(node, n);
      },
    upgradeRam:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        const node = getHacknetNode(ctx, i);
        return purchaseRamUpgrade(node, n);
      },
    upgradeCore:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        const node = getHacknetNode(ctx, i);
        return purchaseCoreUpgrade(node, n);
      },
    upgradeCache:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        if (!hasHacknetServers()) {
          return false;
        }
        const node = getHacknetNode(ctx, i);
        if (!(node instanceof HacknetServer)) {
          helpers.log(ctx, () => "Can only be called on hacknet servers");
          return false;
        }
        const res = purchaseCacheUpgrade(node, n);
        if (res) {
          updateHashManagerCapacity();
        }
        return res;
      },
    getLevelUpgradeCost:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        const node = getHacknetNode(ctx, i);
        return node.calculateLevelUpgradeCost(n, player.mults.hacknet_node_level_cost);
      },
    getRamUpgradeCost:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        const node = getHacknetNode(ctx, i);
        return node.calculateRamUpgradeCost(n, player.mults.hacknet_node_ram_cost);
      },
    getCoreUpgradeCost:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        const node = getHacknetNode(ctx, i);
        return node.calculateCoreUpgradeCost(n, player.mults.hacknet_node_core_cost);
      },
    getCacheUpgradeCost:
      (ctx) =>
      (_i, _n = 1) => {
        const i = helpers.number(ctx, "i", _i);
        const n = helpers.number(ctx, "n", _n);
        if (!hasHacknetServers()) {
          return Infinity;
        }
        const node = getHacknetNode(ctx, i);
        if (!(node instanceof HacknetServer)) {
          helpers.log(ctx, () => "Can only be called on hacknet servers");
          return -1;
        }
        return node.calculateCacheUpgradeCost(n);
      },
    numHashes: () => () => {
      if (!hasHacknetServers()) {
        return 0;
      }
      return player.hashManager.hashes;
    },
    hashCapacity: () => () => {
      if (!hasHacknetServers()) {
        return 0;
      }
      return player.hashManager.capacity;
    },
    hashCost:
      (ctx) =>
      (_upgName, _count = 1) => {
        const upgName = helpers.string(ctx, "upgName", _upgName);
        const count = helpers.number(ctx, "count", _count);
        if (!hasHacknetServers()) {
          return Infinity;
        }

        return player.hashManager.getUpgradeCost(upgName, count);
      },
    spendHashes:
      (ctx) =>
      (_upgName, _upgTarget = "", _count = 1) => {
        const upgName = helpers.string(ctx, "upgName", _upgName);
        const upgTarget = helpers.string(ctx, "upgTarget", _upgTarget);
        const count = helpers.number(ctx, "count", _count);
        if (!hasHacknetServers()) {
          return false;
        }
        return purchaseHashUpgrade(upgName, upgTarget, count);
      },
    getHashUpgrades: () => () => {
      if (!hasHacknetServers()) {
        return [];
      }
      return Object.values(HashUpgrades).map((upgrade: HashUpgrade) => upgrade.name);
    },
    getHashUpgradeLevel: (ctx) => (_upgName) => {
      const upgName = helpers.string(ctx, "upgName", _upgName);
      const level = player.hashManager.upgrades[upgName];
      if (level === undefined) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid Hash Upgrade: ${upgName}`);
      }
      return level;
    },
    getStudyMult: () => () => {
      if (!hasHacknetServers()) {
        return 1;
      }
      return player.hashManager.getStudyMult();
    },
    getTrainingMult: () => () => {
      if (!hasHacknetServers()) {
        return 1;
      }
      return player.hashManager.getTrainingMult();
    },
  };
}
