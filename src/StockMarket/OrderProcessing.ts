/**
 * Helper functions for determine whether Limit and Stop orders should
 * be executed (and executing them)
 */
import {
    buyStock,
    sellStock,
    shortStock,
    sellShort,
} from "./BuyingAndSelling";
import { IOrderBook } from "./IOrderBook";
import { IStockMarket } from "./IStockMarket";
import { Order } from "./Order";
import { Stock } from "./Stock";

import { OrderTypes } from "./data/OrderTypes";
import { PositionTypes } from "./data/PositionTypes";

import { numeralWrapper } from "../ui/numeralFormat";

import { dialogBoxCreate } from "../../utils/DialogBox";

interface IProcessOrderRefs {
    rerenderFn: () => void;
    stockMarket: IStockMarket;
}

/**
 * Search for all orders of a specific type and execute them if appropriate
 * @param {Stock} stock - Stock for which orders should be processed
 * @param {OrderTypes} orderType - Type of order to check (Limit/Stop buy/sell)
 * @param {PositionTypes} posType - Long or short
 * @param {IProcessOrderRefs} refs - References to objects/functions that are required for this function
 */
export function processOrders(stock: Stock, orderType: OrderTypes, posType: PositionTypes, refs: IProcessOrderRefs): void {
    let orderBook = refs.stockMarket["Orders"];
    if (orderBook == null) {
        const orders: IOrderBook = {};
        for (const name in refs.stockMarket) {
            const stock = refs.stockMarket[name];
            if (!(stock instanceof Stock)) { continue; }
            orders[stock.symbol] = [];
        }
        refs.stockMarket["Orders"] = orders;
        return; // Newly created, so no orders to process
    }
    let stockOrders = orderBook[stock.symbol];
    if (stockOrders == null || !(stockOrders.constructor === Array)) {
        console.error(`Invalid Order book for ${stock.symbol} in processOrders()`);
        stockOrders = [];
        return;
    }

    for (const order of stockOrders) {
        if (order.type === orderType && order.pos === posType) {
            switch (order.type) {
                case OrderTypes.LimitBuy:
                    if (order.pos === PositionTypes.Long && stock.price <= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    } else if (order.pos === PositionTypes.Short && stock.price >= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    }
                    break;
                case OrderTypes.LimitSell:
                    if (order.pos === PositionTypes.Long && stock.price >= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    } else if (order.pos === PositionTypes.Short && stock.price <= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    }
                    break;
                case OrderTypes.StopBuy:
                    if (order.pos === PositionTypes.Long && stock.price >= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    } else if (order.pos === PositionTypes.Short && stock.price <= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    }
                    break;
                case OrderTypes.StopSell:
                    if (order.pos === PositionTypes.Long && stock.price <= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    } else if (order.pos === PositionTypes.Short && stock.price >= order.price) {
                        executeOrder/*66*/(order, refs.stockMarket, refs.rerenderFn);
                    }
                    break;
                default:
                    console.warn(`Invalid order type: ${order.type}`);
                    return;
            }
        }
    }
}

/**
 * Execute a Stop or Limit Order.
 * @param {Order} order - Order being executed
 * @param {IStockMarket} stockMarket - Reference to StockMarket object
 */
function executeOrder(order: Order, stockMarket: IStockMarket, rerenderFn: () => void) {
    const stock = order.stock;
    const orderBook = stockMarket["Orders"];
    const stockOrders = orderBook[stock.symbol];
    const isLimit = (order.type === OrderTypes.LimitBuy || order.type === OrderTypes.LimitSell);
    let limitShares = 0;

    // When orders are executed, the buying and selling functions shouldn't
    // emit popup dialog boxes. This options object configures the functions for that
    const opts = {
        rerenderFn: rerenderFn,
        suppressDialog: true
    }

    let res = true;
    let isBuy = false;
    console.log("Executing the following order:");
    console.log(order);
    switch (order.type) {
        case OrderTypes.LimitBuy: {
            isBuy = true;

            // We only execute limit orders until the price fails to match the order condition
            const isLong = (order.pos === PositionTypes.Long);
            const firstShares = Math.min(order.shares, stock.shareTxUntilMovement);

            // First transaction to trigger movement
            if (isLong ? buyStock(stock, firstShares, null, opts) : shortStock(stock, firstShares, null, opts)) {
                limitShares = firstShares;
            } else {
                break;
            }

            let remainingShares = order.shares - firstShares;
            let remainingIterations = Math.ceil(remainingShares / stock.shareTxForMovement);
            for (let i = 0; i < remainingIterations; ++i) {
                if (isLong && stock.price > order.price) {
                    break;
                } else if (!isLong && stock.price < order.price) {
                    break;
                }

                const shares = Math.min(remainingShares, stock.shareTxForMovement);
                if (isLong ? buyStock(stock, shares, null, opts) : shortStock(stock, shares, null, opts)) {
                    limitShares += shares;
                    remainingShares -= shares;
                } else {
                    break;
                }
            }
        }
        case OrderTypes.StopBuy: {
            isBuy = true;
            if (order.pos === PositionTypes.Long) {
                res = buyStock(stock, order.shares, null, opts) && res;
            } else if (order.pos === PositionTypes.Short) {
                res = shortStock(stock, order.shares, null, opts) && res;
            }
            break;
        }
        case OrderTypes.LimitSell: {
            // We only execute limit orders until the price fails to match the order condition
            const isLong = (order.pos === PositionTypes.Long);
            const firstShares = Math.min(order.shares, stock.shareTxUntilMovement);

            // First transaction to trigger movement
            if (isLong ? sellStock(stock, firstShares, null, opts) : sellShort(stock, firstShares, null, opts)) {
                limitShares = firstShares;
            } else {
                break;
            }

            let remainingShares = order.shares - firstShares;
            let remainingIterations = Math.ceil(remainingShares / stock.shareTxForMovement);
            for (let i = 0; i < remainingIterations; ++i) {
                if (isLong && stock.price < order.price) {
                    break;
                } else if (!isLong && stock.price > order.price) {
                    break;
                }

                const shares = Math.min(remainingShares, stock.shareTxForMovement);
                if (isLong ? sellStock(stock, shares, null, opts) : sellShort(stock, shares, null, opts)) {
                    limitShares += shares;
                    remainingShares -= shares;
                } else {
                    break;
                }
            }
        }
        case OrderTypes.StopSell: {
            if (order.pos === PositionTypes.Long) {
                res = sellStock(stock, order.shares, null, opts) && res;
            } else if (order.pos === PositionTypes.Short) {
                res = sellShort(stock, order.shares, null, opts) && res;
            }
            break;
        }
        default:
            console.warn(`Invalid order type: ${order.type}`);
            return;
    }

    // Position type, for logging/message purposes
    const pos = order.pos === PositionTypes.Long ? "Long" : "Short";

    if (res) {
        if (isLimit) {

        } else {

            for (let i = 0; i < stockOrders.length; ++i) {
                if (order == stockOrders[i]) {

                }
            }
        }

        for (let i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                if (isLimit) {
                    // Limit orders might only transact a certain # of shares, so we have the adjust the order qty.
                    stockOrders[i].shares -= limitShares;
                    if (stockOrders[i].shares <= 0) {
                        stockOrders.splice(i, 1);
                        dialogBoxCreate(`${order.type} for ${order.stock.symbol} @ ${numeralWrapper.formatMoney(order.price)} (${pos}) was filled ` +
                                        `(${Math.round(limitShares)} shares`);
                    } else {
                        dialogBoxCreate(`${order.type} for ${order.stock.symbol} @ ${numeralWrapper.formatMoney(order.price)} (${pos}) was partially filled ` +
                                        `(${Math.round(limitShares)} shares transacted, ${stockOrders[i].shares} shares remaining`);
                    }
                } else {
                    // Stop orders will transact everything, so they can be removed completely
                    stockOrders.splice(i, 1);
                    dialogBoxCreate(`${order.type} for ${order.stock.symbol} @ ${numeralWrapper.formatMoney(order.price)} (${pos}) was filled ` +
                                    `(${Math.round(order.shares)} shares transacted)`);
                }

                rerenderFn();
                return;
            }
        }

        console.error("Could not find the following Order in Order Book: ");
        console.error(order);
    } else {
        if (isBuy) {
            dialogBoxCreate(`Failed to execute ${order.type} for ${order.stock.symbol} @ ${numeralWrapper.formatMoney(order.price)} (${pos}). ` +
                            `This is most likely because you do not have enough money or the order would exceed the stock's maximum number of shares`);
        } else {
            dialogBoxCreate(`Failed to execute ${order.type} for ${order.stock.symbol} @ ${numeralWrapper.formatMoney(order.price)} (${pos}). ` +
                            `This is most likely a bug, please report to game developer with details.`);
        }
    }
}
