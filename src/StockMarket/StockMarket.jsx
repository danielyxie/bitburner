import { Order } from "./Order";
import { Stock } from "./Stock";
import {
    getBuyTransactionCost,
    getSellTransactionGain,
    processBuyTransactionPriceMovement,
    processSellTransactionPriceMovement
} from "./StockMarketHelpers";
import {
    getStockMarket4SDataCost,
    getStockMarket4STixApiCost
} from "./StockMarketCosts";
import { InitStockMetadata } from "./data/InitStockMetadata";
import { OrderTypes } from "./data/OrderTypes";
import { PositionTypes } from "./data/PositionTypes";
import { StockSymbols } from "./data/StockSymbols";
import { StockMarketRoot } from "./ui/Root";

import { CONSTANTS } from "../Constants";
import { WorkerScript } from "../NetscriptWorker";
import { Player } from "../Player";

import { Page, routing } from ".././ui/navigationTracking";
import { numeralWrapper } from ".././ui/numeralFormat";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { Reviver } from "../../utils/JSONReviver";

import React from "react";
import ReactDOM from "react-dom";

export function placeOrder(stock, shares, price, type, position, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    var order = new Order(stock, shares, price, type, position);
    if (isNaN(shares) || isNaN(price)) {
        if (tixApi) {
            workerScript.scriptRef.log("ERROR: Invalid numeric value provided for either 'shares' or 'price' argument");
        } else {
            dialogBoxCreate("ERROR: Invalid numeric value provided for either 'shares' or 'price' argument");
        }
        return false;
    }
    if (StockMarket["Orders"] == null) {
        const orders = {};
        for (const name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                const stk = StockMarket[name];
                if (!(stk instanceof Stock)) { continue; }
                orders[stk.symbol] = [];
            }
        }
        StockMarket["Orders"] = orders;
    }
    StockMarket["Orders"][stock.symbol].push(order);
    //Process to see if it should be executed immediately
    processOrders(order.stock, order.type, order.pos);
    displayStockMarketContent();
    return true;
}

// Returns true if successfully cancels an order, false otherwise
export function cancelOrder(params, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    if (StockMarket["Orders"] == null) {return false;}
    if (params.order && params.order instanceof Order) {
        var order = params.order;
        // An 'Order' object is passed in
        var stockOrders = StockMarket["Orders"][order.stock.symbol];
        for (var i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                displayStockMarketContent();
                return true;
            }
        }
        return false;
    } else if (params.stock && params.shares && params.price && params.type &&
               params.pos && params.stock instanceof Stock) {
        // Order properties are passed in. Need to look for the order
        var stockOrders = StockMarket["Orders"][params.stock.symbol];
        var orderTxt = params.stock.symbol + " - " + params.shares + " @ " +
                       numeralWrapper.format(params.price, '$0.000a');
        for (var i = 0; i < stockOrders.length; ++i) {
            var order = stockOrders[i];
            if (params.shares === order.shares &&
                params.price === order.price &&
                params.type === order.type &&
                params.pos === order.pos) {
                stockOrders.splice(i, 1);
                displayStockMarketContent();
                if (tixApi) {
                    workerScript.scriptRef.log("Successfully cancelled order: " + orderTxt);
                }
                return true;
            }
        }
        if (tixApi) {
            workerScript.scriptRef.log("Failed to cancel order: " + orderTxt);
        }
        return false;
    }
    return false;
}

function executeOrder(order) {
    var stock = order.stock;
    var orderBook = StockMarket["Orders"];
    var stockOrders = orderBook[stock.symbol];
    var res = true;
    console.log("Executing the following order:");
    console.log(order);
    switch (order.type) {
        case OrderTypes.LimitBuy:
        case OrderTypes.StopBuy:
            if (order.pos === PositionTypes.Long) {
                res = buyStock(order.stock, order.shares) && res;
            } else if (order.pos === PositionTypes.Short) {
                res = shortStock(order.stock, order.shares) && res;
            }
            break;
        case OrderTypes.LimitSell:
        case OrderTypes.StopSell:
            if (order.pos === PositionTypes.Long) {
                res = sellStock(order.stock, order.shares) && res;
            } else if (order.pos === PositionTypes.Short) {
                res = sellShort(order.stock, order.shares) && res;
            }
            break;
    }
    if (res) {
        // Remove order from order book
        for (var i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                displayStockMarketContent();
                return;
            }
        }
        console.log("ERROR: Could not find the following Order in Order Book: ");
        console.log(order);
    } else {
        console.log("Order failed to execute");
    }
}

export let StockMarket = {}; // Maps full stock name -> Stock object
export let SymbolToStockMap = {}; // Maps symbol -> Stock object

export function loadStockMarket(saveString) {
    if (saveString === "") {
        StockMarket = {};
    } else {
        StockMarket = JSON.parse(saveString, Reviver);
    }
}

export function deleteStockMarket() {
    StockMarket = {};
}

export function initStockMarket() {
    for (const stk in StockMarket) {
        if (StockMarket.hasOwnProperty(stk)) {
            delete StockMarket[stk];
        }
    }

    for (const metadata of InitStockMetadata) {
        const name = metadata.name;
        StockMarket[name] = new Stock(metadata);
    }

    const orders = {};
    for (const name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            const stock = StockMarket[name];
            if (!(stock instanceof Stock)) { continue; }
            orders[stock.symbol] = [];
        }
    }
    StockMarket["Orders"] = orders;

    StockMarket.storedCycles = 0;
    StockMarket.lastUpdate = 0;
}

export function initSymbolToStockMap() {
    for (const name in StockSymbols) {
        if (StockSymbols.hasOwnProperty(name)) {
            const stock = StockMarket[name];
            if (stock == null) {
                console.error(`Could not find Stock for ${name}`);
                continue;
            }
            const symbol = StockSymbols[name];
            SymbolToStockMap[symbol] = stock;
        }
    }
}

export function stockMarketCycle() {
    for (const name in StockMarket) {
        const stock = StockMarket[name];
        if (!(stock instanceof Stock)) { continue; }
        let thresh = 0.6;
        if (stock.b) { thresh = 0.4; }
        if (Math.random() < thresh) {
            stock.b = !stock.b;
            if (stock.otlkMag < 10) { stock.otlkMag += 0.4; }
        }
    }
}

/**
 * Attempt to buy a stock in the long position
 * @param {Stock} stock - Stock to buy
 * @param {number} shares - Number of shares to buy
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @returns {boolean} - true if successful, false otherwise
 */
export function buyStock(stock, shares, workerScript=null) {
    const tixApi = (workerScript instanceof WorkerScript);

    // Validate arguments
    shares = Math.round(shares);
    if (shares == 0 || shares < 0) { return false; }
    if (stock == null || isNaN(shares)) {
        if (tixApi) {
            workerScript.log(`ERROR: buyStock() failed due to invalid arguments`);
        } else {
            dialogBoxCreate("Failed to buy stock. This may be a bug, contact developer");
        }

        return false;
    }

    // Does player have enough money?
    const totalPrice = getBuyTransactionCost(stock, shares, PositionTypes.Long);
    if (Player.money.lt(totalPrice)) {
        if (tixApi) {
            workerScript.log(`ERROR: buyStock() failed because you do not have enough money to purchase this potiion. You need ${numeralWrapper.formatMoney(totalPrice)}`);
        } else {
            dialogBoxCreate(`You do not have enough money to purchase this. You need ${numeralWrapper.formatMoney(totalPrice)}`);
        }

        return false;
    }

    // Would this purchase exceed the maximum number of shares?
    if (shares + stock.playerShares + stock.playerShortShares > stock.maxShares) {
        if (tixApi) {
            workerScript.log(`ERROR: buyStock() failed because purchasing this many shares would exceed ${stock.symbol}'s maximum number of shares`);
        } else {
            dialogBoxCreate(`You cannot purchase this many shares. ${stock.symbol} has a maximum of ${numeralWrapper.formatBigNumber(stock.maxShares)} shares.`);
        }

        return false;
    }

    const origTotal = stock.playerShares * stock.playerAvgPx;
    Player.loseMoney(totalPrice);
    const newTotal = origTotal + totalPrice - CONSTANTS.StockMarketCommission;
    stock.playerShares = Math.round(stock.playerShares + shares);
    stock.playerAvgPx = newTotal / stock.playerShares;
    processBuyTransactionPriceMovement(stock, shares, PositionTypes.Long);
    displayStockMarketContent();

    const resultTxt = `Bought ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol} for ${numeralWrapper.formatMoney(totalPrice)}. ` +
                      `Paid ${numeralWrapper.formatMoney(CONSTANTS.StockMarketCommission)} in commission fees.`
    if (tixApi) {
        if (workerScript.shouldLog("buyStock")) { workerScript.log(resultTxt); }
    } else {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

/**
 * Attempt to sell a stock in the long position
 * @param {Stock} stock - Stock to sell
 * @param {number} shares - Number of shares to sell
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * returns {boolean} - true if successfully sells given number of shares OR MAX owned, false otherwise
 */
export function sellStock(stock, shares, workerScript=null) {
    const tixApi = (workerScript instanceof WorkerScript);

    // Sanitize/Validate arguments
    if (stock == null || shares < 0 || isNaN(shares)) {
        if (tixApi) {
            workerScript.log(`ERROR: sellStock() failed due to invalid arguments`);
        } else {
            dialogBoxCreate("Failed to sell stock. This is probably due to an invalid quantity. Otherwise, this may be a bug, contact developer");
        }

        return false;
    }
    shares = Math.round(shares);
    if (shares > stock.playerShares) {shares = stock.playerShares;}
    if (shares === 0) {return false;}

    const gains = getSellTransactionGain(stock, shares, PositionTypes.Long);
    let netProfit = gains - (stock.playerAvgPx * shares);
    if (isNaN(netProfit)) { netProfit = 0; }
    Player.gainMoney(gains);
    Player.recordMoneySource(netProfit, "stock");
    if (tixApi) {
        workerScript.scriptRef.onlineMoneyMade += netProfit;
        Player.scriptProdSinceLastAug += netProfit;
    }

    stock.playerShares = Math.round(stock.playerShares - shares);
    if (stock.playerShares === 0) {
        stock.playerAvgPx = 0;
    }

    processSellTransactionPriceMovement(stock, shares, PositionTypes.Long);
    displayStockMarketContent();
    const resultTxt = `Sold ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol}. ` +
                      `After commissions, you gained a total of ${numeralWrapper.formatMoney(gains)}.`;
    if (tixApi) {
        if (workerScript.shouldLog("sellStock")) { workerScript.log(resultTxt); }
    } else {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

/**
 * Attempt to buy a stock in the short position
 * @param {Stock} stock - Stock to sell
 * @param {number} shares - Number of shares to short
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @returns {boolean} - true if successful, false otherwise
 */
export function shortStock(stock, shares, workerScript=null) {
    const tixApi = (workerScript instanceof WorkerScript);

    // Validate arguments
    shares = Math.round(shares);
    if (shares === 0 || shares < 0) { return false; }
    if (stock == null || isNaN(shares)) {
        if (tixApi) {
            workerScript.log("ERROR: shortStock() failed because of invalid arguments.");
        } else {
            dialogBoxCreate("Failed to initiate a short position in a stock. This is probably " +
                            "due to an invalid quantity. Otherwise, this may be a bug,  so contact developer");
        }
        return false;
    }

    // Does the player have enough money?
    const totalPrice = getBuyTransactionCost(stock, shares, PositionTypes.Short);
    if (Player.money.lt(totalPrice)) {
        if (tixApi) {
            workerScript.log("ERROR: shortStock() failed because you do not have enough " +
                             "money to purchase this short position. You need " +
                             numeralWrapper.formatMoney(totalPrice));
        } else {
            dialogBoxCreate("You do not have enough money to purchase this short position. You need " +
                            numeralWrapper.formatMoney(totalPrice));
        }

        return false;
    }

    // Would this purchase exceed the maximum number of shares?
    if (shares + stock.playerShares + stock.playerShortShares > stock.maxShares) {
        if (tixApi) {
            workerScript.log(`ERROR: shortStock() failed because purchasing this many short shares would exceed ${stock.symbol}'s maximum number of shares.`);
        } else {
            dialogBoxCreate(`You cannot purchase this many shares. ${stock.symbol} has a maximum of ${stock.maxShares} shares.`);
        }

        return false;
    }

    const origTotal = stock.playerShortShares * stock.playerAvgShortPx;
    Player.loseMoney(totalPrice);
    const newTotal = origTotal + totalPrice - CONSTANTS.StockMarketCommission;
    stock.playerShortShares = Math.round(stock.playerShortShares + shares);
    stock.playerAvgShortPx = newTotal / stock.playerShortShares;
    processBuyTransactionPriceMovement(stock, shares, PositionTypes.Short);
    displayStockMarketContent();
    const resultTxt = `Bought a short position of ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol} ` +
                      `for ${numeralWrapper.formatMoney(totalPrice)}. Paid ${numeralWrapper.formatMoney(CONSTANTS.StockMarketCommission)} ` +
                      `in commission fees.`;
    if (tixApi) {
        if (workerScript.shouldLog("shortStock")) { workerScript.log(resultTxt); }
    } else {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

/**
 * Attempt to sell a stock in the short position
 * @param {Stock} stock - Stock to sell
 * @param {number} shares - Number of shares to sell
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @returns {boolean} true if successfully sells given amount OR max owned, false otherwise
 */
export function sellShort(stock, shares, workerScript=null) {
    const tixApi = (workerScript instanceof WorkerScript);

    if (stock == null || isNaN(shares) || shares < 0) {
        if (tixApi) {
            workerScript.log("ERROR: sellShort() failed because of invalid arguments.");
        } else {
            dialogBoxCreate("Failed to sell a short position in a stock. This is probably " +
                            "due to an invalid quantity. Otherwise, this may be a bug, so contact developer");
        }

        return false;
    }
    shares = Math.round(shares);
    if (shares > stock.playerShortShares) {shares = stock.playerShortShares;}
    if (shares === 0) {return false;}

    const origCost = shares * stock.playerAvgShortPx;
    const totalGain = getSellTransactionGain(stock, shares, PositionTypes.Short);
    if (totalGain == null || isNaN(totalGain) || origCost == null) {
        if (tixApi) {
            workerScript.log(`Failed to sell short position in a stock. This is probably either due to invalid arguments, or a bug`);
        } else {
            dialogBoxCreate(`Failed to sell short position in a stock. This is probably either due to invalid arguments, or a bug`);
        }

        return false;
    }
    let profit = totalGain - origCost;
    if (isNaN(profit)) { profit = 0; }
    Player.gainMoney(totalGain);
    Player.recordMoneySource(profit, "stock");
    if (tixApi) {
        workerScript.scriptRef.onlineMoneyMade += profit;
        Player.scriptProdSinceLastAug += profit;
    }

    stock.playerShortShares = Math.round(stock.playerShortShares - shares);
    if (stock.playerShortShares === 0) {
        stock.playerAvgShortPx = 0;
    }
    processSellTransactionPriceMovement(stock, shares, PositionTypes.Short);
    displayStockMarketContent();
    const resultTxt = `Sold your short position of ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol}. ` +
                      `After commissions, you gained a total of ${numeralWrapper.formatMoney(totalGain)}`;
    if (tixApi) {
        if (workerScript.shouldLog("sellShort")) { workerScript.log(resultTxt); }
    } else {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

// Stock prices updated every 6 seconds
const msPerStockUpdate = 6e3;
const cyclesPerStockUpdate = msPerStockUpdate / CONSTANTS.MilliPerCycle;
export function processStockPrices(numCycles=1) {
    if (StockMarket.storedCycles == null || isNaN(StockMarket.storedCycles)) { StockMarket.storedCycles = 0; }
    StockMarket.storedCycles += numCycles;

    if (StockMarket.storedCycles < cyclesPerStockUpdate) { return; }

    // We can process the update every 4 seconds as long as there are enough
    // stored cycles. This lets us account for offline time
    const timeNow = new Date().getTime();
    if (timeNow - StockMarket.lastUpdate < 4e3) { return; }

    StockMarket.lastUpdate = timeNow;
    StockMarket.storedCycles -= cyclesPerStockUpdate;

    var v = Math.random();
    for (const name in StockMarket) {
        const stock = StockMarket[name];
        if (!(stock instanceof Stock)) { continue; }
        let av = (v * stock.mv) / 100;
        if (isNaN(av)) { av = .02; }

        let chc = 50;
        if (stock.b) {
            chc = (chc + stock.otlkMag) / 100;
        } else {
            chc = (chc - stock.otlkMag) / 100;
        }
        if (stock.price >= stock.cap) {
            chc = 0.1; // "Soft Limit" on stock price. It could still go up but its unlikely
            stock.b = false;
        }
        if (isNaN(chc)) { chc = 0.5; }

        const c = Math.random();
        if (c < chc) {
            stock.price *= (1 + av);
            processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Short);
            processOrders(stock, OrderTypes.LimitSell, PositionTypes.Long);
            processOrders(stock, OrderTypes.StopBuy, PositionTypes.Long);
            processOrders(stock, OrderTypes.StopSell, PositionTypes.Short);
        } else {
            stock.price /= (1 + av);
            processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Long);
            processOrders(stock, OrderTypes.LimitSell, PositionTypes.Short);
            processOrders(stock, OrderTypes.StopBuy, PositionTypes.Short);
            processOrders(stock, OrderTypes.StopSell, PositionTypes.Long);
        }

        let otlkMagChange = stock.otlkMag * av;
        if (stock.otlkMag <= 0.1) {
            otlkMagChange = 1;
        }
        if (c < 0.5) {
            stock.otlkMag += otlkMagChange;
        } else {
            stock.otlkMag -= otlkMagChange;
        }
        if (stock.otlkMag > 50) { stock.otlkMag = 50; } // Cap so the "forecast" is between 0 and 100
        if (stock.otlkMag < 0) {
            stock.otlkMag *= -1;
            stock.b = !stock.b;
        }

        // Shares required for price movement gradually approaches max over time
        stock.shareTxUntilMovement = Math.min(stock.shareTxUntilMovement + 5, stock.shareTxForMovement);
    }

    displayStockMarketContent();
}

// Checks and triggers any orders for the specified stock
function processOrders(stock, orderType, posType) {
    var orderBook = StockMarket["Orders"];
    if (orderBook == null) {
        var orders = {};
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                var stock = StockMarket[name];
                if (!(stock instanceof Stock)) {continue;}
                orders[stock.symbol] = [];
            }
        }
        StockMarket["Orders"] = orders;
        return; //Newly created, so no orders to process
    }
    var stockOrders = orderBook[stock.symbol];
    if (stockOrders == null || !(stockOrders.constructor === Array)) {
        console.log("ERROR: Invalid Order book for " + stock.symbol + " in processOrders()");
        stockOrders = [];
        return;
    }
    for (var i = 0; i < stockOrders.length; ++i) {
        var order = stockOrders[i];
        if (order.type === orderType && order.pos === posType) {
            switch(order.type) {
                case OrderTypes.LimitBuy:
                    if (order.pos === PositionTypes.Long && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                case OrderTypes.LimitSell:
                    if (order.pos === PositionTypes.Long && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                case OrderTypes.StopBuy:
                    if (order.pos === PositionTypes.Long && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                case OrderTypes.StopSell:
                    if (order.pos === PositionTypes.Long && stock.price <= order.price) {
                        executeOrder/*66*/(order);
                    } else if (order.pos === PositionTypes.Short && stock.price >= order.price) {
                        executeOrder/*66*/(order);
                    }
                    break;
                default:
                    console.log("Invalid order type: " + order.type);
                    return;
            }
        }
    }
}

let stockMarketContainer = null;
function setStockMarketContainer() {
    stockMarketContainer = document.getElementById("stock-market-container");
    document.removeEventListener("DOMContentLoaded", setStockMarketContainer);
}

document.addEventListener("DOMContentLoaded", setStockMarketContainer);


function initStockMarketFnForReact() {
    initStockMarket();
    initSymbolToStockMap();
}

export function displayStockMarketContent() {
    if (!routing.isOn(Page.StockMarket)) {
        return;
    }

    if (stockMarketContainer instanceof HTMLElement) {
        ReactDOM.render(
            <StockMarketRoot
                buyStockLong={buyStock}
                buyStockShort={shortStock}
                cancelOrder={cancelOrder}
                initStockMarket={initStockMarketFnForReact}
                p={Player}
                placeOrder={placeOrder}
                sellStockLong={sellStock}
                sellStockShort={sellShort}
                stockMarket={StockMarket}
            />,
            stockMarketContainer
        )
    }
}
