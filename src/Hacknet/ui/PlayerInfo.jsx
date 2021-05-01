/**
 * React Component for displaying Player info and stats on the Hacknet Node UI.
 * This includes:
 * - Player's money
 * - Player's production from Hacknet Nodes
 */
import React from "react";

import { hasHacknetServers } from "../HacknetHelpers";
import { Player } from "../../Player";
import { Money } from "../../ui/React/Money";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { HashRate } from "../../ui/React/HashRate";
import { Hashes } from "../../ui/React/Hashes";

export function PlayerInfo(props) {
    const hasServers = hasHacknetServers();

    let prod;
    if (hasServers) {
        prod = HashRate(props.totalProduction);
    } else {
        prod = MoneyRate(props.totalProduction);
    }

    return (
        <p id={"hacknet-nodes-money"}>
            <span>Money: </span>
            {Money(Player.money.toNumber())}<br />

            {
                hasServers &&
                <><span>Hashes: {Hashes(Player.hashManager.hashes)} / {Hashes(Player.hashManager.capacity)}</span><br /></>
            }

            <span>Total Hacknet Node Production: </span>
            {prod}
        </p>
    )
}
