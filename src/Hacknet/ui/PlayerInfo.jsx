/**
 * React Component for displaying Player info and stats on the Hacknet Node UI.
 * This includes:
 * - Player's money
 * - Player's production from Hacknet Nodes
 */
import React from "react";

import { hasHacknetServers } from "../HacknetHelpers";
import { Player } from "../../Player";
import { numeralWrapper } from "../../ui/numeralFormat";

export function PlayerInfo(props) {
    const hasServers = hasHacknetServers();

    let prod;
    if (hasServers) {
        prod = numeralWrapper.format(props.totalProduction, "0.000a") + " hashes / sec";
    } else {
        prod = numeralWrapper.formatMoney(props.totalProduction) + " / sec";
    }

    let hashInfo;
    if (hasServers) {
        hashInfo = numeralWrapper.format(Player.hashManager.hashes, "0.000a") + " / " +
                   numeralWrapper.format(Player.hashManager.capacity, "0.000a");
    }

    return (
        <p id={"hacknet-nodes-money"}>
            <span>Money:</span>
            <span className={"money-gold"}>{numeralWrapper.formatMoney(Player.money.toNumber())}</span><br />

            {
                hasServers &&
                <span>Hashes:</span>
            }
            {
                hasServers &&
                <span className={"money-gold"}>{hashInfo}</span>
            }
            {
                hasServers &&
                <br />
            }

            <span>Total Hacknet Node Production:</span>
            <span className={"money-gold"}>{prod}</span>
        </p>
    )
}
