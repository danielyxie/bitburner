/**
 * React Component for the Hacknet Node UI.
 * This Component displays the panel for a single Hacknet Node
 */
import React from "react";

import { HacknetServerConstants } from "../data/Constants";
import {
    getMaxNumberLevelUpgrades,
    getMaxNumberRamUpgrades,
    getMaxNumberCoreUpgrades,
    getMaxNumberCacheUpgrades,
    purchaseLevelUpgrade,
    purchaseRamUpgrade,
    purchaseCoreUpgrade,
    purchaseCacheUpgrade,
    updateHashManagerCapacity,
} from "../HacknetHelpers";

import { Player } from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";

import { Money } from "../../ui/React/Money";
import { Hashes } from "../../ui/React/Hashes";
import { HashRate } from "../../ui/React/HashRate";

export class HacknetServer extends React.Component {
    render() {
        const node = this.props.node;
        const purchaseMult = this.props.purchaseMultiplier;
        const recalculate = this.props.recalculate;

        // Upgrade Level Button
        let upgradeLevelContent, upgradeLevelClass;
        if (node.level >= HacknetServerConstants.MaxLevel) {
            upgradeLevelContent = <>MAX LEVEL</>;
            upgradeLevelClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberLevelUpgrades(node, HacknetServerConstants.MaxLevel);
            } else {
                const levelsToMax = HacknetServerConstants.MaxLevel - node.level;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeLevelCost = node.calculateLevelUpgradeCost(multiplier, Player.hacknet_node_level_cost_mult);
            upgradeLevelContent = <>Upgrade x{multiplier} - {Money(upgradeLevelCost)}</>;
            if (Player.money.lt(upgradeLevelCost)) {
                upgradeLevelClass = "std-button-disabled";
            } else {
                upgradeLevelClass = "std-button";
            }
        }
        const upgradeLevelOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberLevelUpgrades(node, HacknetServerConstants.MaxLevel);
            }
            purchaseLevelUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        // Upgrade RAM Button
        let upgradeRamContent, upgradeRamClass;
        if (node.maxRam >= HacknetServerConstants.MaxRam) {
            upgradeRamContent = <>MAX RAM</>;
            upgradeRamClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberRamUpgrades(node, HacknetServerConstants.MaxRam);
            } else {
                const levelsToMax = Math.round(Math.log2(HacknetServerConstants.MaxRam / node.maxRam));
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeRamCost = node.calculateRamUpgradeCost(multiplier, Player.hacknet_node_ram_cost_mult);
            upgradeRamContent = <>Upgrade x{multiplier} - {Money(upgradeRamCost)}</>;
            if (Player.money.lt(upgradeRamCost)) {
                upgradeRamClass = "std-button-disabled";
            } else {
                upgradeRamClass = "std-button";
            }
        }
        const upgradeRamOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberRamUpgrades(node, HacknetServerConstants.MaxRam);
            }
            purchaseRamUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        // Upgrade Cores Button
        let upgradeCoresContent, upgradeCoresClass;
        if (node.cores >= HacknetServerConstants.MaxCores) {
            upgradeCoresContent = <>MAX CORES</>;
            upgradeCoresClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberCoreUpgrades(node, HacknetServerConstants.MaxCores);
            } else {
                const levelsToMax = HacknetServerConstants.MaxCores - node.cores;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeCoreCost = node.calculateCoreUpgradeCost(multiplier, Player.hacknet_node_core_cost_mult);
            upgradeCoresContent = <>Upgrade x{multiplier} - {Money(upgradeCoreCost)}</>;
            if (Player.money.lt(upgradeCoreCost)) {
                upgradeCoresClass = "std-button-disabled";
            } else {
                upgradeCoresClass = "std-button";
            }
        }
        const upgradeCoresOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberCoreUpgrades(node, HacknetServerConstants.MaxCores);
            }
            purchaseCoreUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        // Upgrade Cache button
        let upgradeCacheContent, upgradeCacheClass;
        if (node.cache >= HacknetServerConstants.MaxCache) {
            upgradeCacheContent = <>MAX CACHE</>;
            upgradeCacheClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberCacheUpgrades(node, HacknetServerConstants.MaxCache);
            } else {
                const levelsToMax = HacknetServerConstants.MaxCache - node.cache;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeCacheCost = node.calculateCacheUpgradeCost(multiplier);
            upgradeCacheContent = <>Upgrade x{multiplier} - {Money(upgradeCacheCost)}</>;
            if (Player.money.lt(upgradeCacheCost)) {
                upgradeCacheClass = "std-button-disabled";
            } else {
                upgradeCacheClass = "std-button";
            }
        }
        const upgradeCacheOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberCacheUpgrades(node, HacknetServerConstants.MaxCache);
            }
            purchaseCacheUpgrade(node, numUpgrades);
            recalculate();
            updateHashManagerCapacity();
            return false;
        }

        return (
            <li className={"hacknet-node"}>
                <div className={"hacknet-node-container"}>
                    <div className={"row"}>
                        <h1 style={{"fontSize":"1em"}}>{node.hostname}</h1>
                    </div>
                    <div className={"row"}>
                        <p>Production:</p>
                        <span className={"text money-gold"}>
                            {Hashes(node.totalHashesGenerated)} ({HashRate(node.hashRate)})
                        </span>
                    </div>
                    <div className={"row"}>
                        <p>Hash Capacity:</p>
                        <span className={"text"}>{Hashes(node.hashCapacity)}</span>
                    </div>
                    <div className={"row"}>
                        <p>Level:</p><span className={"text upgradable-info"}>{node.level}</span>
                        <button className={upgradeLevelClass} onClick={upgradeLevelOnClick}>
                            {upgradeLevelContent}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>RAM:</p><span className={"text upgradable-info"}>{node.maxRam}GB</span>
                        <button className={upgradeRamClass} onClick={upgradeRamOnClick}>
                            {upgradeRamContent}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>Cores:</p><span className={"text upgradable-info"}>{node.cores}</span>
                        <button className={upgradeCoresClass} onClick={upgradeCoresOnClick}>
                            {upgradeCoresContent}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>Cache Level:</p><span className={"text upgradable-info"}>{node.cache}</span>
                        <button className={upgradeCacheClass} onClick={upgradeCacheOnClick}>
                            {upgradeCacheContent}
                        </button>
                    </div>
                </div>
            </li>
        )
    }
}
