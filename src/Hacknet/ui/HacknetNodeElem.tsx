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

import { IPlayer } from "../../PersonObjects/IPlayer";
import { HacknetNode } from "../HacknetNode";

import { Money } from "../../ui/React/Money";
import { MoneyRate } from "../../ui/React/MoneyRate";

interface IProps {
  node: HacknetNode;
  purchaseMultiplier: number | string;
  rerender: () => void;
  player: IPlayer;
}

export function HacknetNodeElem(props: IProps): React.ReactElement {
  const node = props.node;
  const purchaseMult = props.purchaseMultiplier;
  const rerender = props.rerender;

  // Upgrade Level Button
  let upgradeLevelContent, upgradeLevelClass;
  if (node.level >= HacknetNodeConstants.MaxLevel) {
    upgradeLevelContent = <>MAX LEVEL</>;
    upgradeLevelClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberLevelUpgrades(props.player, node, HacknetNodeConstants.MaxLevel);
    } else {
      const levelsToMax = HacknetNodeConstants.MaxLevel - node.level;
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
      numUpgrades = getMaxNumberLevelUpgrades(props.player, node, HacknetNodeConstants.MaxLevel);
    }
    purchaseLevelUpgrade(props.player, node, numUpgrades as number);
    rerender();
  }

  let upgradeRamContent, upgradeRamClass;
  if (node.ram >= HacknetNodeConstants.MaxRam) {
    upgradeRamContent = <>MAX RAM</>;
    upgradeRamClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberRamUpgrades(props.player, node, HacknetNodeConstants.MaxRam);
    } else {
      const levelsToMax = Math.round(Math.log2(HacknetNodeConstants.MaxRam / node.ram));
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
      numUpgrades = getMaxNumberRamUpgrades(props.player, node, HacknetNodeConstants.MaxRam);
    }
    purchaseRamUpgrade(props.player, node, numUpgrades as number);
    rerender();
  }

  let upgradeCoresContent, upgradeCoresClass;
  if (node.cores >= HacknetNodeConstants.MaxCores) {
    upgradeCoresContent = <>MAX CORES</>;
    upgradeCoresClass = "std-button-disabled";
  } else {
    let multiplier = 0;
    if (purchaseMult === "MAX") {
      multiplier = getMaxNumberCoreUpgrades(props.player, node, HacknetNodeConstants.MaxCores);
    } else {
      const levelsToMax = HacknetNodeConstants.MaxCores - node.cores;
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
      numUpgrades = getMaxNumberCoreUpgrades(props.player, node, HacknetNodeConstants.MaxCores);
    }
    purchaseCoreUpgrade(props.player, node, numUpgrades as number);
    rerender();
  }

  return (
    <li className={"hacknet-node"}>
      <div className={"hacknet-node-container"}>
        <div className={"row"}>
          <h1 style={{ fontSize: "1em" }}>{node.name}</h1>
        </div>
        <div className={"row"}>
          <p>Production:</p>
          <span className={"text money-gold"}>
            <Money money={node.totalMoneyGenerated} player={props.player} /> ({MoneyRate(node.moneyGainRatePerSecond)})
          </span>
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
          <span className={"text upgradable-info"}>{node.ram}GB</span>
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
      </div>
    </li>
  );
}
