/**
 * React component for the Stock Market UI. This component displays
 * general information about the stock market, buttons for the various purchases,
 * and a link to the documentation (Investopedia)
 */
import * as React from "react";

import {
    getStockMarket4SDataCost,
    getStockMarket4STixApiCost
} from "../StockMarketCosts";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { StdButton } from "../../ui/React/StdButton";
import { StdButtonPurchased } from "../../ui/React/StdButtonPurchased";

import { dialogBoxCreate } from "../../../utils/DialogBox";

type IProps = {
    initStockMarket: () => void;
    p: IPlayer;
    rerender: () => void;
}

const blockStyleMarkup = {
    display: "block",
}

export class InfoAndPurchases extends React.Component<IProps, any> {
    constructor(props: IProps) {
        super(props);

        this.handleClick4SMarketDataHelpTip = this.handleClick4SMarketDataHelpTip.bind(this);
        this.purchaseWseAccount = this.purchaseWseAccount.bind(this);
        this.purchaseTixApiAccess = this.purchaseTixApiAccess.bind(this);
        this.purchase4SMarketData = this.purchase4SMarketData.bind(this);
        this.purchase4SMarketDataTixApiAccess = this.purchase4SMarketDataTixApiAccess.bind(this);
    }

    handleClick4SMarketDataHelpTip() {
        dialogBoxCreate(
            "Access to the 4S Market Data feed will display two additional pieces " +
            "of information about each stock: Price Forecast & Volatility<br><br>" +
            "Price Forecast indicates the probability the stock has of increasing or " +
            "decreasing. A '+' forecast means the stock has a higher chance of increasing "  +
            "than decreasing, and a '-' means the opposite. The number of '+/-' symbols " +
            "is used to illustrate the magnitude of these probabilities. For example, " +
            "'+++' means that the stock has a significantly higher chance of increasing " +
            "than decreasing, while '+' means that the stock only has a slightly higher chance " +
            "of increasing than decreasing.<br><br>"  +
            "Volatility represents the maximum percentage by which a stock's price " +
            "can change every tick (a tick occurs every few seconds while the game " +
            "is running).<br><br>" +
            "A stock's price forecast can change over time. This is also affected by volatility. " +
            "The more volatile a stock is, the more its price forecast will change."
        );
    }

    purchaseWseAccount() {
        if (this.props.p.hasWseAccount) { return; }
        if (!this.props.p.canAfford(CONSTANTS.WSEAccountCost)) { return; }
        this.props.p.hasWseAccount = true;
        this.props.initStockMarket();
        this.props.p.loseMoney(CONSTANTS.WSEAccountCost);
        this.props.rerender();

        const worldHeader = document.getElementById("world-menu-header");
        if (worldHeader instanceof HTMLElement) {
            worldHeader.click(); worldHeader.click();
        }
    }

    purchaseTixApiAccess() {
        if (this.props.p.hasTixApiAccess) { return; }
        if (!this.props.p.canAfford(CONSTANTS.TIXAPICost)) { return; }
        this.props.p.hasTixApiAccess = true;
        this.props.p.loseMoney(CONSTANTS.TIXAPICost);
        this.props.rerender();
    }

    purchase4SMarketData() {
        if (this.props.p.has4SData) { return; }
        if (!this.props.p.canAfford(getStockMarket4SDataCost())) { return; }
        this.props.p.has4SData = true;
        this.props.p.loseMoney(getStockMarket4SDataCost());
        this.props.rerender();
    }

    purchase4SMarketDataTixApiAccess() {
        if (this.props.p.has4SDataTixApi) { return; }
        if (!this.props.p.canAfford(getStockMarket4STixApiCost())) { return; }
        this.props.p.has4SDataTixApi = true;
        this.props.p.loseMoney(getStockMarket4STixApiCost());
        this.props.rerender();
    }

    renderPurchaseWseAccountButton(): React.ReactElement {
        if (this.props.p.hasWseAccount) {
            return (
                <StdButtonPurchased text={"WSE Account - Purchased"} />
            )
        } else {
            const cost = CONSTANTS.WSEAccountCost;
            return (
                <StdButton
                    disabled={!this.props.p.canAfford(cost)}
                    onClick={this.purchaseWseAccount}
                    text={`Buy WSE Account - ${numeralWrapper.formatMoney(cost)}`}
                />
            )
        }
    }

    renderPurchaseTixApiAccessButton(): React.ReactElement {
        if (this.props.p.hasTixApiAccess) {
            return (
                <StdButtonPurchased text={"TIX API Access - Purchased"} />
            )
        } else {
            const cost = CONSTANTS.TIXAPICost;
            return (
                <StdButton
                    disabled={!this.props.p.canAfford(cost) || !this.props.p.hasWseAccount}
                    onClick={this.purchaseTixApiAccess}
                    style={blockStyleMarkup}
                    text={`Buy Trade Information eXchange (TIX) API Access - ${numeralWrapper.formatMoney(cost)}`}
                />
            )
        }
    }

    renderPurchase4SMarketDataButton(): React.ReactElement {
        if (this.props.p.has4SData) {
            return (
                <StdButtonPurchased
                    text={"4S Market Data - Purchased"}
                    tooltip={"Lets you view additional pricing and volatility information about stocks"}
                />
            )
        } else {
            const cost = getStockMarket4SDataCost();
            return (
                <StdButton
                    disabled={!this.props.p.canAfford(cost) || !this.props.p.hasWseAccount}
                    onClick={this.purchase4SMarketData}
                    text={`Buy 4S Market Data Access - ${numeralWrapper.formatMoney(cost)}`}
                    tooltip={"Lets you view additional pricing and volatility information about stocks"}
                />
            )
        }
    }

    renderPurchase4SMarketDataTixApiAccessButton(): React.ReactElement {
        if (!this.props.p.hasTixApiAccess) {
            return (
                <StdButton
                    disabled={true}
                    text={`Buy 4S Market Data TIX API Access`}
                    tooltip={"Requires TIX API Access"}
                />
            )
        } else if (this.props.p.has4SDataTixApi) {
            return (
                <StdButtonPurchased
                    text={"4S Market Data TIX API - Purchased"}
                    tooltip={"Let you access 4S Market Data through Netscript"}
                />
            )
        } else {
            const cost = getStockMarket4STixApiCost();
            return (
                <StdButton
                    disabled={!this.props.p.canAfford(cost)}
                    onClick={this.purchase4SMarketDataTixApiAccess}
                    text={`Buy 4S Market Data TIX API Access - ${numeralWrapper.formatMoney(cost)}`}
                    tooltip={"Let you access 4S Market Data through Netscript"}
                />
            )
        }
    }

    render() {
        const documentationLink = "https://bitburner.readthedocs.io/en/latest/basicgameplay/stockmarket.html";
        return (
            <div className={"stock-market-info-and-purchases"}>
                <p>Welcome to the World Stock Exchange (WSE)!</p>
                <button className={"std-button"}>
                    <a href={documentationLink} target={"_blank"}>
                        Investopedia
                    </a>
                </button>
                <br />
                <p>
                    To begin trading, you must first purchase an account:
                </p>
                {this.renderPurchaseWseAccountButton()}

                <h2>Trade Information eXchange (TIX) API</h2>
                <p>
                    TIX, short for Trade Information eXchange, is the communications protocol
                    used by the WSE. Purchasing access to the TIX API lets you write code to create
                    your own algorithmic/automated trading strategies.
                </p>
                {this.renderPurchaseTixApiAccessButton()}
                <h2>Four Sigma (4S) Market Data Feed</h2>
                <p>
                    Four Sigma's (4S) Market Data Feed provides information about stocks that will help
                    your trading strategies.
                </p>
                {this.renderPurchase4SMarketDataButton()}
                <button className={"help-tip-big"} onClick={this.handleClick4SMarketDataHelpTip}>
                    ?
                </button>
                {this.renderPurchase4SMarketDataTixApiAccessButton()}
                <p>
                    Commission Fees: Every transaction you make has
                    a {numeralWrapper.formatMoney(CONSTANTS.StockMarketCommission)} commission fee.
                </p><br />
                <p>
                    WARNING: When you reset after installing Augmentations, the Stock
                    Market is reset. You will retain your WSE Account, access to the
                    TIX API, and 4S Market Data access. However, all of your stock
                    positions are lost, so make sure to sell your stocks before
                    installing Augmentations!
                </p>
            </div>
        )
    }
}
