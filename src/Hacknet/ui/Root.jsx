/**
 * Root React Component for the Hacknet Node UI
 */
import React from "react";

import { GeneralInfo } from "./GeneralInfo";
import { HacknetNode } from "./HacknetNode";
import { HacknetServer } from "./HacknetServer";
import { HashUpgradePopup } from "./HashUpgradePopup";
import { MultiplierButtons } from "./MultiplierButtons";
import { PlayerInfo } from "./PlayerInfo";
import { PurchaseButton } from "./PurchaseButton";

import { getCostOfNextHacknetNode,
         getCostOfNextHacknetServer,
         hasHacknetServers,
         purchaseHacknet } from "../HacknetHelpers";

import { Player } from "../../Player";
import { AllServers } from "../../Server/AllServers";

import { createPopup } from "../../ui/React/createPopup";

export const PurchaseMultipliers = Object.freeze({
    "x1": 1,
    "x5": 5,
    "x10": 10,
    "MAX": "MAX",
});

export class HacknetRoot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            purchaseMultiplier: PurchaseMultipliers.x1,
            totalProduction: 0, // Total production ($ / s) of Hacknet Nodes
        }

        this.createHashUpgradesPopup = this.createHashUpgradesPopup.bind(this);
        this.handlePurchaseButtonClick = this.handlePurchaseButtonClick.bind(this);
        this.recalculateTotalProduction = this.recalculateTotalProduction.bind(this);
    }

    componentDidMount() {
        this.recalculateTotalProduction();
    }

    createHashUpgradesPopup() {
        const id = "hacknet-server-hash-upgrades-popup";
        createPopup(id, HashUpgradePopup, { popupId: id, rerender: this.createHashUpgradesPopup });
    }

    handlePurchaseButtonClick() {
        if (purchaseHacknet() >= 0) {
            this.recalculateTotalProduction();
        }
    }

    recalculateTotalProduction() {
        let total = 0;
        for (let i = 0; i < Player.hacknetNodes.length; ++i) {
            if (hasHacknetServers()) {
                const hserver = AllServers[Player.hacknetNodes[i]];
                if (hserver) {
                    total += hserver.hashRate;
                } else {
                    console.warn(`Could not find Hacknet Server object in AllServers map (i=${i})`)
                }
            } else {
                total += Player.hacknetNodes[i].moneyGainRatePerSecond;
            }
        }

        this.setState({
            totalProduction: total,
        });
    }

    setPurchaseMultiplier(mult) {
        this.setState({
            purchaseMultiplier: mult,
        });
    }

    render() {
        // Cost to purchase a new Hacknet Node
        let purchaseCost;
        if (hasHacknetServers()) {
            purchaseCost = getCostOfNextHacknetServer();
        } else {
            purchaseCost = getCostOfNextHacknetNode();
        }

        // onClick event handlers for purchase multiplier buttons
        const purchaseMultiplierOnClicks = [
            this.setPurchaseMultiplier.bind(this, PurchaseMultipliers.x1),
            this.setPurchaseMultiplier.bind(this, PurchaseMultipliers.x5),
            this.setPurchaseMultiplier.bind(this, PurchaseMultipliers.x10),
            this.setPurchaseMultiplier.bind(this, PurchaseMultipliers.MAX),
        ];

        // HacknetNode components
        const nodes = Player.hacknetNodes.map((node) => {
            if (hasHacknetServers()) {
                const hserver = AllServers[node];
                if (hserver == null) {
                    throw new Error(`Could not find Hacknet Server object in AllServers map for IP: ${node}`);
                }
                return (
                    <HacknetServer
                        key={hserver.hostname}
                        node={hserver}
                        purchaseMultiplier={this.state.purchaseMultiplier}
                        recalculate={this.recalculateTotalProduction}
                    />
                )
            } else {
                return (
                    <HacknetNode
                        key={node.name}
                        node={node}
                        purchaseMultiplier={this.state.purchaseMultiplier}
                        recalculate={this.recalculateTotalProduction}
                    />
                )
            }
        });

        return (
            <div>
                <h1>Hacknet Nodes</h1>
                <GeneralInfo />

                <PurchaseButton cost={purchaseCost} multiplier={this.state.purchaseMultiplier} onClick={this.handlePurchaseButtonClick} />

                <br />
                <div id={"hacknet-nodes-money-multipliers-div"}>
                    <PlayerInfo totalProduction={this.state.totalProduction} />
                    <MultiplierButtons onClicks={purchaseMultiplierOnClicks} purchaseMultiplier={this.state.purchaseMultiplier} />
                </div>

                {
                    hasHacknetServers() &&
                    <button className={"std-button"} onClick={this.createHashUpgradesPopup} style={{display: "block"}}>
                        {"Spend Hashes on Upgrades"}
                    </button>
                }

                <ul id={"hacknet-nodes-list"}>{nodes}</ul>
            </div>
        )
    }
}
