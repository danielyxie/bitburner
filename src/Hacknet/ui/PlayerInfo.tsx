/**
 * React Component for displaying Player info and stats on the Hacknet Node UI.
 * This includes:
 * - Player's money
 * - Player's production from Hacknet Nodes
 */
import React from "react";

import { hasHacknetServers } from "../HacknetHelpers";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { HashRate } from "../../ui/React/HashRate";
import { Hashes } from "../../ui/React/Hashes";

interface IProps {
  totalProduction: number;
  player: IPlayer;
}

export function PlayerInfo(props: IProps): React.ReactElement {
  const hasServers = hasHacknetServers(props.player);

  let prod;
  if (hasServers) {
    prod = HashRate(props.totalProduction);
  } else {
    prod = MoneyRate(props.totalProduction);
  }

  return (
    <p id={"hacknet-nodes-money"}>
      <span>Money: </span>
      <Money money={props.player.money.toNumber()} />
      <br />

      {hasServers && (
        <>
          <span>
            Hashes: {Hashes(props.player.hashManager.hashes)} / {Hashes(props.player.hashManager.capacity)}
          </span>
          <br />
        </>
      )}

      <span>Total Hacknet {hasServers ? "Server" : "Node"} Production: </span>
      {prod}
    </p>
  );
}
