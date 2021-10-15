/**
 * Generic helper/utility functions for the Hacknet mechanic:
 *  - Purchase nodes/upgrades
 *  - Calculating maximum number of upgrades
 *  - Processing Hacknet earnings
 *  - Updating Hash Manager capacity
 *  - Purchasing hash upgrades
 *
 * TODO Should probably split the different types of functions into their own modules
 */
import { HacknetNode } from "./HacknetNode";
import { calculateNodeCost } from "./formulas/HacknetNodes";
import { calculateServerCost } from "./formulas/HacknetServers";
import { HacknetNodeConstants, HacknetServerConstants } from "./data/Constants";
import { HacknetServer } from "./HacknetServer";
import { HashManager } from "./HashManager";
import { HashUpgrades } from "./HashUpgrades";

import { generateRandomContract } from "../CodingContractGenerator";
import { iTutorialSteps, iTutorialNextStep, ITutorial } from "../InteractiveTutorial";
import { IPlayer } from "../PersonObjects/IPlayer";
import { GetServer } from "../Server/AllServers";
import { Server } from "../Server/Server";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";

// Returns a boolean indicating whether the player has Hacknet Servers
// (the upgraded form of Hacknet Nodes)
export function hasHacknetServers(player: IPlayer): boolean {
  return player.bitNodeN === 9 || SourceFileFlags[9] > 0;
}

export function purchaseHacknet(player: IPlayer): number {
  /* INTERACTIVE TUTORIAL */
  if (ITutorial.isRunning) {
    if (ITutorial.currStep === iTutorialSteps.HacknetNodesIntroduction) {
      iTutorialNextStep();
    } else {
      return -1;
    }
  }
  /* END INTERACTIVE TUTORIAL */

  const numOwned = player.hacknetNodes.length;
  if (hasHacknetServers(player)) {
    const cost = getCostOfNextHacknetServer(player);
    if (isNaN(cost)) {
      throw new Error(`Calculated cost of purchasing HacknetServer is NaN`);
    }

    if (!player.canAfford(cost)) {
      return -1;
    }
    player.loseMoney(cost);
    player.createHacknetServer();
    updateHashManagerCapacity(player);

    return numOwned;
  } else {
    const cost = getCostOfNextHacknetNode(player);
    if (isNaN(cost)) {
      throw new Error(`Calculated cost of purchasing HacknetNode is NaN`);
    }

    if (!player.canAfford(cost)) {
      return -1;
    }

    // Auto generate a name for the Node
    const name = "hacknet-node-" + numOwned;
    const node = new HacknetNode(name, player.hacknet_node_money_mult);

    player.loseMoney(cost);
    player.hacknetNodes.push(node);

    return numOwned;
  }
}

export function hasMaxNumberHacknetServers(player: IPlayer): boolean {
  return hasHacknetServers(player) && player.hacknetNodes.length >= HacknetServerConstants.MaxServers;
}

export function getCostOfNextHacknetNode(player: IPlayer): number {
  return calculateNodeCost(player.hacknetNodes.length + 1, player.hacknet_node_purchase_cost_mult);
}

export function getCostOfNextHacknetServer(player: IPlayer): number {
  return calculateServerCost(player.hacknetNodes.length + 1, player.hacknet_node_purchase_cost_mult);
}

// Calculate the maximum number of times the Player can afford to upgrade a Hacknet Node's level
export function getMaxNumberLevelUpgrades(
  player: IPlayer,
  nodeObj: HacknetNode | HacknetServer,
  maxLevel: number,
): number {
  if (maxLevel == null) {
    throw new Error(`getMaxNumberLevelUpgrades() called without maxLevel arg`);
  }

  if (player.money.lt(nodeObj.calculateLevelUpgradeCost(1, player.hacknet_node_level_cost_mult))) {
    return 0;
  }

  let min = 1;
  let max = maxLevel - 1;
  const levelsToMax = maxLevel - nodeObj.level;
  if (player.money.gt(nodeObj.calculateLevelUpgradeCost(levelsToMax, player.hacknet_node_level_cost_mult))) {
    return levelsToMax;
  }

  while (min <= max) {
    const curr = ((min + max) / 2) | 0;
    if (
      curr !== maxLevel &&
      player.money.gt(nodeObj.calculateLevelUpgradeCost(curr, player.hacknet_node_level_cost_mult)) &&
      player.money.lt(nodeObj.calculateLevelUpgradeCost(curr + 1, player.hacknet_node_level_cost_mult))
    ) {
      return Math.min(levelsToMax, curr);
    } else if (player.money.lt(nodeObj.calculateLevelUpgradeCost(curr, player.hacknet_node_level_cost_mult))) {
      max = curr - 1;
    } else if (player.money.gt(nodeObj.calculateLevelUpgradeCost(curr, player.hacknet_node_level_cost_mult))) {
      min = curr + 1;
    } else {
      return Math.min(levelsToMax, curr);
    }
  }
  return 0;
}

// Calculate the maximum number of times the Player can afford to upgrade a Hacknet Node's RAM
export function getMaxNumberRamUpgrades(
  player: IPlayer,
  nodeObj: HacknetNode | HacknetServer,
  maxLevel: number,
): number {
  if (maxLevel == null) {
    throw new Error(`getMaxNumberRamUpgrades() called without maxLevel arg`);
  }

  if (player.money.lt(nodeObj.calculateRamUpgradeCost(1, player.hacknet_node_ram_cost_mult))) {
    return 0;
  }

  let levelsToMax;
  if (nodeObj instanceof HacknetServer) {
    levelsToMax = Math.round(Math.log2(maxLevel / nodeObj.maxRam));
  } else {
    levelsToMax = Math.round(Math.log2(maxLevel / nodeObj.ram));
  }
  if (player.money.gt(nodeObj.calculateRamUpgradeCost(levelsToMax, player.hacknet_node_ram_cost_mult))) {
    return levelsToMax;
  }

  //We'll just loop until we find the max
  for (let i = levelsToMax - 1; i >= 0; --i) {
    if (player.money.gt(nodeObj.calculateRamUpgradeCost(i, player.hacknet_node_ram_cost_mult))) {
      return i;
    }
  }
  return 0;
}

// Calculate the maximum number of times the Player can afford to upgrade a Hacknet Node's cores
export function getMaxNumberCoreUpgrades(
  player: IPlayer,
  nodeObj: HacknetNode | HacknetServer,
  maxLevel: number,
): number {
  if (maxLevel == null) {
    throw new Error(`getMaxNumberCoreUpgrades() called without maxLevel arg`);
  }

  if (player.money.lt(nodeObj.calculateCoreUpgradeCost(1, player.hacknet_node_core_cost_mult))) {
    return 0;
  }

  let min = 1;
  let max = maxLevel - 1;
  const levelsToMax = maxLevel - nodeObj.cores;
  if (player.money.gt(nodeObj.calculateCoreUpgradeCost(levelsToMax, player.hacknet_node_core_cost_mult))) {
    return levelsToMax;
  }

  // Use a binary search to find the max possible number of upgrades
  while (min <= max) {
    const curr = ((min + max) / 2) | 0;
    if (
      curr != maxLevel &&
      player.money.gt(nodeObj.calculateCoreUpgradeCost(curr, player.hacknet_node_core_cost_mult)) &&
      player.money.lt(nodeObj.calculateCoreUpgradeCost(curr + 1, player.hacknet_node_core_cost_mult))
    ) {
      return Math.min(levelsToMax, curr);
    } else if (player.money.lt(nodeObj.calculateCoreUpgradeCost(curr, player.hacknet_node_core_cost_mult))) {
      max = curr - 1;
    } else if (player.money.gt(nodeObj.calculateCoreUpgradeCost(curr, player.hacknet_node_core_cost_mult))) {
      min = curr + 1;
    } else {
      return Math.min(levelsToMax, curr);
    }
  }

  return 0;
}

// Calculate the maximum number of times the Player can afford to upgrade a Hacknet Node's cache
export function getMaxNumberCacheUpgrades(player: IPlayer, nodeObj: HacknetServer, maxLevel: number): number {
  if (maxLevel == null) {
    throw new Error(`getMaxNumberCacheUpgrades() called without maxLevel arg`);
  }

  if (!player.canAfford(nodeObj.calculateCacheUpgradeCost(1))) {
    return 0;
  }

  let min = 1;
  let max = maxLevel - 1;
  const levelsToMax = maxLevel - nodeObj.cache;
  if (player.canAfford(nodeObj.calculateCacheUpgradeCost(levelsToMax))) {
    return levelsToMax;
  }

  // Use a binary search to find the max possible number of upgrades
  while (min <= max) {
    const curr = ((min + max) / 2) | 0;
    if (
      curr != maxLevel &&
      player.canAfford(nodeObj.calculateCacheUpgradeCost(curr)) &&
      !player.canAfford(nodeObj.calculateCacheUpgradeCost(curr + 1))
    ) {
      return Math.min(levelsToMax, curr);
    } else if (!player.canAfford(nodeObj.calculateCacheUpgradeCost(curr))) {
      max = curr - 1;
    } else if (player.canAfford(nodeObj.calculateCacheUpgradeCost(curr))) {
      min = curr + 1;
    } else {
      return Math.min(levelsToMax, curr);
    }
  }

  return 0;
}

export function purchaseLevelUpgrade(player: IPlayer, node: HacknetNode | HacknetServer, levels = 1): boolean {
  const sanitizedLevels = Math.round(levels);
  const cost = node.calculateLevelUpgradeCost(sanitizedLevels, player.hacknet_node_level_cost_mult);
  if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
    return false;
  }

  const isServer = node instanceof HacknetServer;

  // If we're at max level, return false
  if (node.level >= (isServer ? HacknetServerConstants.MaxLevel : HacknetNodeConstants.MaxLevel)) {
    return false;
  }

  // If the number of specified upgrades would exceed the max level, calculate
  // the maximum number of upgrades and use that
  if (node.level + sanitizedLevels > (isServer ? HacknetServerConstants.MaxLevel : HacknetNodeConstants.MaxLevel)) {
    const diff = Math.max(0, (isServer ? HacknetServerConstants.MaxLevel : HacknetNodeConstants.MaxLevel) - node.level);
    return purchaseLevelUpgrade(player, node, diff);
  }

  if (!player.canAfford(cost)) {
    return false;
  }

  player.loseMoney(cost);
  node.upgradeLevel(sanitizedLevels, player.hacknet_node_money_mult);

  return true;
}

export function purchaseRamUpgrade(player: IPlayer, node: HacknetNode | HacknetServer, levels = 1): boolean {
  const sanitizedLevels = Math.round(levels);
  const cost = node.calculateRamUpgradeCost(sanitizedLevels, player.hacknet_node_ram_cost_mult);
  if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
    return false;
  }

  if (node instanceof HacknetServer && node.maxRam >= HacknetServerConstants.MaxRam) {
    return false;
  }

  if (node instanceof HacknetNode && node.ram >= HacknetNodeConstants.MaxRam) {
    return false;
  }

  // If the number of specified upgrades would exceed the max RAM, calculate the
  // max possible number of upgrades and use that
  if (node instanceof HacknetServer) {
    if (node.maxRam * Math.pow(2, sanitizedLevels) > HacknetServerConstants.MaxRam) {
      const diff = Math.max(0, Math.log2(Math.round(HacknetServerConstants.MaxRam / node.maxRam)));
      return purchaseRamUpgrade(player, node, diff);
    }
  } else if (node instanceof HacknetNode) {
    if (node.ram * Math.pow(2, sanitizedLevels) > HacknetNodeConstants.MaxRam) {
      const diff = Math.max(0, Math.log2(Math.round(HacknetNodeConstants.MaxRam / node.ram)));
      return purchaseRamUpgrade(player, node, diff);
    }
  }

  if (!player.canAfford(cost)) {
    return false;
  }

  player.loseMoney(cost);
  node.upgradeRam(sanitizedLevels, player.hacknet_node_money_mult);

  return true;
}

export function purchaseCoreUpgrade(player: IPlayer, node: HacknetNode | HacknetServer, levels = 1): boolean {
  const sanitizedLevels = Math.round(levels);
  const cost = node.calculateCoreUpgradeCost(sanitizedLevels, player.hacknet_node_core_cost_mult);
  if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
    return false;
  }

  const isServer = node instanceof HacknetServer;

  // Fail if we're already at max
  if (node.cores >= (isServer ? HacknetServerConstants.MaxCores : HacknetNodeConstants.MaxCores)) {
    return false;
  }

  // If the specified number of upgrades would exceed the max Cores, calculate
  // the max possible number of upgrades and use that
  if (node.cores + sanitizedLevels > (isServer ? HacknetServerConstants.MaxCores : HacknetNodeConstants.MaxCores)) {
    const diff = Math.max(0, (isServer ? HacknetServerConstants.MaxCores : HacknetNodeConstants.MaxCores) - node.cores);
    return purchaseCoreUpgrade(player, node, diff);
  }

  if (!player.canAfford(cost)) {
    return false;
  }

  player.loseMoney(cost);
  node.upgradeCore(sanitizedLevels, player.hacknet_node_money_mult);

  return true;
}

export function purchaseCacheUpgrade(player: IPlayer, node: HacknetServer, levels = 1): boolean {
  const sanitizedLevels = Math.round(levels);
  const cost = node.calculateCacheUpgradeCost(sanitizedLevels);
  if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
    return false;
  }

  if (!(node instanceof HacknetServer)) {
    console.warn(`purchaseCacheUpgrade() called for a non-HacknetNode`);
    return false;
  }

  // Fail if we're already at max
  if (node.cache + sanitizedLevels > HacknetServerConstants.MaxCache) {
    const diff = Math.max(0, HacknetServerConstants.MaxCache - node.cache);
    return purchaseCacheUpgrade(player, node, diff);
  }

  if (!player.canAfford(cost)) {
    return false;
  }

  player.loseMoney(cost);
  node.upgradeCache(sanitizedLevels);

  return true;
}

export function processHacknetEarnings(player: IPlayer, numCycles: number): number {
  // Determine if player has Hacknet Nodes or Hacknet Servers, then
  // call the appropriate function
  if (player.hacknetNodes.length === 0) {
    return 0;
  }
  if (hasHacknetServers(player)) {
    return processAllHacknetServerEarnings(player, numCycles);
  } else if (player.hacknetNodes[0] instanceof HacknetNode) {
    return processAllHacknetNodeEarnings(player, numCycles);
  } else {
    return 0;
  }
}

function processAllHacknetNodeEarnings(player: IPlayer, numCycles: number): number {
  let total = 0;
  for (let i = 0; i < player.hacknetNodes.length; ++i) {
    const node = player.hacknetNodes[i];
    if (typeof node === "string") throw new Error("player node should not be ip string");
    total += processSingleHacknetNodeEarnings(player, numCycles, node);
  }

  return total;
}

function processSingleHacknetNodeEarnings(player: IPlayer, numCycles: number, nodeObj: HacknetNode): number {
  const totalEarnings = nodeObj.process(numCycles);
  player.gainMoney(totalEarnings);
  player.recordMoneySource(totalEarnings, "hacknetnode");

  return totalEarnings;
}

function processAllHacknetServerEarnings(player: IPlayer, numCycles: number): number {
  if (!(player.hashManager instanceof HashManager)) {
    throw new Error(`Player does not have a HashManager (should be in 'hashManager' prop)`);
  }

  let hashes = 0;
  for (let i = 0; i < player.hacknetNodes.length; ++i) {
    // hacknetNodes array only contains the IP addresses of the servers.
    // Also, update the hash rate before processing
    const ip = player.hacknetNodes[i];
    if (ip instanceof HacknetNode) throw new Error(`player nodes should not be HacketNode`);
    const hserver = GetServer(ip);
    if (!(hserver instanceof HacknetServer)) throw new Error(`player nodes shoud not be Server`);
    hserver.updateHashRate(player.hacknet_node_money_mult);
    const h = hserver.process(numCycles);
    hashes += h;
  }

  player.hashManager.storeHashes(hashes);

  return hashes;
}

export function updateHashManagerCapacity(player: IPlayer): void {
  if (!(player.hashManager instanceof HashManager)) {
    console.error(`Player does not have a HashManager`);
    return;
  }

  const nodes = player.hacknetNodes;
  if (nodes.length === 0) {
    player.hashManager.updateCapacity(0);
    return;
  }

  let total = 0;
  for (let i = 0; i < nodes.length; ++i) {
    if (typeof nodes[i] !== "string") {
      player.hashManager.updateCapacity(0);
      return;
    }
    const ip = nodes[i];
    if (ip instanceof HacknetNode) throw new Error(`player nodes should be string but isn't`);
    const h = GetServer(ip);
    if (!(h instanceof HacknetServer)) {
      player.hashManager.updateCapacity(0);
      return;
    }

    total += h.hashCapacity;
  }

  player.hashManager.updateCapacity(total);
}

export function purchaseHashUpgrade(player: IPlayer, upgName: string, upgTarget: string): boolean {
  if (!(player.hashManager instanceof HashManager)) {
    console.error(`Player does not have a HashManager`);
    return false;
  }

  // HashManager handles the transaction. This just needs to actually implement
  // the effects of the upgrade
  if (player.hashManager.upgrade(upgName)) {
    const upg = HashUpgrades[upgName];

    switch (upgName) {
      case "Sell for Money": {
        player.gainMoney(upg.value);
        player.recordMoneySource(upg.value, "hacknetnode");
        break;
      }
      case "Sell for Corporation Funds": {
        const corp = player.corporation;
        if (corp === null) {
          player.hashManager.refundUpgrade(upgName);
          return false;
        }
        corp.funds = corp.funds.plus(upg.value);
        break;
      }
      case "Reduce Minimum Security": {
        try {
          const target = GetServer(upgTarget);
          if (target == null) {
            console.error(`Invalid target specified in purchaseHashUpgrade(): ${upgTarget}`);
            return false;
          }
          if (!(target instanceof Server)) throw new Error(`'${upgTarget}' is not a normal server.`);

          target.changeMinimumSecurity(upg.value, true);
        } catch (e) {
          player.hashManager.refundUpgrade(upgName);
          return false;
        }
        break;
      }
      case "Increase Maximum Money": {
        try {
          const target = GetServer(upgTarget);
          if (target == null) {
            console.error(`Invalid target specified in purchaseHashUpgrade(): ${upgTarget}`);
            return false;
          }
          if (!(target instanceof Server)) throw new Error(`'${upgTarget}' is not a normal server.`);

          const old = target.moneyMax;
          target.changeMaximumMoney(upg.value);
        } catch (e) {
          player.hashManager.refundUpgrade(upgName);
          return false;
        }
        break;
      }
      case "Improve Studying": {
        // Multiplier handled by HashManager
        break;
      }
      case "Improve Gym Training": {
        // Multiplier handled by HashManager
        break;
      }
      case "Exchange for Corporation Research": {
        // This will throw if player doesn't have a corporation
        const corp = player.corporation;
        if (corp === null) {
          player.hashManager.refundUpgrade(upgName);
          return false;
        }
        for (const division of corp.divisions) {
          division.sciResearch.qty += upg.value;
        }
        break;
      }
      case "Exchange for Bladeburner Rank": {
        // This will throw if player isnt in Bladeburner
        const bladeburner = player.bladeburner;
        if (bladeburner === null) {
          player.hashManager.refundUpgrade(upgName);
          return false;
        }
        bladeburner.changeRank(player, upg.value);
        break;
      }
      case "Exchange for Bladeburner SP": {
        // This will throw if player isnt in Bladeburner
        const bladeburner = player.bladeburner;
        if (bladeburner === null) {
          player.hashManager.refundUpgrade(upgName);
          return false;
        }

        bladeburner.skillPoints += upg.value;
        break;
      }
      case "Generate Coding Contract": {
        generateRandomContract();
        break;
      }
      default:
        console.warn(`Unrecognized upgrade name ${upgName}. Upgrade has no effect`);
        player.hashManager.refundUpgrade(upgName);
        return false;
    }

    return true;
  }

  return false;
}
