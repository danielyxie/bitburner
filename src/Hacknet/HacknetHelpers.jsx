import {
    HacknetNode,
    BaseCostForHacknetNode,
    HacknetNodePurchaseNextMult,
    HacknetNodeMaxLevel,
    HacknetNodeMaxRam,
    HacknetNodeMaxCores
} from "./HacknetNode";
import {
    HacknetServer,
    BaseCostForHacknetServer,
    HacknetServerPurchaseMult,
    HacknetServerMaxLevel,
    HacknetServerMaxRam,
    HacknetServerMaxCores,
    HacknetServerMaxCache,
    MaxNumberHacknetServers
} from "./HacknetServer";
import { HashManager } from "./HashManager";
import { HashUpgrades } from "./HashUpgrades";

import { generateRandomContract } from "../CodingContractGenerator";
import {
    iTutorialSteps,
    iTutorialNextStep,
    ITutorial
} from "../InteractiveTutorial";
import { Player } from "../Player";
import { AddToAllServers, AllServers } from "../Server/AllServers";
import { GetServerByHostname } from "../Server/ServerHelpers";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";
import { Page, routing } from "../ui/navigationTracking";

import { getElementById } from "../../utils/uiHelpers/getElementById";

import React from "react";
import ReactDOM from "react-dom";
import { HacknetRoot } from "./ui/Root";

let hacknetNodesDiv;
function hacknetNodesInit() {
    hacknetNodesDiv = document.getElementById("hacknet-nodes-container");
    document.removeEventListener("DOMContentLoaded", hacknetNodesInit);
}

document.addEventListener("DOMContentLoaded", hacknetNodesInit);

// Returns a boolean indicating whether the player has Hacknet Servers
// (the upgraded form of Hacknet Nodes)
export function hasHacknetServers() {
    return (Player.bitNodeN === 9 || SourceFileFlags[9] > 0);
}

export function purchaseHacknet() {
    /* INTERACTIVE TUTORIAL */
    if (ITutorial.isRunning) {
        if (ITutorial.currStep === iTutorialSteps.HacknetNodesIntroduction) {
            iTutorialNextStep();
        } else {
            return;
        }
    }
    /* END INTERACTIVE TUTORIAL */

    const numOwned = Player.hacknetNodes.length;
    if (hasHacknetServers()) {
        const cost = getCostOfNextHacknetServer();
        if (isNaN(cost)) {
            throw new Error(`Calculated cost of purchasing HacknetServer is NaN`)
        }

        if (!Player.canAfford(cost)) { return -1; }
        Player.loseMoney(cost);
        const server = Player.createHacknetServer();
        Player.hashManager.updateCapacity(Player.hacknetNodes);

        return numOwned;
    } else {
        const cost = getCostOfNextHacknetNode();
        if (isNaN(cost)) {
            throw new Error(`Calculated cost of purchasing HacknetNode is NaN`);
        }

        if (!Player.canAfford(cost)) { return -1; }

        // Auto generate a name for the Node
        const name = "hacknet-node-" + numOwned;
        const node = new HacknetNode(name, Player.hacknet_node_money_mult);

        Player.loseMoney(cost);
        Player.hacknetNodes.push(node);

        return numOwned;
    }
}

export function hasMaxNumberHacknetServers() {
    return hasHacknetServers() && Player.hacknetNodes.length >= MaxNumberHacknetServers;
}

export function getCostOfNextHacknetNode() {
    // Cost increases exponentially based on how many you own
    const numOwned = Player.hacknetNodes.length;
    const mult = HacknetNodePurchaseNextMult;

    return BaseCostForHacknetNode * Math.pow(mult, numOwned) * Player.hacknet_node_purchase_cost_mult;
}

export function getCostOfNextHacknetServer() {
    const numOwned = Player.hacknetNodes.length;
    const mult = HacknetServerPurchaseMult;

    if (numOwned > MaxNumberHacknetServers) { return Infinity; }

    return BaseCostForHacknetServer * Math.pow(mult, numOwned) * Player.hacknet_node_purchase_cost_mult;
}

//Calculate the maximum number of times the Player can afford to upgrade a Hacknet Node
export function getMaxNumberLevelUpgrades(nodeObj, maxLevel) {
    if (maxLevel == null) {
        throw new Error(`getMaxNumberLevelUpgrades() called without maxLevel arg`);
    }

    if (Player.money.lt(nodeObj.calculateLevelUpgradeCost(1, Player.hacknet_node_level_cost_mult))) {
        return 0;
    }

    let min = 1;
    let max = maxLevel - 1;
    let levelsToMax = maxLevel - nodeObj.level;
    if (Player.money.gt(nodeObj.calculateLevelUpgradeCost(levelsToMax, Player.hacknet_node_level_cost_mult))) {
        return levelsToMax;
    }

    while (min <= max) {
        var curr = (min + max) / 2 | 0;
        if (curr !== maxLevel &&
            Player.money.gt(nodeObj.calculateLevelUpgradeCost(curr, Player.hacknet_node_level_cost_mult)) &&
            Player.money.lt(nodeObj.calculateLevelUpgradeCost(curr + 1, Player.hacknet_node_level_cost_mult))) {
            return Math.min(levelsToMax, curr);
        } else if (Player.money.lt(nodeObj.calculateLevelUpgradeCost(curr, Player.hacknet_node_level_cost_mult))) {
            max = curr - 1;
        } else if (Player.money.gt(nodeObj.calculateLevelUpgradeCost(curr, Player.hacknet_node_level_cost_mult))) {
            min = curr + 1;
        } else {
            return Math.min(levelsToMax, curr);
        }
    }
    return 0;
}

export function getMaxNumberRamUpgrades(nodeObj, maxLevel) {
    if (maxLevel == null) {
        throw new Error(`getMaxNumberRamUpgrades() called without maxLevel arg`);
    }

    if (Player.money.lt(nodeObj.calculateRamUpgradeCost(1, Player.hacknet_node_ram_cost_mult))) {
        return 0;
    }

    let levelsToMax;
    if (nodeObj instanceof HacknetServer) {
        levelsToMax = Math.round(Math.log2(maxLevel / nodeObj.maxRam));
    } else {
        levelsToMax = Math.round(Math.log2(maxLevel / nodeObj.ram));
    }
    if (Player.money.gt(nodeObj.calculateRamUpgradeCost(levelsToMax, Player.hacknet_node_ram_cost_mult))) {
        return levelsToMax;
    }

    //We'll just loop until we find the max
    for (let i = levelsToMax-1; i >= 0; --i) {
        if (Player.money.gt(nodeObj.calculateRamUpgradeCost(i, Player.hacknet_node_ram_cost_mult))) {
            return i;
        }
    }
    return 0;
}

export function getMaxNumberCoreUpgrades(nodeObj, maxLevel) {
    if (maxLevel == null) {
        throw new Error(`getMaxNumberCoreUpgrades() called without maxLevel arg`);
    }

    if (Player.money.lt(nodeObj.calculateCoreUpgradeCost(1, Player.hacknet_node_core_cost_mult))) {
        return 0;
    }

    let min = 1;
    let max = maxLevel - 1;
    const levelsToMax = maxLevel - nodeObj.cores;
    if (Player.money.gt(nodeObj.calculateCoreUpgradeCost(levelsToMax, Player.hacknet_node_core_cost_mult))) {
        return levelsToMax;
    }

    //Use a binary search to find the max possible number of upgrades
    while (min <= max) {
        let curr = (min + max) / 2 | 0;
        if (curr != maxLevel &&
            Player.money.gt(nodeObj.calculateCoreUpgradeCost(curr, Player.hacknet_node_core_cost_mult)) &&
            Player.money.lt(nodeObj.calculateCoreUpgradeCost(curr + 1, Player.hacknet_node_core_cost_mult))) {
            return Math.min(levelsToMax, curr);
        } else if (Player.money.lt(nodeObj.calculateCoreUpgradeCost(curr, Player.hacknet_node_core_cost_mult))) {
            max = curr - 1;
        } else if (Player.money.gt(nodeObj.calculateCoreUpgradeCost(curr, Player.hacknet_node_core_cost_mult))) {
            min = curr + 1;
        } else {
            return Math.min(levelsToMax, curr);
        }
    }

    return 0;
}

export function getMaxNumberCacheUpgrades(nodeObj, maxLevel) {
    if (maxLevel == null) {
        throw new Error(`getMaxNumberCacheUpgrades() called without maxLevel arg`);
    }

    if (!Player.canAfford(nodeObj.calculateCacheUpgradeCost(1))) {
        return 0;
    }

    let min = 1;
    let max = maxLevel - 1;
    const levelsToMax = maxLevel - nodeObj.cache;
    if (Player.canAfford(nodeObj.calculateCacheUpgradeCost(levelsToMax))) {
        return levelsToMax;
    }

    // Use a binary search to find the max possible number of upgrades
    while (min <= max) {
        let curr = (min + max) / 2 | 0;
        if (curr != maxLevel &&
            Player.canAfford(nodeObj.calculateCacheUpgradeCost(curr)) &&
            !Player.canAfford(nodeObj.calculateCacheUpgradeCost(curr + 1))) {
            return Math.min(levelsToMax, curr);
        } else if (!Player.canAfford(nodeObj.calculateCacheUpgradeCost(curr))) {
            max = curr -1 ;
        } else if (Player.canAfford(nodeObj.calculateCacheUpgradeCost(curr))) {
            min = curr + 1;
        } else {
            return Math.min(levelsToMax, curr);
        }
    }

    return 0;
}

export function purchaseLevelUpgrade(node, levels=1) {
    const sanitizedLevels = Math.round(levels);
    const cost = node.calculateLevelUpgradeCost(sanitizedLevels, Player.hacknet_node_level_cost_mult);
    if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
        return false;
    }

    const isServer = (node instanceof HacknetServer);

    // If we're at max level, return false
    if (node.level >= (isServer ? HacknetServerMaxLevel : HacknetNodeMaxLevel)) {
        return false;
    }

    // If the number of specified upgrades would exceed the max level, calculate
    // the maximum number of upgrades and use that
    if (node.level + sanitizedLevels > (isServer ? HacknetServerMaxLevel : HacknetNodeMaxLevel)) {
        const diff = Math.max(0, (isServer ? HacknetServerMaxLevel : HacknetNodeMaxLevel) - node.level);
        return purchaseLevelUpgrade(node, diff);
    }

    if (!Player.canAfford(cost)) {
        return false;
    }

    Player.loseMoney(cost);
    node.upgradeLevel(sanitizedLevels, Player.hacknet_node_money_mult);

    return true;
}

export function purchaseRamUpgrade(node, levels=1) {
    const sanitizedLevels = Math.round(levels);
    const cost = node.calculateRamUpgradeCost(sanitizedLevels, Player.hacknet_node_ram_cost_mult);
    if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
        return false;
    }

    const isServer = (node instanceof HacknetServer);

    // Fail if we're already at max
    if (node.ram >= (isServer ? HacknetServerMaxRam : HacknetNodeMaxRam)) {
        return false;
    }

    // If the number of specified upgrades would exceed the max RAM, calculate the
    // max possible number of upgrades and use that
    if (isServer) {
        if (node.maxRam * Math.pow(2, sanitizedLevels) > HacknetServerMaxRam) {
            const diff = Math.max(0, Math.log2(Math.round(HacknetServerMaxRam / node.maxRam)));
            return purchaseRamUpgrade(node, diff);
        }
    } else {
        if (node.ram * Math.pow(2, sanitizedLevels) > HacknetNodeMaxRam) {
            const diff = Math.max(0, Math.log2(Math.round(HacknetNodeMaxRam / node.ram)));
            return purchaseRamUpgrade(node, diff);
        }
    }


    if (!Player.canAfford(cost)) {
        return false;
    }

    Player.loseMoney(cost);
    node.upgradeRam(sanitizedLevels, Player.hacknet_node_money_mult);

    return true;
}

export function purchaseCoreUpgrade(node, levels=1) {
    const sanitizedLevels = Math.round(levels);
    const cost = node.calculateCoreUpgradeCost(sanitizedLevels, Player.hacknet_node_core_cost_mult);
    if (isNaN(cost) || cost <= 0 || sanitizedLevels < 0) {
        return false;
    }

    const isServer = (node instanceof HacknetServer);

    // Fail if we're already at max
    if (node.cores >= (isServer ? HacknetServerMaxCores : HacknetNodeMaxCores)) {
        return false;
    }

    // If the specified number of upgrades would exceed the max Cores, calculate
    // the max possible number of upgrades and use that
    if (node.cores + sanitizedLevels > (isServer ? HacknetServerMaxCores : HacknetNodeMaxCores)) {
        const diff = Math.max(0, (isServer ? HacknetServerMaxCores : HacknetNodeMaxCores) - node.cores);
        return purchaseCoreUpgrade(node, diff);
    }

    if (!Player.canAfford(cost)) {
        return false;
    }

    Player.loseMoney(cost);
    node.upgradeCore(sanitizedLevels, Player.hacknet_node_money_mult);

    return true;
}

export function purchaseCacheUpgrade(node, levels=1) {
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
    if (node.cache + sanitizedLevels > HacknetServerMaxCache) {
        const diff = Math.max(0, HacknetServerMaxCache - node.cache);
        return purchaseCacheUpgrade(node, diff);
    }

    if (!Player.canAfford(cost)) {
        return false;
    }

    Player.loseMoney(cost);
    node.upgradeCache(sanitizedLevels);
}

// Create/Refresh Hacknet Nodes UI
export function renderHacknetNodesUI() {
    if (!routing.isOn(Page.HacknetNodes)) { return; }

    ReactDOM.render(<HacknetRoot />, hacknetNodesDiv);
}

export function clearHacknetNodesUI() {
    if (hacknetNodesDiv instanceof HTMLElement) {
        ReactDOM.unmountComponentAtNode(hacknetNodesDiv);
    }

    hacknetNodesDiv.style.display = "none";
}

export function processHacknetEarnings(numCycles) {
    // Determine if player has Hacknet Nodes or Hacknet Servers, then
    // call the appropriate function
    if (Player.hacknetNodes.length === 0) { return 0; }
    if (hasHacknetServers()) {
        return processAllHacknetServerEarnings(numCycles);
    } else if (Player.hacknetNodes[0] instanceof HacknetNode) {
        return processAllHacknetNodeEarnings(numCycles);
    } else {
        return 0;
    }
}

function processAllHacknetNodeEarnings(numCycles) {
    let total = 0;
    for (let i = 0; i < Player.hacknetNodes.length; ++i) {
        total += processSingleHacknetNodeEarnings(numCycles, Player.hacknetNodes[i]);
    }

    return total;
}

function processSingleHacknetNodeEarnings(numCycles, nodeObj) {
    const totalEarnings = nodeObj.process(numCycles);
    Player.gainMoney(totalEarnings);
    Player.recordMoneySource(totalEarnings, "hacknetnode");

    return totalEarnings;
}

function processAllHacknetServerEarnings(numCycles) {
    if (!(Player.hashManager instanceof HashManager)) {
        throw new Error(`Player does not have a HashManager (should be in 'hashManager' prop)`)
    }

    let hashes = 0;
    for (let i = 0; i < Player.hacknetNodes.length; ++i) {
        const hserver = AllServers[Player.hacknetNodes[i]]; // hacknetNodes array only contains the IP addresses
        hashes += hserver.process(numCycles);
    }

    Player.hashManager.storeHashes(hashes);

    return hashes;
}

export function updateHashManagerCapacity() {
    if (!(Player.hashManager instanceof HashManager)) {
        console.error(`Player does not have a HashManager`);
        return;
    }

    const nodes = Player.hacknetNodes;
    if (nodes.length === 0) {
        Player.hashManager.updateCapacity(0);
        return;
    }

    let total = 0;
    for (let i = 0; i < nodes.length; ++i) {
        if (typeof nodes[i] !== "string") {
            Player.hashManager.updateCapacity(0);
            return;
        }

        const h = AllServers[nodes[i]];
        if (!(h instanceof HacknetServer)) {
            Player.hashManager.updateCapacity(0);
            return;
        }

        total += h.hashCapacity;
    }

    Player.hashManager.updateCapacity(total);
}

export function purchaseHashUpgrade(upgName, upgTarget) {
    if (!(Player.hashManager instanceof HashManager)) {
        console.error(`Player does not have a HashManager`);
        return false;
    }

    // HashManager handles the transaction. This just needs to actually implement
    // the effects of the upgrade
    if (Player.hashManager.upgrade(upgName)) {
        const upg = HashUpgrades[upgName];

        switch (upgName) {
            case "Sell for Money": {
                Player.gainMoney(upg.value);
                Player.recordMoneySource(upg.value, "hacknetnode");
                break;
            }
            case "Sell for Corporation Funds": {
                // This will throw if player doesn't have a corporation
                try {
                    Player.corporation.funds = Player.corporation.funds.plus(upg.value);
                } catch(e) {
                    Player.hashManager.refundUpgrade(upgName);
                    return false;
                }
                break;
            }
            case "Reduce Minimum Security": {
                try {
                    const target = GetServerByHostname(upgTarget);
                    if (target == null) {
                        console.error(`Invalid target specified in purchaseHashUpgrade(): ${upgTarget}`);
                        return false;
                    }

                    target.changeMinimumSecurity(upg.value, true);
                } catch(e) {
                    Player.hashManager.refundUpgrade(upgName);
                    return false;
                }
                break;
            }
            case "Increase Maximum Money": {
                try {
                    const target = GetServerByHostname(upgTarget);
                    if (target == null) {
                        console.error(`Invalid target specified in purchaseHashUpgrade(): ${upgTarget}`);
                        return false;
                    }

                    target.changeMaximumMoney(upg.value, true);
                } catch(e) {
                    Player.hashManager.refundUpgrade(upgName);
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
                try {
                    for (const division of Player.corporation.divisions) {
                        division.sciResearch.qty += upg.value;
                    }
                } catch(e) {
                    Player.hashManager.refundUpgrade(upgName);
                    return false;
                }
                break;
            }
            case "Exchange for Bladeburner Rank": {
                // This will throw if player isnt in Bladeburner
                try {
                    Player.bladeburner.changeRank(upg.value);
                } catch(e) {
                    Player.hashManager.refundUpgrade(upgName);
                    return false;
                }
                break;
            }
            case "Exchange for Bladeburner SP": {
                // This will throw if player isn't in Bladeburner
                try {
                    // As long as we don't change `Bladeburner.totalSkillPoints`, this
                    // shouldn't affect anything else
                    Player.bladeburner.skillPoints += upg.value;
                } catch(e) {
                    Player.hashManager.refundUpgrade(upgName);
                    return false;
                }
                break;
            }
            case "Generate Coding Contract": {
                generateRandomContract();
                break;
            }
            default:
                console.warn(`Unrecognized upgrade name ${upgName}. Upgrade has no effect`)
                Player.hashManager.refundUpgrade(upgName);
                return false;
        }

        return true;
    }

    return false;
}
