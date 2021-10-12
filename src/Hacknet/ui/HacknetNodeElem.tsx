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

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { TableCell } from "../../ui/React/Table";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import { numeralWrapper } from "../../ui/numeralFormat";

interface IProps {
  node: HacknetNode;
  purchaseMultiplier: number | "MAX";
  rerender: () => void;
  player: IPlayer;
}

export function HacknetNodeElem(props: IProps): React.ReactElement {
  const node = props.node;
  const purchaseMult = props.purchaseMultiplier;
  const rerender = props.rerender;

  // Upgrade Level Button
  let upgradeLevelContent;
  if (node.level >= HacknetNodeConstants.MaxLevel) {
    upgradeLevelContent = <>MAX LEVEL</>;
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
        +{multiplier} -&nbsp;
        <Money money={upgradeLevelCost} player={props.player} />
      </>
    );
  }
  function upgradeLevelOnClick(): void {
    const numUpgrades =
      purchaseMult === "MAX"
        ? getMaxNumberLevelUpgrades(props.player, node, HacknetNodeConstants.MaxLevel)
        : purchaseMult;
    purchaseLevelUpgrade(props.player, node, numUpgrades);
    rerender();
  }

  let upgradeRamContent;
  if (node.ram >= HacknetNodeConstants.MaxRam) {
    upgradeRamContent = <>MAX RAM</>;
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
        +{multiplier} -&nbsp;
        <Money money={upgradeRamCost} player={props.player} />
      </>
    );
  }
  function upgradeRamOnClick(): void {
    const numUpgrades =
      purchaseMult === "MAX" ? getMaxNumberRamUpgrades(props.player, node, HacknetNodeConstants.MaxRam) : purchaseMult;
    purchaseRamUpgrade(props.player, node, numUpgrades);
    rerender();
  }

  let upgradeCoresContent;
  if (node.cores >= HacknetNodeConstants.MaxCores) {
    upgradeCoresContent = <>MAX CORES</>;
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
        +{multiplier} -&nbsp;
        <Money money={upgradeCoreCost} player={props.player} />
      </>
    );
  }
  function upgradeCoresOnClick(): void {
    const numUpgrades =
      purchaseMult === "MAX"
        ? getMaxNumberCoreUpgrades(props.player, node, HacknetNodeConstants.MaxCores)
        : purchaseMult;
    purchaseCoreUpgrade(props.player, node, numUpgrades);
    rerender();
  }

  return (
    <Grid item component={Paper} p={1}>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography>{node.name}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Production:</Typography>
            </TableCell>
            <TableCell colSpan={2}>
              <Typography>
                <Money money={node.totalMoneyGenerated} player={props.player} /> (
                <MoneyRate money={node.moneyGainRatePerSecond} />)
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Level:</Typography>
            </TableCell>
            <TableCell>
              <Typography>{node.level}</Typography>
            </TableCell>
            <TableCell>
              <Button onClick={upgradeLevelOnClick}>{upgradeLevelContent}</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>RAM:</Typography>
            </TableCell>
            <TableCell>
              <Typography>{numeralWrapper.formatRAM(node.ram)}</Typography>
            </TableCell>
            <TableCell>
              <Button onClick={upgradeRamOnClick}>{upgradeRamContent}</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography>Cores:</Typography>
            </TableCell>
            <TableCell>
              <Typography>{node.cores}</Typography>
            </TableCell>
            <TableCell>
              <Button onClick={upgradeCoresOnClick}>{upgradeCoresContent}</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Grid>
  );
}
