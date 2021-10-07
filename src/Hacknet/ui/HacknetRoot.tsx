/**
 * Root React Component for the Hacknet Node UI
 */
import React, { useState, useEffect } from "react";

import { GeneralInfo } from "./GeneralInfo";
import { HacknetNodeElem } from "./HacknetNodeElem";
import { HacknetServerElem } from "./HacknetServerElem";
import { HacknetNode } from "../HacknetNode";
import { HacknetServer } from "../HacknetServer";
import { HashUpgradeModal } from "./HashUpgradeModal";
import { MultiplierButtons } from "./MultiplierButtons";
import { PlayerInfo } from "./PlayerInfo";
import { PurchaseButton } from "./PurchaseButton";
import { PurchaseMultipliers } from "../data/Constants";

import {
  getCostOfNextHacknetNode,
  getCostOfNextHacknetServer,
  hasHacknetServers,
  purchaseHacknet,
} from "../HacknetHelpers";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { getServer } from "../../Server/ServerHelpers";
import { Server } from "../../Server/Server";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

interface IProps {
  player: IPlayer;
}

export function HacknetRoot(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }
  const [purchaseMultiplier, setPurchaseMultiplier] = useState<number | "MAX">(PurchaseMultipliers.x1);

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  let totalProduction = 0;
  for (let i = 0; i < props.player.hacknetNodes.length; ++i) {
    const node = props.player.hacknetNodes[i];
    if (hasHacknetServers(props.player)) {
      if (node instanceof HacknetNode) throw new Error("node was hacknet node"); // should never happen
      const hserver = getServer(node);
      if (!(hserver instanceof HacknetServer)) throw new Error("node was not hacknet server"); // should never happen
      if (hserver) {
        totalProduction += hserver.hashRate;
      } else {
        console.warn(`Could not find Hacknet Server object in AllServers map (i=${i})`);
      }
    } else {
      if (typeof node === "string") throw new Error("node was ip string"); // should never happen
      totalProduction += node.moneyGainRatePerSecond;
    }
  }

  function handlePurchaseButtonClick(): void {
    purchaseHacknet(props.player);
    rerender();
  }

  // Cost to purchase a new Hacknet Node
  let purchaseCost;
  if (hasHacknetServers(props.player)) {
    purchaseCost = getCostOfNextHacknetServer(props.player);
  } else {
    purchaseCost = getCostOfNextHacknetNode(props.player);
  }

  // onClick event handlers for purchase multiplier buttons
  const purchaseMultiplierOnClicks = [
    () => setPurchaseMultiplier(PurchaseMultipliers.x1),
    () => setPurchaseMultiplier(PurchaseMultipliers.x5),
    () => setPurchaseMultiplier(PurchaseMultipliers.x10),
    () => setPurchaseMultiplier(PurchaseMultipliers.MAX),
  ];

  // HacknetNode components
  const nodes = props.player.hacknetNodes.map((node: string | HacknetNode) => {
    if (hasHacknetServers(props.player)) {
      if (node instanceof HacknetNode) throw new Error("node was hacknet node"); // should never happen
      const hserver = getServer(node);
      if (hserver == null) {
        throw new Error(`Could not find Hacknet Server object in AllServers map for IP: ${node}`);
      }
      if (!(hserver instanceof HacknetServer)) throw new Error("node was not hacknet server"); // should never happen
      return (
        <HacknetServerElem
          player={props.player}
          key={hserver.hostname}
          node={hserver}
          purchaseMultiplier={purchaseMultiplier}
          rerender={rerender}
        />
      );
    } else {
      if (typeof node === "string") throw new Error("node was ip string"); // should never happen
      return (
        <HacknetNodeElem
          player={props.player}
          key={node.name}
          node={node}
          purchaseMultiplier={purchaseMultiplier}
          rerender={rerender}
        />
      );
    }
  });

  return (
    <>
      <Typography variant="h4">Hacknet {hasHacknetServers(props.player) ? "Servers" : "Nodes"}</Typography>
      <GeneralInfo hasHacknetServers={hasHacknetServers(props.player)} />

      <PurchaseButton cost={purchaseCost} multiplier={purchaseMultiplier} onClick={handlePurchaseButtonClick} />

      <br />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <PlayerInfo totalProduction={totalProduction} player={props.player} />
        </Grid>
        <Grid item xs={6}>
          <MultiplierButtons onClicks={purchaseMultiplierOnClicks} purchaseMultiplier={purchaseMultiplier} />
        </Grid>
      </Grid>

      {hasHacknetServers(props.player) && <Button onClick={() => setOpen(true)}>Spend Hashes on Upgrades</Button>}

      <Grid container>{nodes}</Grid>
      <HashUpgradeModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
