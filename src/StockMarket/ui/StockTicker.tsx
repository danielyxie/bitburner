/**
 * React Component for a single stock ticker in the Stock Market UI
 */
import * as React from "react";

import { StockTickerHeaderText } from "./StockTickerHeaderText";
import { StockTickerOrderList } from "./StockTickerOrderList";
import { StockTickerPositionText } from "./StockTickerPositionText";
import { StockTickerTxButton } from "./StockTickerTxButton";

import { Order } from "../Order";
import { Stock } from "../Stock";
import {
    getBuyTransactionCost,
    getSellTransactionGain,
} from "../StockMarketHelpers";
import { OrderTypes } from "../data/OrderTypes";
import { PositionTypes } from "../data/PositionTypes";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Accordion } from "../../ui/React/Accordion";

import { dialogBoxCreate } from "../../../utils/DialogBox";
import {
    yesNoTxtInpBoxClose,
    yesNoTxtInpBoxCreate,
    yesNoTxtInpBoxGetInput,
    yesNoTxtInpBoxGetNoButton,
    yesNoTxtInpBoxGetYesButton,
} from "../../../utils/YesNoBox";

enum SelectorOrderType {
    Market = "Market Order",
    Limit = "Limit Order",
    Stop = "Stop Order",
}

export type txFn = (stock: Stock, shares: number) => boolean;
export type placeOrderFn = (stock: Stock, shares: number, price: number, ordType: OrderTypes, posType: PositionTypes) => boolean;

type IProps = {
    buyStockLong: txFn;
    buyStockShort: txFn;
    cancelOrder: (params: object) => void;
    orders: Order[];
    p: IPlayer;
    placeOrder: placeOrderFn;
    sellStockLong: txFn;
    sellStockShort: txFn;
    stock: Stock;
}

type IState = {
    orderType: SelectorOrderType;
    position: PositionTypes;
    qty: string;
}

export class StockTicker extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            orderType: SelectorOrderType.Market,
            position: PositionTypes.Long,
            qty: "",
        }

        this.getBuyTransactionCostText = this.getBuyTransactionCostText.bind(this);
        this.getSellTransactionCostText = this.getSellTransactionCostText.bind(this);
        this.handleBuyButtonClick = this.handleBuyButtonClick.bind(this);
        this.handleBuyMaxButtonClick = this.handleBuyMaxButtonClick.bind(this);
        this.handleHeaderClick = this.handleHeaderClick.bind(this);
        this.handleOrderTypeChange = this.handleOrderTypeChange.bind(this);
        this.handlePositionTypeChange = this.handlePositionTypeChange.bind(this);
        this.handleQuantityChange = this.handleQuantityChange.bind(this);
        this.handleSellButtonClick = this.handleSellButtonClick.bind(this);
        this.handleSellAllButtonClick = this.handleSellAllButtonClick.bind(this);
    }

    createPlaceOrderPopupBox(yesTxt: string, popupTxt: string, yesBtnCb: (price: number) => void) {
        const yesBtn = yesNoTxtInpBoxGetYesButton();
        const noBtn  = yesNoTxtInpBoxGetNoButton();

        yesBtn!.innerText = yesTxt;
        yesBtn!.addEventListener("click", () => {
            const price = parseFloat(yesNoTxtInpBoxGetInput());
            if (isNaN(price)) {
                dialogBoxCreate(`Invalid input for price: ${yesNoTxtInpBoxGetInput()}`);
                return false;
            }

            yesBtnCb(price);
            yesNoTxtInpBoxClose();
        });

        noBtn!.innerText = "Cancel Order";
        noBtn!.addEventListener("click", () => {
            yesNoTxtInpBoxClose();
        });

        yesNoTxtInpBoxCreate(popupTxt);
    }

    getBuyTransactionCostText(): string {
        const stock = this.props.stock;
        const qty: number = this.getQuantity();
        if (isNaN(qty)) { return ""; }
        const cost = getBuyTransactionCost(this.props.stock, qty, this.state.position);
        if (cost == null) { return ""; }

        let costTxt = `Purchasing ${numeralWrapper.formatBigNumber(qty)} shares will cost ${numeralWrapper.formatMoney(cost)}. `;

        const causesMovement = qty > stock.shareTxUntilMovement;
        if (causesMovement) {
            costTxt += `WARNING: Purchasing this many shares will influence the stock price`;
        }

        return costTxt;
    }

    getQuantity(): number {
        return Math.round(parseFloat(this.state.qty));
    }

    getSellTransactionCostText(): string {
        const stock = this.props.stock;
        const qty: number = this.getQuantity();
        if (isNaN(qty)) { return ""; }
        const cost = getSellTransactionGain(this.props.stock, qty, this.state.position);
        if (cost == null) { return ""; }

        let costTxt = `Selling ${numeralWrapper.formatBigNumber(qty)} shares will result in a gain of ${numeralWrapper.formatMoney(cost)}. `;

        const causesMovement = qty > stock.shareTxUntilMovement;
        if (causesMovement) {
            costTxt += `WARNING: Selling this many shares will influence the stock price`;
        }

        return costTxt;
    }

    handleBuyButtonClick() {
        const shares = this.getQuantity();
        if (isNaN(shares)) {
            dialogBoxCreate(`Invalid input for quantity (number of shares): ${this.state.qty}`);
            return;
        }

        switch (this.state.orderType) {
            case SelectorOrderType.Market: {
                if (this.state.position === PositionTypes.Short) {
                    this.props.buyStockShort(this.props.stock, shares);
                } else {
                    this.props.buyStockLong(this.props.stock, shares);
                }
                break;
            }
            case SelectorOrderType.Limit: {
                this.createPlaceOrderPopupBox(
                    "Place Buy Limit Order",
                    "Enter the price for your Limit Order",
                    (price: number) => {
                        this.props.placeOrder(this.props.stock, shares, price, OrderTypes.LimitBuy, this.state.position);
                    }
                );
                break;
            }
            case SelectorOrderType.Stop: {
                this.createPlaceOrderPopupBox(
                    "Place Buy Stop Order",
                    "Enter the price for your Stop Order",
                    (price: number) => {
                        this.props.placeOrder(this.props.stock, shares, price, OrderTypes.StopBuy, this.state.position);
                    }
                );
                break;
            }
            default:
                break;
        }
    }

    handleBuyMaxButtonClick() {
        const playerMoney: number = this.props.p.money.toNumber();

        const stock = this.props.stock;
        let maxShares = Math.floor((playerMoney - CONSTANTS.StockMarketCommission) / this.props.stock.price);
        maxShares = Math.min(maxShares, Math.round(stock.maxShares - stock.playerShares - stock.playerShortShares));

        switch (this.state.orderType) {
            case SelectorOrderType.Market: {
                if (this.state.position === PositionTypes.Short) {
                    this.props.buyStockShort(stock, maxShares);
                } else {
                    this.props.buyStockLong(stock, maxShares);
                }
                break;
            }
            case SelectorOrderType.Limit: {
                this.createPlaceOrderPopupBox(
                    "Place Buy Limit Order",
                    "Enter the price for your Limit Order",
                    (price: number) => {
                        this.props.placeOrder(stock, maxShares, price, OrderTypes.LimitBuy, this.state.position);
                    }
                );
                break;
            }
            case SelectorOrderType.Stop: {
                this.createPlaceOrderPopupBox(
                    "Place Buy Stop Order",
                    "Enter the price for your Stop Order",
                    (price: number) => {
                        this.props.placeOrder(stock, maxShares, price, OrderTypes.StopBuy, this.state.position);
                    }
                )
                break;
            }
            default:
                break;
        }
    }

    handleHeaderClick(e: React.MouseEvent<HTMLButtonElement>) {
        const elem = e.currentTarget;
        elem.classList.toggle("active");

        const panel: HTMLElement = elem.nextElementSibling as HTMLElement;
        if (panel!.style.display === "block") {
            panel!.style.display = "none";
        } else {
            panel.style.display = "block";
        }
    }

    handleOrderTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;

        // The select value returns a string. Afaik TypeScript doesnt make it easy
        // to convert that string back to an enum type so we'll just do this for now
        switch (val) {
            case SelectorOrderType.Limit:
                this.setState({
                    orderType: SelectorOrderType.Limit,
                });
                break;
            case SelectorOrderType.Stop:
                this.setState({
                    orderType: SelectorOrderType.Stop,
                });
                break;
            case SelectorOrderType.Market:
            default:
                this.setState({
                    orderType: SelectorOrderType.Market,
                });
        }
    }

    handlePositionTypeChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const val = e.target.value;

        if (val === "Short") {
            this.setState({
                position: PositionTypes.Short,
            });
        } else {
            this.setState({
                position: PositionTypes.Long,
            });
        }

    }

    handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            qty: e.target.value,
        });
    }

    handleSellButtonClick() {
        const shares = this.getQuantity();
        if (isNaN(shares)) {
            dialogBoxCreate(`Invalid input for quantity (number of shares): ${this.state.qty}`);
            return;
        }

        switch (this.state.orderType) {
            case SelectorOrderType.Market: {
                if (this.state.position === PositionTypes.Short) {
                    this.props.sellStockShort(this.props.stock, shares);
                } else {
                    this.props.sellStockLong(this.props.stock, shares);
                }
                break;
            }
            case SelectorOrderType.Limit: {
                this.createPlaceOrderPopupBox(
                    "Place Sell Limit Order",
                    "Enter the price for your Limit Order",
                    (price: number) => {
                        this.props.placeOrder(this.props.stock, shares, price, OrderTypes.LimitSell, this.state.position);
                    }
                );
                break;
            }
            case SelectorOrderType.Stop: {
                this.createPlaceOrderPopupBox(
                    "Place Sell Stop Order",
                    "Enter the price for your Stop Order",
                    (price: number) => {
                        this.props.placeOrder(this.props.stock, shares, price, OrderTypes.StopSell, this.state.position);
                    }
                )
                break;
            }
            default:
                break;
        }
    }

    handleSellAllButtonClick() {
        const stock = this.props.stock;

        switch (this.state.orderType) {
            case SelectorOrderType.Market: {
                if (this.state.position === PositionTypes.Short) {
                    this.props.sellStockShort(stock, stock.playerShortShares);
                } else {
                    this.props.sellStockLong(stock, stock.playerShares);
                }
                break;
            }
            default: {
                dialogBoxCreate(`ERROR: 'Sell All' only works for Market Orders`);
                break;
            }
        }
    }

    // Whether the player has access to orders besides market orders (limit/stop)
    hasOrderAccess(): boolean {
        return (this.props.p.bitNodeN === 8 || (SourceFileFlags[8] >= 3));
    }

    // Whether the player has access to shorting stocks
    hasShortAccess(): boolean {
        return (this.props.p.bitNodeN === 8 || (SourceFileFlags[8] >= 2));
    }

    render() {
        // Determine if the player's intended transaction will cause a price movement
        let causesMovement: boolean = false;
        const qty = this.getQuantity();
        if (!isNaN(qty)) {
            causesMovement = qty > this.props.stock.shareTxUntilMovement;
        }

        return (
            <li>
                <Accordion
                    headerContent={
                        <StockTickerHeaderText p={this.props.p} stock={this.props.stock} />
                    }
                    panelContent={
                        <div>
                            <input
                                className={"stock-market-input"}
                                onChange={this.handleQuantityChange}
                                placeholder={"Quantity (Shares)"}
                                value={this.state.qty}
                            />
                            <select className={"stock-market-input dropdown"} onChange={this.handlePositionTypeChange} value={this.state.position}>
                                <option value={"Long"}>Long</option>
                                {
                                    this.hasShortAccess() &&
                                    <option value={"Short"}>Short</option>
                                }
                            </select>
                            <select className={"stock-market-input dropdown"} onChange={this.handleOrderTypeChange} value={this.state.orderType}>
                                <option value={SelectorOrderType.Market}>{SelectorOrderType.Market}</option>
                                {
                                    this.hasOrderAccess() &&
                                    <option value={SelectorOrderType.Limit}>{SelectorOrderType.Limit}</option>
                                }
                                {
                                    this.hasOrderAccess() &&
                                    <option value={SelectorOrderType.Stop}>{SelectorOrderType.Stop}</option>
                                }
                            </select>

                            <StockTickerTxButton onClick={this.handleBuyButtonClick} text={"Buy"} tooltip={this.getBuyTransactionCostText()} />
                            <StockTickerTxButton onClick={this.handleSellButtonClick} text={"Sell"} tooltip={this.getSellTransactionCostText()} />
                            <StockTickerTxButton onClick={this.handleBuyMaxButtonClick} text={"Buy MAX"} />
                            <StockTickerTxButton onClick={this.handleSellAllButtonClick} text={"Sell ALL"} />
                            {
                                causesMovement &&
                                <p className="stock-market-price-movement-warning">
                                    WARNING: Buying/Selling {numeralWrapper.formatBigNumber(qty)} shares will affect
                                    the stock's price. This applies during the transaction itself as well. See Investopedia
                                    for more details. 
                                </p>
                            }
                            <StockTickerPositionText p={this.props.p} stock={this.props.stock} />
                            <StockTickerOrderList
                                cancelOrder={this.props.cancelOrder}
                                orders={this.props.orders}
                                p={this.props.p}
                                stock={this.props.stock}
                            />
                        </div>
                    }
                />
            </li>
        )
    }
}
