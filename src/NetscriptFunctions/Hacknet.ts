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
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";

export function NetscriptHacknet(player: IPlayer, workerScript: WorkerScript): InternalAPI<IHacknet> {
  // Utility function to get Hacknet Node object
  const getHacknetNode = function (ctx: NetscriptContext, i: number): HacknetNode | HacknetServer {
    if (i < 0 || i >= player.hacknetNodes.length) {
      throw ctx.makeRuntimeErrorMsg("Index specified for Hacknet Node is out-of-bounds: " + i);
    }

    if (hasHacknetServers(player)) {
      const hi = player.hacknetNodes[i];
      if (typeof hi !== "string") throw new Error("hacknet node was not a string");
      const hserver = GetServer(hi);
      if (!(hserver instanceof HacknetServer)) throw new Error("hacknet server was not actually hacknet server");
      if (hserver == null) {
        throw ctx.makeRuntimeErrorMsg(
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
    numNodes: () => (): number => {
      return player.hacknetNodes.length;
    },
    maxNumNodes: () => (): number => {
      if (hasHacknetServers(player)) {
        return HacknetServerConstants.MaxServers;
      }
      return Infinity;
    },
    purchaseNode: () => (): number => {
      return purchaseHacknet(player);
    },
    getPurchaseNodeCost: () => (): number => {
      if (hasHacknetServers(player)) {
        return getCostOfNextHacknetServer(player);
      } else {
        return getCostOfNextHacknetNode(player);
      }
    },
    getNodeStats:
      (ctx: NetscriptContext) =>
      (_i: unknown): NodeStats => {
        const i = ctx.helper.number("i", _i);
        const node = getHacknetNode(ctx, i);
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
    upgradeLevel:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): boolean => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        const node = getHacknetNode(ctx, i);
        return purchaseLevelUpgrade(player, node, n);
      },
    upgradeRam:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): boolean => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        const node = getHacknetNode(ctx, i);
        return purchaseRamUpgrade(player, node, n);
      },
    upgradeCore:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): boolean => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        const node = getHacknetNode(ctx, i);
        return purchaseCoreUpgrade(player, node, n);
      },
    upgradeCache:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): boolean => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        if (!hasHacknetServers(player)) {
          return false;
        }
        const node = getHacknetNode(ctx, i);
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
    getLevelUpgradeCost:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): number => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        const node = getHacknetNode(ctx, i);
        return node.calculateLevelUpgradeCost(n, player.mults.hacknet_node_level_cost);
      },
    getRamUpgradeCost:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): number => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        const node = getHacknetNode(ctx, i);
        return node.calculateRamUpgradeCost(n, player.mults.hacknet_node_ram_cost);
      },
    getCoreUpgradeCost:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): number => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        const node = getHacknetNode(ctx, i);
        return node.calculateCoreUpgradeCost(n, player.mults.hacknet_node_core_cost);
      },
    getCacheUpgradeCost:
      (ctx: NetscriptContext) =>
      (_i: unknown, _n: unknown = 1): number => {
        const i = ctx.helper.number("i", _i);
        const n = ctx.helper.number("n", _n);
        if (!hasHacknetServers(player)) {
          return Infinity;
        }
        const node = getHacknetNode(ctx, i);
        if (!(node instanceof HacknetServer)) {
          workerScript.log("hacknet.getCacheUpgradeCost", () => "Can only be called on hacknet servers");
          return -1;
        }
        return node.calculateCacheUpgradeCost(n);
      },
    numHashes: () => (): number => {
      if (!hasHacknetServers(player)) {
        return 0;
      }
      return player.hashManager.hashes;
    },
    hashCapacity: () => (): number => {
      if (!hasHacknetServers(player)) {
        return 0;
      }
      return player.hashManager.capacity;
    },
    hashCost:
      (ctx: NetscriptContext) =>
      (_upgName: unknown): number => {
        const upgName = ctx.helper.string("upgName", _upgName);
        if (!hasHacknetServers(player)) {
          return Infinity;
        }

        return player.hashManager.getUpgradeCost(upgName);
      },
    spendHashes:
      (ctx: NetscriptContext) =>
      (_upgName: unknown, _upgTarget: unknown = ""): boolean => {
        const upgName = ctx.helper.string("upgName", _upgName);
        const upgTarget = ctx.helper.string("upgTarget", _upgTarget);
        if (!hasHacknetServers(player)) {
          return false;
        }
        return purchaseHashUpgrade(player, upgName, upgTarget);
      },
    getHashUpgrades: () => (): string[] => {
      if (!hasHacknetServers(player)) {
        return [];
      }
      return Object.values(HashUpgrades).map((upgrade: HashUpgrade) => upgrade.name);
    },
    getHashUpgradeLevel:
      (ctx: NetscriptContext) =>
      (_upgName: unknown): number => {
        const upgName = ctx.helper.string("upgName", _upgName);
        const level = player.hashManager.upgrades[upgName];
        if (level === undefined) {
          throw ctx.makeRuntimeErrorMsg(`Invalid Hash Upgrade: ${upgName}`);
        }
        return level;
      },
    getStudyMult: () => (): number => {
      if (!hasHacknetServers(player)) {
        return 1;
      }
      return player.hashManager.getStudyMult();
    },
    getTrainingMult: () => (): number => {
      if (!hasHacknetServers(player)) {
        return 1;
      }
      return player.hashManager.getTrainingMult();
    },
  };
}
