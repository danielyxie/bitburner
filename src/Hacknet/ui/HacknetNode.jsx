/**
 * React Component for the Hacknet Node UI.
 * This Component displays the panel for a single Hacknet Node
 */
import React from "react";

import { HacknetNodeConstants } from "../data/Constants";
import {
    getMaxNumberLevelUpgrades,
    getMaxNumberRamUpgrades,
    getMaxNumberCoreUpgrades,
    purchaseLevelUpgrade,
    purchaseRamUpgrade,
    purchaseCoreUpgrade,
} from "../HacknetHelpers";

import { Player } from "../../Player";

import { numeralWrapper } from "../../ui/numeralFormat";

export class HacknetNode extends React.Component {
    render() {
        const node = this.props.node;
        const purchaseMult = this.props.purchaseMultiplier;
        const recalculate = this.props.recalculate;

        // Upgrade Level Button
        let upgradeLevelText, upgradeLevelClass;
        if (node.level >= HacknetNodeConstants.MaxLevel) {
            upgradeLevelText = "MAX LEVEL";
            upgradeLevelClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberLevelUpgrades(node, HacknetNodeConstants.MaxLevel);
            } else {
                const levelsToMax = HacknetNodeConstants.MaxLevel - node.level;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeLevelCost = node.calculateLevelUpgradeCost(multiplier, Player.hacknet_node_level_cost_mult);
            upgradeLevelText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeLevelCost)}`;
            if (Player.money.lt(upgradeLevelCost)) {
                upgradeLevelClass = "std-button-disabled";
            } else {
                upgradeLevelClass = "std-button";
            }
        }
        const upgradeLevelOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberLevelUpgrades(node, HacknetNodeConstants.MaxLevel);
            }
            purchaseLevelUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        let upgradeRamText, upgradeRamClass;
        if (node.ram >= HacknetNodeConstants.MaxRam) {
            upgradeRamText = "MAX RAM";
            upgradeRamClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberRamUpgrades(node, HacknetNodeConstants.MaxRam);
            } else {
                const levelsToMax = Math.round(Math.log2(HacknetNodeConstants.MaxRam / node.ram));
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeRamCost = node.calculateRamUpgradeCost(multiplier, Player.hacknet_node_ram_cost_mult);
            upgradeRamText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeRamCost)}`;
            if (Player.money.lt(upgradeRamCost)) {
                upgradeRamClass = "std-button-disabled";
            } else {
                upgradeRamClass = "std-button";
            }
        }
        const upgradeRamOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberRamUpgrades(node, HacknetNodeConstants.MaxRam);
            }
            purchaseRamUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        let upgradeCoresText, upgradeCoresClass;
        if (node.cores >= HacknetNodeConstants.MaxCores) {
            upgradeCoresText = "MAX CORES";
            upgradeCoresClass = "std-button-disabled";
        } else {
            let multiplier = 0;
            if (purchaseMult === "MAX") {
                multiplier = getMaxNumberCoreUpgrades(node, HacknetNodeConstants.MaxCores);
            } else {
                const levelsToMax = HacknetNodeConstants.MaxCores - node.cores;
                multiplier = Math.min(levelsToMax, purchaseMult);
            }

            const upgradeCoreCost = node.calculateCoreUpgradeCost(multiplier, Player.hacknet_node_core_cost_mult);
            upgradeCoresText = `Upgrade x${multiplier} - ${numeralWrapper.formatMoney(upgradeCoreCost)}`;
            if (Player.money.lt(upgradeCoreCost)) {
                upgradeCoresClass = "std-button-disabled";
            } else {
                upgradeCoresClass = "std-button";
            }
        }
        const upgradeCoresOnClick = () => {
            let numUpgrades = purchaseMult;
            if (purchaseMult === "MAX") {
                numUpgrades = getMaxNumberCoreUpgrades(node, HacknetNodeConstants.MaxCores);
            }
            purchaseCoreUpgrade(node, numUpgrades);
            recalculate();
            return false;
        }

        return (
            <li className={"hacknet-node"}>
                <div className={"hacknet-node-container"}>
                    <div className={"row"}>
                        <p>Node name:</p>
                        <span className={"text"}>{node.name}</span>
                    </div>
                    <div className={"row"}>
                        <p>Production:</p>
                        <span className={"text money-gold"}>
                            {numeralWrapper.formatMoney(node.totalMoneyGenerated)} ({numeralWrapper.formatMoney(node.moneyGainRatePerSecond)} / sec)
                        </span>
                    </div>
                    <div className={"row"}>
                        <p>Level:</p><span className={"text upgradable-info"}>{node.level}</span>
                        <button className={upgradeLevelClass} onClick={upgradeLevelOnClick}>
                            {upgradeLevelText}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>RAM:</p><span className={"text upgradable-info"}>{node.ram}GB</span>
                        <button className={upgradeRamClass} onClick={upgradeRamOnClick}>
                            {upgradeRamText}
                        </button>
                    </div>
                    <div className={"row"}>
                        <p>Cores:</p><span className={"text upgradable-info"}>{node.cores}</span>
                        <button className={upgradeCoresClass} onClick={upgradeCoresOnClick}>
                            {upgradeCoresText}
                        </button>
                    </div>
                </div>
            </li>
        )
    }
}
