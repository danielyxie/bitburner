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

import { IPlayer } from "../../PersonObjects/IPlayer";
import { HacknetServer } from "../HacknetServer";

import { Money } from "../../ui/React/Money";
import { Hashes } from "../../ui/React/Hashes";
import { HashRate } from "../../ui/React/HashRate";

interface IProps {
  node: HacknetServer;
  purchaseMultiplier: number | string;
  rerender: () => void;
  player: IPlayer;
}

export function HacknetServerElem(props: IProps): React.ReactElement {
  const node = props.node;
  const purchaseMult = props.purchaseMultiplier;
  const rerender = props.rerender;

  // Upgrade Level Button
  let upgradeLevelContent, upgradeLevelClass;
  if (node.level >= HacknetServerConstants.MaxLevel) {
    upgradeLevelContent = <>MAX LEVEL</>;
    upgradeLevelClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberLevelUpgrades(props.player, node, HacknetServerConstants.MaxLevel);
    } else {
      const levelsToMax = HacknetServerConstants.MaxLevel - node.level;
      multiplier = Math.min(levelsToMax, purchaseMult as number);
    }

    const upgradeLevelCost = node.calculateLevelUpgradeCost(multiplier, props.player.hacknet_node_level_cost_mult);
    upgradeLevelContent = (
      <>
        Upgrade x{multiplier} - <Money money={upgradeLevelCost} player={props.player} />
      </>
    );
    if (props.player.money.lt(upgradeLevelCost)) {
      upgradeLevelClass = "std-button-disabled";
    } else {
      upgradeLevelClass = "std-button";
    }
  }
  function upgradeLevelOnClick(): void {
    let numUpgrades = purchaseMult;
    if (purchaseMult === "MAX") {
      numUpgrades = getMaxNumberLevelUpgrades(props.player, node, HacknetServerConstants.MaxLevel);
    }
    purchaseLevelUpgrade(props.player, node, numUpgrades as number);
    rerender();
  }

  // Upgrade RAM Button
  let upgradeRamContent, upgradeRamClass;
  if (node.maxRam >= HacknetServerConstants.MaxRam) {
    upgradeRamContent = <>MAX RAM</>;
    upgradeRamClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberRamUpgrades(props.player, node, HacknetServerConstants.MaxRam);
    } else {
      const levelsToMax = Math.round(Math.log2(HacknetServerConstants.MaxRam / node.maxRam));
      multiplier = Math.min(levelsToMax, purchaseMult as number);
    }

    const upgradeRamCost = node.calculateRamUpgradeCost(multiplier, props.player.hacknet_node_ram_cost_mult);
    upgradeRamContent = (
      <>
        Upgrade x{multiplier} - <Money money={upgradeRamCost} player={props.player} />
      </>
    );
    if (props.player.money.lt(upgradeRamCost)) {
      upgradeRamClass = "std-button-disabled";
    } else {
      upgradeRamClass = "std-button";
    }
  }
  function upgradeRamOnClick(): void {
    let numUpgrades = purchaseMult;
    if (purchaseMult === "MAX") {
      numUpgrades = getMaxNumberRamUpgrades(props.player, node, HacknetServerConstants.MaxRam);
    }
    purchaseRamUpgrade(props.player, node, numUpgrades as number);
    rerender();
  }

  // Upgrade Cores Button
  let upgradeCoresContent, upgradeCoresClass;
  if (node.cores >= HacknetServerConstants.MaxCores) {
    upgradeCoresContent = <>MAX CORES</>;
    upgradeCoresClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberCoreUpgrades(props.player, node, HacknetServerConstants.MaxCores);
    } else {
      const levelsToMax = HacknetServerConstants.MaxCores - node.cores;
      multiplier = Math.min(levelsToMax, purchaseMult as number);
    }

    const upgradeCoreCost = node.calculateCoreUpgradeCost(multiplier, props.player.hacknet_node_core_cost_mult);
    upgradeCoresContent = (
      <>
        Upgrade x{multiplier} - <Money money={upgradeCoreCost} player={props.player} />
      </>
    );
    if (props.player.money.lt(upgradeCoreCost)) {
      upgradeCoresClass = "std-button-disabled";
    } else {
      upgradeCoresClass = "std-button";
    }
  }
  function upgradeCoresOnClick(): void {
    let numUpgrades = purchaseMult;
    if (purchaseMult === "MAX") {
      numUpgrades = getMaxNumberCoreUpgrades(props.player, node, HacknetServerConstants.MaxCores);
    }
    purchaseCoreUpgrade(props.player, node, numUpgrades as number);
    rerender();
  }

  // Upgrade Cache button
  let upgradeCacheContent, upgradeCacheClass;
  if (node.cache >= HacknetServerConstants.MaxCache) {
    upgradeCacheContent = <>MAX CACHE</>;
    upgradeCacheClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberCacheUpgrades(props.player, node, HacknetServerConstants.MaxCache);
    } else {
      const levelsToMax = HacknetServerConstants.MaxCache - node.cache;
      multiplier = Math.min(levelsToMax, purchaseMult as number);
    }

    const upgradeCacheCost = node.calculateCacheUpgradeCost(multiplier);
    upgradeCacheContent = (
      <>
        Upgrade x{multiplier} - <Money money={upgradeCacheCost} player={props.player} />
      </>
    );
    if (props.player.money.lt(upgradeCacheCost)) {
      upgradeCacheClass = "std-button-disabled";
    } else {
      upgradeCacheClass = "std-button";
    }
  }
  function upgradeCacheOnClick(): void {
    let numUpgrades = purchaseMult;
    if (purchaseMult === "MAX") {
      numUpgrades = getMaxNumberCacheUpgrades(props.player, node, HacknetServerConstants.MaxCache);
    }
    purchaseCacheUpgrade(props.player, node, numUpgrades as number);
    rerender();
    updateHashManagerCapacity(props.player);
  }

  return (
    <li className={"hacknet-node"}>
      <div className={"hacknet-node-container"}>
        <div className={"row"}>
          <h1 style={{ fontSize: "1em" }}>{node.hostname}</h1>
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
          <p>Level:</p>
          <span className={"text upgradable-info"}>{node.level}</span>
          <button className={upgradeLevelClass} onClick={upgradeLevelOnClick}>
            {upgradeLevelContent}
          </button>
        </div>
        <div className={"row"}>
          <p>RAM:</p>
          <span className={"text upgradable-info"}>{node.maxRam}GB</span>
          <button className={upgradeRamClass} onClick={upgradeRamOnClick}>
            {upgradeRamContent}
          </button>
        </div>
        <div className={"row"}>
          <p>Cores:</p>
          <span className={"text upgradable-info"}>{node.cores}</span>
          <button className={upgradeCoresClass} onClick={upgradeCoresOnClick}>
            {upgradeCoresContent}
          </button>
        </div>
        <div className={"row"}>
          <p>Cache Level:</p>
          <span className={"text upgradable-info"}>{node.cache}</span>
          <button className={upgradeCacheClass} onClick={upgradeCacheOnClick}>
            {upgradeCacheContent}
          </button>
        </div>
      </div>
    </li>
  );
}
