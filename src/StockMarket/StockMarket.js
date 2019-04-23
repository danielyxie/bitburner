import {
    Order,
    OrderTypes,
    PositionTypes
} from "./Order";
import { Stock } from "./Stock";
import {
    getStockMarket4SDataCost,
    getStockMarket4STixApiCost
} from "./StockMarketCosts";
import { InitStockMetadata } from "./data/InitStockMetadata";
import { StockSymbols } from "./data/StockSymbols";

import { CONSTANTS } from "../Constants";
import { LocationName } from "../Locations/data/LocationNames";
import { hasWallStreetSF, wallStreetSFLvl } from "../NetscriptFunctions";
import { WorkerScript } from "../NetscriptWorker";
import { Player } from "../Player";

import { Page, routing } from ".././ui/navigationTracking";
import { numeralWrapper } from ".././ui/numeralFormat";

import { dialogBoxCreate } from "../../utils/DialogBox";
import { clearEventListeners } from "../../utils/uiHelpers/clearEventListeners";
import {
    Reviver,
    Generic_toJSON,
    Generic_fromJSON
} from "../../utils/JSONReviver";
import {exceptionAlert}                         from "../../utils/helpers/exceptionAlert";
import {getRandomInt}                           from "../../utils/helpers/getRandomInt";
import {KEY}                                    from "../../utils/helpers/keyCodes";
import {createElement}                          from "../../utils/uiHelpers/createElement";
import {removeChildrenFromElement}              from "../../utils/uiHelpers/removeChildrenFromElement";
import {removeElementById}                      from "../../utils/uiHelpers/removeElementById";
import {yesNoBoxCreate, yesNoTxtInpBoxCreate,
        yesNoBoxGetYesButton, yesNoBoxGetNoButton,
        yesNoTxtInpBoxGetYesButton, yesNoTxtInpBoxGetNoButton,
        yesNoTxtInpBoxGetInput, yesNoBoxClose,
        yesNoTxtInpBoxClose, yesNoBoxOpen}      from "../../utils/YesNoBox";

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
    updateStockOrderList(order.stock);
    return true;
}

// Returns true if successfully cancels an order, false otherwise
export function cancelOrder(params, workerScript=null) {
    var tixApi = (workerScript instanceof WorkerScript);
    if (StockMarket["Orders"] == null) {return false;}
    if (params.order && params.order instanceof Order) {
        var order = params.order;
        //An 'Order' object is passed in
        var stockOrders = StockMarket["Orders"][order.stock.symbol];
        for (var i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                updateStockOrderList(order.stock);
                return true;
            }
        }
        return false;
    } else if (params.stock && params.shares && params.price && params.type &&
               params.pos && params.stock instanceof Stock) {
        //Order properties are passed in. Need to look for the order
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
                updateStockOrderList(order.stock);
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
        //Remove order from order book
        for (var i = 0; i < stockOrders.length; ++i) {
            if (order == stockOrders[i]) {
                stockOrders.splice(i, 1);
                updateStockOrderList(order.stock);
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

    var orders = {};
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;}
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
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;}
            var thresh = 0.6;
            if (stock.b) {thresh = 0.4;}
            if (Math.random() < thresh) {
                stock.b = !stock.b;
            }
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
    const totalPrice = stock.price * shares;
    if (Player.money.lt(totalPrice + CONSTANTS.StockMarketCommission)) {
        if (tixApi) {
            workerScript.log(`ERROR: buyStock() failed because you do not have enough money to purchase this potiion. You need ${numeralWrapper.formatMoney(totalPrice + CONSTANTS.StockMarketCommission)}`);
        } else {
            dialogBoxCreate(`You do not have enough money to purchase this. You need ${numeralWrapper.formatMoney(totalPrice + CONSTANTS.StockMarketCommission)}`);
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
    Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
    const newTotal = origTotal + totalPrice;
    stock.playerShares = Math.round(stock.playerShares + shares);
    stock.playerAvgPx = newTotal / stock.playerShares;
    updateStockPlayerPosition(stock);
    if (tixApi) {
        if (workerScript.shouldLog("buyStock")) {
            workerScript.log(
                "Bought " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
                numeralWrapper.format(stock.price, '($0.000a)') + " per share. Paid " +
                numeralWrapper.format(CONSTANTS.StockMarketCommission, '($0.000a)') + " in commission fees."
            );
        }
    } else {
        dialogBoxCreate(
            "Bought " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
            numeralWrapper.format(stock.price, '($0.000a)') + " per share. Paid " +
            numeralWrapper.format(CONSTANTS.StockMarketCommission, '($0.000a)') + " in commission fees."
        );
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

    const gains = stock.price * shares - CONSTANTS.StockMarketCommission;
    let netProfit = ((stock.price - stock.playerAvgPx) * shares) - CONSTANTS.StockMarketCommission;
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
    updateStockPlayerPosition(stock);
    if (tixApi) {
         if (workerScript.shouldLog("sellStock")) {
             workerScript.log(
                 "Sold " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
                 numeralWrapper.format(stock.price, '($0.000a)') + " per share. After commissions, you gained " +
                 "a total of " + numeralWrapper.format(gains, '($0.000a)') + "."
             );
         }
    } else {
        dialogBoxCreate(
            "Sold " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
            numeralWrapper.format(stock.price, '($0.000a)') + " per share. After commissions, you gained " +
            "a total of " + numeralWrapper.format(gains, '($0.000a)') + "."
        );
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
    const totalPrice = stock.price * shares;
    if (Player.money.lt(totalPrice + CONSTANTS.StockMarketCommission)) {
        if (tixApi) {
            workerScript.log("ERROR: shortStock() failed because you do not have enough " +
                             "money to purchase this short position. You need " +
                             numeralWrapper.formatMoney(totalPrice + CONSTANTS.StockMarketCommission));
        } else {
            dialogBoxCreate("You do not have enough money to purchase this short position. You need " +
                            numeralWrapper.formatMoney(totalPrice + CONSTANTS.StockMarketCommission));
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
    Player.loseMoney(totalPrice + CONSTANTS.StockMarketCommission);
    const newTotal = origTotal + totalPrice;
    stock.playerShortShares = Math.round(stock.playerShortShares + shares);
    stock.playerAvgShortPx = newTotal / stock.playerShortShares;
    updateStockPlayerPosition(stock);
    if (tixApi) {
        if (workerScript.disableLogs.ALL == null && workerScript.disableLogs.shortStock == null) {
            workerScript.log(
                "Bought a short position of " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
                numeralWrapper.format(stock.price, '($0.000a)') + " per share. Paid " +
                numeralWrapper.format(CONSTANTS.StockMarketCommission, '($0.000a)') + " in commission fees."
            );
        }
    } else {
        dialogBoxCreate(
            "Bought a short position of " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
            numeralWrapper.format(stock.price, '($0.000a)') + " per share. Paid " +
            numeralWrapper.format(CONSTANTS.StockMarketCommission, '($0.000a)') + " in commission fees."
        );
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
    let profit = ((stock.playerAvgShortPx - stock.price) * shares) - CONSTANTS.StockMarketCommission;
    if (isNaN(profit)) { profit = 0; }
    Player.gainMoney(origCost + profit);
    Player.recordMoneySource(profit, "stock");
    if (tixApi) {
        workerScript.scriptRef.onlineMoneyMade += profit;
        Player.scriptProdSinceLastAug += profit;
    }

    stock.playerShortShares = Math.round(stock.playerShortShares - shares);
    if (stock.playerShortShares === 0) {
        stock.playerAvgShortPx = 0;
    }
    updateStockPlayerPosition(stock);
    if (tixApi) {
        if (workerScript.shouldLog("sellShort")) {
            workerScript.log(
                "Sold your short position of " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
                numeralWrapper.format(stock.price, '($0.000a)') + " per share. After commissions, you gained " +
                "a total of " + numeralWrapper.format(origCost + profit, '($0.000a)') + "."
            );
        }
    } else {
        dialogBoxCreate(
            "Sold your short position of " + numeralWrapper.format(shares, '0,0') + " shares of " + stock.symbol + " at " +
            numeralWrapper.format(stock.price, '($0.000a)') + " per share. After commissions, you gained " +
            "a total of " + numeralWrapper.format(origCost + profit, '($0.000a)') + "."
        );
    }

    return true;
}

export function processStockPrices(numCycles=1) {
    if (StockMarket.storedCycles == null || isNaN(StockMarket.storedCycles)) { StockMarket.storedCycles = 0; }
    StockMarket.storedCycles += numCycles;

    // Stock Prices updated every 6 seconds on average. But if there are stored
    // cycles they update 50% faster, so every 4 seconds
    const msPerStockUpdate = 6e3;
    const cyclesPerStockUpdate = msPerStockUpdate / CONSTANTS.MilliPerCycle;
    if (StockMarket.storedCycles < cyclesPerStockUpdate) { return; }

    const timeNow = new Date().getTime();
    if (timeNow - StockMarket.lastUpdate < 4e3) { return; }

    StockMarket.lastUpdate = timeNow;
    StockMarket.storedCycles -= cyclesPerStockUpdate;

    var v = Math.random();
    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) { continue; }
            var av = (v * stock.mv) / 100;
            if (isNaN(av)) {av = .02;}

            var chc = 50;
            if (stock.b) {
                chc = (chc + stock.otlkMag) / 100;
                if (isNaN(chc)) {chc = 0.5;}
            } else {
                chc = (chc - stock.otlkMag) / 100;
                if (isNaN(chc)) {chc = 0.5;}
            }
            if (stock.price >= stock.cap) {
                chc = 0.1; // "Soft Limit" on stock price. It could still go up but its unlikely
                stock.b = false;
            }

            var c = Math.random();
            if (c < chc) {
                stock.price *= (1 + av);
                processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Short);
                processOrders(stock, OrderTypes.LimitSell, PositionTypes.Long);
                processOrders(stock, OrderTypes.StopBuy, PositionTypes.Long);
                processOrders(stock, OrderTypes.StopSell, PositionTypes.Short);
                if (routing.isOn(Page.StockMarket)) {
                    updateStockTicker(stock, true);
                }
            } else {
                stock.price /= (1 + av);
                processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Long);
                processOrders(stock, OrderTypes.LimitSell, PositionTypes.Short);
                processOrders(stock, OrderTypes.StopBuy, PositionTypes.Short);
                processOrders(stock, OrderTypes.StopSell, PositionTypes.Long);
                if (routing.isOn(Page.StockMarket)) {
                    updateStockTicker(stock, false);
                }
            }

            var otlkMagChange = stock.otlkMag * av;
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

        }
    }
}

//Checks and triggers any orders for the specified stock
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

export function setStockMarketContentCreated(b) {
    stockMarketContentCreated = b;
}

var stockMarketContentCreated = false;
var stockMarketPortfolioMode = false;
var COMM = CONSTANTS.StockMarketCommission;
export function displayStockMarketContent() {
    // Backwards compatibility
    if (Player.hasWseAccount == null)   {Player.hasWseAccount = false;}
    if (Player.hasTixApiAccess == null) {Player.hasTixApiAccess = false;}
    if (Player.has4SData == null)       {Player.has4SData = false;}
    if (Player.has4SDataTixApi == null) {Player.has4SDataTixApi = false;}

    function stylePurchaseButton(btn, cost, flag, initMsg, purchasedMsg) {
        btn.innerText = initMsg;
        btn.classList.remove("a-link-button");
        btn.classList.remove("a-link-button-bought");
        btn.classList.remove("a-link-button-inactive");
        if (!flag && Player.money.gte(cost)) {
            btn.classList.add("a-link-button");
        } else if (flag) {
            btn.innerText = purchasedMsg;
            btn.classList.add("a-link-button-bought");
        } else {
            btn.classList.add("a-link-button-inactive");
        }
    }

    //Purchase WSE Account button
    var wseAccountButton = clearEventListeners("stock-market-buy-account");
    stylePurchaseButton(wseAccountButton, CONSTANTS.WSEAccountCost, Player.hasWseAccount,
                        "Buy WSE Account - " + numeralWrapper.format(CONSTANTS.WSEAccountCost, '($0.000a)'),
                        "WSE Account - Purchased");
    wseAccountButton.addEventListener("click", function() {
        Player.hasWseAccount = true;
        initStockMarket();
        initSymbolToStockMap();
        Player.loseMoney(CONSTANTS.WSEAccountCost);
        displayStockMarketContent();
        return false;
    });

    //Purchase TIX API Access account
    var tixApiAccessButton = clearEventListeners("stock-market-buy-tix-api");
    stylePurchaseButton(tixApiAccessButton, CONSTANTS.TIXAPICost, Player.hasTixApiAccess,
                        "Buy Trade Information eXchange (TIX) API Access - " + numeralWrapper.format(CONSTANTS.TIXAPICost, '($0.000a)'),
                        "TIX API Access - Purchased");
    tixApiAccessButton.addEventListener("click", function() {
        Player.hasTixApiAccess = true;
        Player.loseMoney(CONSTANTS.TIXAPICost);
        displayStockMarketContent();
        return false;
    });

    //Purchase Four Sigma Market Data Feed
    var marketDataButton = clearEventListeners("stock-market-buy-4s-data");
    stylePurchaseButton(marketDataButton, getStockMarket4SDataCost(), Player.has4SData,
                        "Buy 4S Market Data Access - " + numeralWrapper.format(getStockMarket4SDataCost(), '($0.000a)'),
                        "4S Market Data - Purchased");
    marketDataButton.addEventListener("click", function() {
        if (Player.money.lt(getStockMarket4SDataCost())) { return false; }
        Player.has4SData = true;
        Player.loseMoney(getStockMarket4SDataCost());
        displayStockMarketContent();
        return false;
    });
    marketDataButton.appendChild(createElement("span", {
        class:"tooltiptext",
        innerText:"Lets you view additional pricing and volatility information about stocks"
    }));
    marketDataButton.style.marginRight = "2px"; //Adjusts following help tip to be slightly closer

    //4S Market Data Help Tip
    var marketDataHelpTip = clearEventListeners("stock-market-4s-data-help-tip");
    marketDataHelpTip.style.marginTop = "10px";
    marketDataHelpTip.addEventListener("click", ()=>{
        dialogBoxCreate("Access to the 4S Market Data feed will display two additional pieces " +
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
                        "The more volatile a stock is, the more its price forecast will change.");
        return false;
    });

    //Purchase Four Sigma Market Data TIX API (Requires TIX API Access)
    var marketDataTixButton = clearEventListeners("stock-market-buy-4s-tix-api");
    stylePurchaseButton(marketDataTixButton, getStockMarket4STixApiCost(), Player.has4SDataTixApi,
                        "Buy 4S Market Data TIX API Access - " + numeralWrapper.format(getStockMarket4STixApiCost(), '($0.000a)'),
                        "4S Market Data TIX API - Purchased");
    if (Player.hasTixApiAccess) {
        marketDataTixButton.addEventListener("click", function() {
            if (Player.money.lt(getStockMarket4STixApiCost())) { return false; }
            Player.has4SDataTixApi = true;
            Player.loseMoney(getStockMarket4STixApiCost());
            displayStockMarketContent();
            return false;
        });
        marketDataTixButton.appendChild(createElement("span", {
            class:"tooltiptext",
            innerText:"Lets you access 4S Market Data through Netscript"
        }));
    } else {
        marketDataTixButton.classList.remove("a-link-button");
        marketDataTixButton.classList.remove("a-link-button-bought");
        marketDataTixButton.classList.remove("a-link-button-inactive");
        marketDataTixButton.classList.add("a-link-button-inactive");
        marketDataTixButton.appendChild(createElement("span", {
            class:"tooltiptext",
            innerText:"Requires TIX API Access"
        }));
    }


    var stockList = document.getElementById("stock-market-list");
    if (stockList == null) {return;}

    //UI Elements that should only appear if you have WSE account access
    var commissionText     = document.getElementById("stock-market-commission");
    var modeBtn            = document.getElementById("stock-market-mode");
    var expandBtn          = document.getElementById("stock-market-expand-tickers");
    var collapseBtn        = document.getElementById("stock-market-collapse-tickers");
    var watchlistFilter    = document.getElementById("stock-market-watchlist-filter");
    var watchlistUpdateBtn = document.getElementById("stock-market-watchlist-filter-update");

    //If Player doesn't have account, clear stocks UI and return
    if (!Player.hasWseAccount) {
        stockMarketContentCreated = false;
        while (stockList.firstChild) {
            stockList.removeChild(stockList.firstChild);
        }
        commissionText.style.visibility = "hidden";
        modeBtn.style.visibility = "hidden";
        expandBtn.style.visibility = "hidden";
        collapseBtn.style.visibility = "hidden";
        watchlistFilter.style.visibility = "hidden";
        watchlistUpdateBtn.style.visibility = "hidden";
        return;
    } else {
        commissionText.style.visibility = "visible";
        modeBtn.style.visibility = "visible";
        expandBtn.style.visibility = "visible";
        collapseBtn.style.visibility = "visible";
        watchlistFilter.style.visibility = "visible";
        watchlistUpdateBtn.style.visibility = "visible";
    }

    //Create stock market content if you have an account
    if (!stockMarketContentCreated && Player.hasWseAccount) {
        console.log("Creating Stock Market UI");
        commissionText.innerHTML =
            "Commission Fees: Every transaction you make has a " +
            numeralWrapper.format(CONSTANTS.StockMarketCommission, '($0.000a)') + " commission fee.<br><br>" +
            "WARNING: When you reset after installing Augmentations, the Stock Market is reset. " +
            "This means all your positions are lost, so make sure to sell your stocks before installing " +
            "Augmentations!";

        var investopediaButton = clearEventListeners("stock-market-investopedia");
        investopediaButton.addEventListener("click", function() {
            var txt = "When making a transaction on the stock market, there are two " +
                "types of positions: Long and Short. A Long position is the typical " +
                "scenario where you buy a stock and earn a profit if the price of that " +
                "stock increases. Meanwhile, a Short position is the exact opposite. " +
                "In a Short position you purchase shares of a stock and earn a profit " +
                "if the price of that stock decreases. This is also called 'shorting' a stock.<br><br>" +
                "NOTE: Shorting stocks is not available immediately, and must be unlocked later on in the game.<br><br>" +
                "There are three different types of orders you can make to buy or sell " +
                "stocks on the exchange: Market Order, Limit Order, and Stop Order. " +
                "Note that Limit Orders and Stop Orders are not available immediately, and must be unlocked " +
                "later on in the game.<br><br>" +
                "When you place a Market Order to buy or sell a stock, the order executes " +
                "immediately at whatever the current price of the stock is. For example " +
                "if you choose to short a stock with 5000 shares using a Market Order, " +
                "you immediately purchase those 5000 shares in a Short position at whatever " +
                "the current market price is for that stock.<br><br>" +
                "A Limit Order is an order that only executes under certain conditions. " +
                "A Limit Order is used to buy or sell a stock at a specified price or better. " +
                "For example, lets say you purchased a Long position of 100 shares of some stock " +
                "at a price of $10 per share. You can place a Limit Order to sell those 100 shares " +
                "at $50 or better. The Limit Order will execute when the price of the stock reaches a  " +
                "value of $50 or higher.<br><br>" +
                "A Stop Order is the opposite of a Limit Order. It is used to buy or sell a stock " +
                "at a specified price (before the price gets 'worse'). For example, lets say you purchased " +
                "a Short position of 100 shares of some stock at a price of $100 per share. " +
                "The current price of the stock is $80 (a profit of $20 per share). You can place a " +
                "Stop Order to sell the Short position if the stock's price reaches $90 or higher. " +
                "This can be used to lock in your profits and limit any losses.<br><br>" +
                "Here is a summary of how each order works and when they execute:<br><br>" +
                "In a LONG Position:<br><br>" +
                "A Limit Order to buy will execute if the stock's price <= order's price<br>" +
                "A Limit Order to sell will execute if the stock's price >= order's price<br>" +
                "A Stop Order to buy will execute if the stock's price >= order's price<br>" +
                "A Stop Order to sell will execute if the stock's price <= order's price<br><br>" +
                "In a SHORT Position:<br><br>" +
                "A Limit Order to buy will execute if the stock's price >= order's price<br>" +
                "A Limit Order to sell will execute if the stock's price <= order's price<br>" +
                "A Stop Order to buy will execute if the stock's price <= order's price<br>" +
                "A Stop Order to sell will execute if the stock's price >= order's price.";
            dialogBoxCreate(txt);
            return false;
        });

        //Switch to Portfolio Mode Button
        if (modeBtn) {
            stockMarketPortfolioMode = false;
            modeBtn.innerHTML = "Switch to 'Portfolio' Mode" +
                "<span class='tooltiptext'>Displays only the stocks for which you have shares or orders</span>";
            modeBtn.addEventListener("click", switchToPortfolioMode);
        }

        //Expand/Collapse tickers buttons
        var stockList = document.getElementById("stock-market-list");
        if (expandBtn) {
            expandBtn.addEventListener("click", ()=>{
                var tickerHdrs = stockList.getElementsByClassName("accordion-header");
                for (var i = 0; i < tickerHdrs.length; ++i) {
                    if (!tickerHdrs[i].classList.contains("active")) {
                        tickerHdrs[i].click();
                    }
                }
            });
        }
        if (collapseBtn) {
            collapseBtn.addEventListener("click",()=>{
                var tickerHdrs = stockList.getElementsByClassName("accordion-header");
                for (var i = 0; i < tickerHdrs.length; ++i) {
                    if (tickerHdrs[i].classList.contains("active")) {
                        tickerHdrs[i].click();
                    }
                }
            });
        }

        //Watchlish filter
        if (watchlistFilter && watchlistUpdateBtn) {
            //Initialize value in watchlist
            if (StockMarket.watchlistFilter) {
                watchlistFilter.value = StockMarket.watchlistFilter; //Remove whitespace
            }
            watchlistUpdateBtn.addEventListener("click", ()=> {
                let filterValue = watchlistFilter.value.toString();
                StockMarket.watchlistFilter = filterValue.replace(/\s/g, '');
                if (stockMarketPortfolioMode) {
                    switchToPortfolioMode();
                } else {
                    switchToDisplayAllMode();
                }
            });
            watchlistFilter.addEventListener("keyup", (e)=>{
                e.preventDefault();
                if (e.keyCode === KEY.ENTER) {watchlistUpdateBtn.click();}
            })
        } else {
            console.warn("Stock Market Watchlist DOM elements could not be found");
        }

        createAllStockTickers();
        stockMarketContentCreated = true;
    }

    if (Player.hasWseAccount) {
        for (var name in StockMarket) {
            if (StockMarket.hasOwnProperty(name)) {
                var stock = StockMarket[name];
                if (stock instanceof Stock) {
                    updateStockTicker(stock, null);
                    updateStockOrderList(stock);
                }
            }
        }
    }
}

//Displays only stocks you have position/order in
function switchToPortfolioMode() {
    stockMarketPortfolioMode = true;
    var modeBtn = clearEventListeners("stock-market-mode");
    if (modeBtn) {
        modeBtn.innerHTML = "Switch to 'All stocks' Mode" +
            "<span class='tooltiptext'>Displays all stocks on the WSE</span>";
        modeBtn.addEventListener("click", switchToDisplayAllMode);
    }
    createAllStockTickers();
}

//Displays all stocks
function switchToDisplayAllMode() {
    stockMarketPortfolioMode = false;
    var modeBtn = clearEventListeners("stock-market-mode");
    if (modeBtn) {
        modeBtn.innerHTML = "Switch to 'Portfolio' Mode" +
            "<span class='tooltiptext'>Displays only the stocks for which you have shares or orders</span>";
        modeBtn.addEventListener("click", switchToPortfolioMode);
    }
    createAllStockTickers();
}

function createAllStockTickers() {
    var stockList = document.getElementById("stock-market-list");
    if (stockList == null) {
        exceptionAlert("Error creating Stock Tickers UI. DOM element with ID 'stock-market-list' could not be found");
    }
    removeChildrenFromElement(stockList);

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
        orderBook = StockMarket["Orders"];
    }

    let watchlist = null;
    if (StockMarket.watchlistFilter != null && StockMarket.watchlistFilter !== "") {
        let filter = StockMarket.watchlistFilter.replace(/\s/g, '');
        watchlist = filter.split(",");
    }

    for (var name in StockMarket) {
        if (StockMarket.hasOwnProperty(name)) {
            var stock = StockMarket[name];
            if (!(stock instanceof Stock)) {continue;} //orders property is an array
            if (watchlist && !watchlist.includes(stock.symbol)) {continue;} //Watchlist filtering

            let stockOrders = orderBook[stock.symbol];
            if (stockMarketPortfolioMode) {
                if (stock.playerShares === 0 && stock.playerShortShares === 0 &&
                    stockOrders.length === 0) {continue;}
            }
            createStockTicker(stock);
        }
    }
    setStockTickerClickHandlers(); //Clicking headers opens/closes panels
}

function createStockTicker(stock) {
    if (!(stock instanceof Stock)) {
        console.log("Invalid stock in createStockSticker()");
        return;
    }
    var tickerId = "stock-market-ticker-" + stock.symbol;
    var li = document.createElement("li"), hdr = document.createElement("button"), hdrpre = document.createElement("pre");;
    hdr.classList.add("accordion-header");
    hdr.setAttribute("id", tickerId + "-hdr");
    hdrpre.textContent = stock.name + "  -  " + stock.symbol + "  -  " + numeralWrapper.format(stock.price, '($0.000a)');
    hdr.appendChild(hdrpre);

    //Div for entire panel
    var stockDiv = document.createElement("div");
    stockDiv.classList.add("accordion-panel");
    stockDiv.setAttribute("id", tickerId + "-panel");

    /* Create panel DOM */
    var qtyInput = document.createElement("input"),
        longShortSelect = document.createElement("select", {class: "dropdown"}),
        orderTypeSelect = document.createElement("select", {class: "dropdown"}),
        buyButton = document.createElement("span"),
        sellButton = document.createElement("span"),
        buyMaxButton = document.createElement("span"),
        sellAllButton = document.createElement("span"),
        positionTxt = document.createElement("p"),
        orderList = document.createElement("ul");

    qtyInput.classList.add("stock-market-input");
    qtyInput.placeholder = "Quantity (Shares)";
    qtyInput.setAttribute("id", tickerId + "-qty-input");
    qtyInput.setAttribute("onkeydown", "return ( event.ctrlKey || event.altKey " +
                          " || (47<event.keyCode && event.keyCode<58 && event.shiftKey==false) " +
                          " || (95<event.keyCode && event.keyCode<106) " +
                          " || (event.keyCode==8) || (event.keyCode==9) " +
                          " || (event.keyCode>34 && event.keyCode<40) " +
                          " || (event.keyCode==46) )");

    longShortSelect.classList.add("stock-market-input");
    longShortSelect.classList.add("dropdown");
    longShortSelect.setAttribute("id", tickerId + "-pos-selector");
    var longOpt = document.createElement("option");
    longOpt.text = "Long";
    longShortSelect.add(longOpt);
    if (Player.bitNodeN === 8 || (hasWallStreetSF && wallStreetSFLvl >= 2)) {
        var shortOpt = document.createElement("option");
        shortOpt.text = "Short";
        longShortSelect.add(shortOpt);
    }

    orderTypeSelect.classList.add("stock-market-input");
    orderTypeSelect.classList.add("dropdown");
    orderTypeSelect.setAttribute("id", tickerId + "-order-selector");
    var marketOpt = document.createElement("option");
    marketOpt.text = "Market Order";
    orderTypeSelect.add(marketOpt);
    if (Player.bitNodeN === 8 || (hasWallStreetSF && wallStreetSFLvl >= 3)) {
        var limitOpt = document.createElement("option");
        limitOpt.text = "Limit Order";
        orderTypeSelect.add(limitOpt);
        var stopOpt = document.createElement("option");
        stopOpt.text = "Stop Order";
        orderTypeSelect.add(stopOpt);
    }

    buyButton.classList.add("stock-market-input");
    buyButton.classList.add("a-link-button");
    buyButton.innerHTML = "Buy";
    buyButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        var shares = Number(document.getElementById(tickerId + "-qty-input").value);
        if (isNaN(shares)) {return false;}
        switch (ordType) {
            case "Market Order":
                pos === PositionTypes.Long ? buyStock(stock, shares) : shortStock(stock, shares, null);
                break;
            case "Limit Order":
            case "Stop Order":
                var yesBtn = yesNoTxtInpBoxGetYesButton(),
                    noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerText = "Place Buy " + ordType;
                noBtn.innerText = "Cancel Order";
                yesBtn.addEventListener("click", ()=>{
                    var price = Number(yesNoTxtInpBoxGetInput()), type;
                    if (ordType === "Limit Order") {
                        type = OrderTypes.LimitBuy;
                    } else {
                        type = OrderTypes.StopBuy;
                    }
                    placeOrder(stock, shares, price, type, pos);
                    yesNoTxtInpBoxClose();
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Enter the price for your " + ordType);
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    sellButton.classList.add("stock-market-input");
    sellButton.classList.add("a-link-button");
    sellButton.innerHTML = "Sell";
    sellButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        var shares = Number(document.getElementById(tickerId + "-qty-input").value);
        if (isNaN(shares)) {return false;}
        switch (ordType) {
            case "Market Order":
                pos === PositionTypes.Long ? sellStock(stock, shares) : sellShort(stock, shares, null);
                break;
            case "Limit Order":
            case "Stop Order":
                var yesBtn = yesNoTxtInpBoxGetYesButton(),
                    noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerText = "Place Sell " + ordType;
                noBtn.innerText = "Cancel Order";
                yesBtn.addEventListener("click", ()=>{
                    var price = Number(yesNoTxtInpBoxGetInput()), type;
                    if (ordType === "Limit Order") {
                        type = OrderTypes.LimitSell;
                    } else {
                        type = OrderTypes.StopSell;
                    }
                    yesNoTxtInpBoxClose();
                    placeOrder(stock, shares, price, type, pos);
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Enter the price for your " + ordType);
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    buyMaxButton.classList.add("stock-market-input");
    buyMaxButton.classList.add("a-link-button");
    buyMaxButton.innerHTML = "Buy MAX";
    buyMaxButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        var money = Player.money.toNumber();
        switch (ordType) {
            case "Market Order":
                var shares = Math.floor((money - COMM) / stock.price);
                shares = Math.min(shares, Math.round(stock.maxShares - stock.playerShares - stock.playerShortShares));
                pos === PositionTypes.Long ? buyStock(stock, shares) : shortStock(stock, shares, null);
                break;
            case "Limit Order":
            case "Stop Order":
                var yesBtn = yesNoTxtInpBoxGetYesButton(),
                    noBtn = yesNoTxtInpBoxGetNoButton();
                yesBtn.innerText = "Place Buy " + ordType;
                noBtn.innerText = "Cancel Order";
                yesBtn.addEventListener("click", ()=>{
                    var price = Number(yesNoTxtInpBoxGetInput()), type;
                    if (ordType === "Limit Order") {
                        type = OrderTypes.LimitBuy;
                    } else {
                        type = OrderTypes.StopBuy;
                    }
                    var shares = Math.floor((money-COMM) / price);
                    shares = Math.min(shares, Math.round(stock.maxShares - stock.playerShares - stock.playerShortShares));
                    placeOrder(stock, shares, price, type, pos);
                    yesNoTxtInpBoxClose();
                });
                noBtn.addEventListener("click", ()=>{
                    yesNoTxtInpBoxClose();
                });
                yesNoTxtInpBoxCreate("Enter the price for your " + ordType);
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    sellAllButton.classList.add("stock-market-input");
    sellAllButton.classList.add("a-link-button");
    sellAllButton.innerHTML = "Sell ALL";
    sellAllButton.addEventListener("click", ()=>{
        var pos = longShortSelect.options[longShortSelect.selectedIndex].text;
        pos === "Long" ? pos = PositionTypes.Long : pos = PositionTypes.Short;
        var ordType = orderTypeSelect.options[orderTypeSelect.selectedIndex].text;
        switch (ordType) {
            case "Market Order":
                if (pos === PositionTypes.Long) {
                    var shares = stock.playerShares;
                    sellStock(stock, shares);
                } else {
                    var shares = stock.playerShortShares;
                    sellShort(stock, shares, null);
                }
                break;
            case "Limit Order":
            case "Stop Order":
                dialogBoxCreate("ERROR: 'Sell All' only works for Market Orders")
                break;
            default:
                console.log("ERROR: Invalid order type");
                break;
        }
        return false;
    });

    positionTxt.setAttribute("id", tickerId + "-position-text");
    positionTxt.classList.add("stock-market-position-text");
    stock.posTxtEl = positionTxt;

    orderList.setAttribute("id", tickerId + "-order-list");
    orderList.classList.add("stock-market-order-list");

    stockDiv.appendChild(qtyInput);
    stockDiv.appendChild(longShortSelect);
    stockDiv.appendChild(orderTypeSelect);
    stockDiv.appendChild(buyButton);
    stockDiv.appendChild(sellButton);
    stockDiv.appendChild(buyMaxButton);
    stockDiv.appendChild(sellAllButton);
    stockDiv.appendChild(positionTxt);
    stockDiv.appendChild(orderList);

    li.appendChild(hdr);
    li.appendChild(stockDiv);
    document.getElementById("stock-market-list").appendChild(li);

    updateStockTicker(stock, true);
    updateStockPlayerPosition(stock);
    updateStockOrderList(stock);
}

function setStockTickerClickHandlers() {
    var stockList = document.getElementById("stock-market-list");
    var tickerHdrs = stockList.getElementsByClassName("accordion-header");
    if (tickerHdrs == null) {
        console.log("ERROR: Could not find header elements for stock tickers");
        return;
    }
    for (var i = 0; i < tickerHdrs.length; ++i) {
        tickerHdrs[i].onclick = function() {
            this.classList.toggle("active");

            var panel = this.nextElementSibling;
            if (panel.style.display === "block") {
                panel.style.display = "none";
            } else {
                panel.style.display = "block";
            }
        }
    }
}

// 'increase' argument is a boolean indicating whether the price increased or decreased
export function updateStockTicker(stock, increase) {
    if (!routing.isOn(Page.StockMarket)) { return; }
    if (!(stock instanceof Stock)) {
        console.log("Invalid stock in updateStockTicker():");
        console.log(stock);
        return;
    }
    var tickerId = "stock-market-ticker-" + stock.symbol;

    if (stock.playerShares > 0 || stock.playerShortShares > 0) {
        updateStockPlayerPosition(stock);
    }

    var hdr = document.getElementById(tickerId + "-hdr");

    if (hdr == null) {
        if (!stockMarketPortfolioMode) {
            let watchlist = StockMarket.watchlistFilter;
            if (watchlist !== "" && watchlist.includes(stock.symbol)) {
                console.log("ERROR: Couldn't find ticker element for stock: " + stock.symbol);
            }
        }
        return;
    }
    const stockPriceFormat = numeralWrapper.format(stock.price, '($0.000a)')
    let hdrText = `${stock.name}${" ".repeat(1 + formatHelpData.longestName - stock.name.length + (formatHelpData.longestSymbol-stock.symbol.length))}${stock.symbol} -${" ".repeat(10 - stockPriceFormat.length)}${stockPriceFormat}`;
    if (Player.has4SData) {
        hdrText += ` - Volatility: ${numeralWrapper.format(stock.mv, '0,0.00')}% - Price Forecast: `;
        hdrText += (stock.b?"+":"-").repeat(Math.floor(stock.otlkMag/10) + 1);
    }
    hdr.firstChild.textContent = hdrText;
    if (increase != null) {
        hdr.firstChild.style.color = increase ? "#66ff33" : "red";
    }
}

export function updateStockPlayerPosition(stock) {
    if (!routing.isOn(Page.StockMarket)) { return; }
    if (!(stock instanceof Stock)) {
        console.log("Invalid stock in updateStockPlayerPosition():");
        console.log(stock);
        return;
    }
    var tickerId = "stock-market-ticker-" + stock.symbol;

    if (stockMarketPortfolioMode) {
        if (stock.playerShares === 0 && stock.playerShortShares === 0 &&
            StockMarket["Orders"] && StockMarket["Orders"][stock.symbol] &&
            StockMarket["Orders"][stock.symbol].length === 0) {
            removeElementById(tickerId + "-hdr");
            removeElementById(tickerId + "-panel");
            return;
        } else {
            // If the ticker hasn't been created, create it (handles updating)
            // If it has been created, continue normally
            if (document.getElementById(tickerId + "-hdr") == null) {
                createStockTicker(stock);
                setStockTickerClickHandlers();
                return;
            }
        }
    }

    if (!(stock.posTxtEl instanceof Element)) {
        stock.posTxtEl = document.getElementById(tickerId + "-position-text");
    }
    if (stock.posTxtEl == null) {
        console.log("ERROR: Could not find stock position element for: " + stock.symbol);
        return;
    }

    // Calculate returns
    const totalCost = stock.playerShares * stock.playerAvgPx;
    let gains = (stock.price - stock.playerAvgPx) * stock.playerShares;
    let percentageGains = gains / totalCost;
    if (isNaN(percentageGains)) { percentageGains = 0; }

    const shortTotalCost = stock.playerShortShares * stock.playerAvgShortPx;
    let shortGains = (stock.playerAvgShortPx - stock.price) * stock.playerShortShares;
    let shortPercentageGains = shortGains/ shortTotalCost;
    if (isNaN(shortPercentageGains)) { shortPercentageGains = 0; }

    stock.posTxtEl.innerHTML =
        `Max Shares: ${numeralWrapper.format(stock.maxShares, "0.000a")}<br>` +
        `<p class="tooltip">Ask Price: ${numeralWrapper.formatMoney(stock.getAskPrice())}<span class="tooltiptext">See Investopedia for details on what this is</span></p><br>` +
        `<p class="tooltip">Bid Price: ${numeralWrapper.formatMoney(stock.getBidPrice())}<span class="tooltiptext">See Investopedia for details on what this is</span></p><br>` +
        "<h3 class='tooltip stock-market-position-text'>Long Position: " +
        "<span class='tooltiptext'>Shares in the long position will increase " +
        "in value if the price of the corresponding stock increases</span></h3>" +
        "<br>Shares: " + numeralWrapper.format(stock.playerShares, '0,0') +
        "<br>Average Price: " + numeralWrapper.format(stock.playerAvgPx, '$0.000a') +
        " (Total Cost: " + numeralWrapper.format(totalCost, '$0.000a') + ")" +
        "<br>Profit: " + numeralWrapper.format(gains, '$0.000a') +
                     " (" + numeralWrapper.format(percentageGains, '0.00%') + ")<br>";
        if (Player.bitNodeN === 8 || (hasWallStreetSF && wallStreetSFLvl >= 2)) {
            stock.posTxtEl.innerHTML +=
            "<br><h3 class='tooltip stock-market-position-text'>Short Position: " +
            "<span class='tooltiptext'>Shares in short position will increase " +
            "in value if the price of the corresponding stock decreases</span></h3>" +
            "<br>Shares: " + numeralWrapper.format(stock.playerShortShares, '0,0') +
            "<br>Average Price: " + numeralWrapper.formatMoney(stock.playerAvgShortPx) +
            " (Total Cost: " + numeralWrapper.formatMoney(shortTotalCost) + ")" +
            "<br>Profit: " + numeralWrapper.formatMoney(shortGains) +
                         " (" + numeralWrapper.format(shortPercentageGains, '0.00%') + ")" +
            "<br><br><h3 class='stock-market-position-text'>Orders:</h3>";
        }

}

function updateStockOrderList(stock) {
    if (!routing.isOn(Page.StockMarket)) {return;}
    var tickerId = "stock-market-ticker-" + stock.symbol;
    var orderList = document.getElementById(tickerId + "-order-list");
    if (orderList == null) {
        //Log only if its a valid error
        if (!stockMarketPortfolioMode) {
            let watchlist = StockMarket.watchlistFilter;
            if (watchlist !== "" && watchlist.includes(stock.symbol)) {
                console.log("ERROR: Could not find order list for " + stock.symbol);
            }
        }
        return;
    }

    var orderBook = StockMarket["Orders"];
    if (orderBook == null) {
        console.log("ERROR: Could not find order book in stock market");
        return;
    }
    var stockOrders = orderBook[stock.symbol];
    if (stockOrders == null) {
        console.log("ERROR: Could not find orders for: " + stock.symbol);
        return;
    }

    if (stockMarketPortfolioMode) {
        if (stock.playerShares === 0 && stock.playerShortShares === 0 &&
            StockMarket["Orders"] && StockMarket["Orders"][stock.symbol] &&
            StockMarket["Orders"][stock.symbol].length === 0) {
            removeElementById(tickerId + "-hdr");
            removeElementById(tickerId + "-panel");
            return;
        } else {
            //If the ticker hasn't been created, create it (handles updating)
            //If it has been created, continue normally
            if (document.getElementById(tickerId + "-hdr") == null) {
                createStockTicker(stock);
                setStockTickerClickHandlers();
                return;
            }
        }
    }

    // Remove everything from list
    while (orderList.firstChild) {
        orderList.removeChild(orderList.firstChild);
    }

    for (var i = 0; i < stockOrders.length; ++i) {
        (function() {
            var order = stockOrders[i];
            var li = document.createElement("li");
            li.style.padding = "4px";
            var posText = (order.pos === PositionTypes.Long ? "Long Position" : "Short Position");
            li.style.color = "white";
            li.innerText = order.type + " - " + posText + " - " +
                           order.shares + " @ " + numeralWrapper.format(order.price, '($0.000a)');

            var cancelButton = document.createElement("span");
            cancelButton.classList.add("stock-market-order-cancel-btn");
            cancelButton.classList.add("a-link-button");
            cancelButton.innerHTML = "Cancel Order";
            cancelButton.addEventListener("click", function() {
                cancelOrder({order: order}, null);
                return false;
            });
            li.appendChild(cancelButton);
            orderList.appendChild(li);
        }());

    }
}
