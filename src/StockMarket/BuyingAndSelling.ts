/**
 * Functions for buying/selling stocks. There are four functions total, two for
 * long positions and two for short positions.
 */
import { Stock } from "./Stock";
import {
    getBuyTransactionCost,
    getSellTransactionGain,
    processTransactionForecastMovement,
} from "./StockMarketHelpers";

import { PositionTypes } from "./data/PositionTypes";

import { CONSTANTS } from "../Constants";
import { WorkerScript } from "../Netscript/WorkerScript";
import { Player } from "../Player";

import { numeralWrapper } from "../ui/numeralFormat";

import { dialogBoxCreate } from "../../utils/DialogBox";

/**
* Each function takes an optional config object as its last argument
*/
interface IOptions {
    rerenderFn?: () => void;
    suppressDialog?: boolean;
}

/**
 * Attempt to buy a stock in the long position
 * @param {Stock} stock - Stock to buy
 * @param {number} shares - Number of shares to buy
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @param opts - Optional configuration for this function's behavior. See top of file
 * @returns {boolean} - true if successful, false otherwise
 */
export function buyStock(stock: Stock, shares: number, workerScript: WorkerScript | null=null, opts: IOptions={}): boolean {
    const tixApi = (workerScript instanceof WorkerScript);

    // Validate arguments
    shares = Math.round(shares);
    if (shares <= 0) { return false; }
    if (stock == null || isNaN(shares)) {
        if (tixApi) {
            workerScript!.log(`ERROR: buyStock() failed due to invalid arguments`);
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate("Failed to buy stock. This may be a bug, contact developer");
        }

        return false;
    }

    // Does player have enough money?
    const totalPrice = getBuyTransactionCost(stock, shares, PositionTypes.Long);
    if (totalPrice == null) { return false; }
    if (Player.money.lt(totalPrice)) {
        if (tixApi) {
            workerScript!.log(`ERROR: buyStock() failed because you do not have enough money to purchase this position. You need ${numeralWrapper.formatMoney(totalPrice)}`);
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate(`You do not have enough money to purchase this. You need ${numeralWrapper.formatMoney(totalPrice)}`);
        }

        return false;
    }

    // Would this purchase exceed the maximum number of shares?
    if (shares + stock.playerShares + stock.playerShortShares > stock.maxShares) {
        if (tixApi) {
            workerScript!.log(`ERROR: buyStock() failed because purchasing this many shares would exceed ${stock.symbol}'s maximum number of shares`);
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate(`You cannot purchase this many shares. ${stock.symbol} has a maximum of ${numeralWrapper.formatBigNumber(stock.maxShares)} shares.`);
        }

        return false;
    }

    const origTotal = stock.playerShares * stock.playerAvgPx;
    Player.loseMoney(totalPrice);
    const newTotal = origTotal + totalPrice - CONSTANTS.StockMarketCommission;
    stock.playerShares = Math.round(stock.playerShares + shares);
    stock.playerAvgPx = newTotal / stock.playerShares;
    processTransactionForecastMovement(stock, shares);
    if (opts.rerenderFn != null && typeof opts.rerenderFn === "function") {
        opts.rerenderFn();
    }

    const resultTxt = `Bought ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol} for ${numeralWrapper.formatMoney(totalPrice)}. ` +
                      `Paid ${numeralWrapper.formatMoney(CONSTANTS.StockMarketCommission)} in commission fees.`
    if (tixApi) {
        if (workerScript!.shouldLog("buyStock")) { workerScript!.log(resultTxt); }
    } else if (opts.suppressDialog !== true) {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

/**
 * Attempt to sell a stock in the long position
 * @param {Stock} stock - Stock to sell
 * @param {number} shares - Number of shares to sell
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @param opts - Optional configuration for this function's behavior. See top of file
 * returns {boolean} - true if successfully sells given number of shares OR MAX owned, false otherwise
 */
export function sellStock(stock: Stock, shares: number, workerScript: WorkerScript | null=null, opts: IOptions={}): boolean {
    const tixApi = (workerScript instanceof WorkerScript);

    // Sanitize/Validate arguments
    if (stock == null || shares < 0 || isNaN(shares)) {
        if (tixApi) {
            workerScript!.log(`ERROR: sellStock() failed due to invalid arguments`);
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate("Failed to sell stock. This is probably due to an invalid quantity. Otherwise, this may be a bug, contact developer");
        }

        return false;
    }
    shares = Math.round(shares);
    if (shares > stock.playerShares) { shares = stock.playerShares; }
    if (shares === 0) { return false; }

    const gains = getSellTransactionGain(stock, shares, PositionTypes.Long);
    if (gains == null) { return false; }
    let netProfit = gains - (stock.playerAvgPx * shares);
    if (isNaN(netProfit)) { netProfit = 0; }
    Player.gainMoney(gains);
    Player.recordMoneySource(netProfit, "stock");
    if (tixApi) {
        workerScript!.scriptRef.onlineMoneyMade += netProfit;
        Player.scriptProdSinceLastAug += netProfit;
    }

    stock.playerShares = Math.round(stock.playerShares - shares);
    if (stock.playerShares === 0) {
        stock.playerAvgPx = 0;
    }

    processTransactionForecastMovement(stock, shares);

    if (opts.rerenderFn != null && typeof opts.rerenderFn === "function") {
        opts.rerenderFn();
    }

    const resultTxt = `Sold ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol}. ` +
                      `After commissions, you gained a total of ${numeralWrapper.formatMoney(gains)}.`;
    if (tixApi) {
        if (workerScript!.shouldLog("sellStock")) { workerScript!.log(resultTxt); }
    } else if (opts.suppressDialog !== true)  {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

/**
 * Attempt to buy a stock in the short position
 * @param {Stock} stock - Stock to sell
 * @param {number} shares - Number of shares to short
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @param opts - Optional configuration for this function's behavior. See top of file
 * @returns {boolean} - true if successful, false otherwise
 */
export function shortStock(stock: Stock, shares: number, workerScript: WorkerScript | null=null, opts: IOptions={}): boolean {
    const tixApi = (workerScript instanceof WorkerScript);

    // Validate arguments
    shares = Math.round(shares);
    if (shares <= 0) { return false; }
    if (stock == null || isNaN(shares)) {
        if (tixApi) {
            workerScript!.log("ERROR: shortStock() failed because of invalid arguments.");
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate("Failed to initiate a short position in a stock. This is probably " +
                            "due to an invalid quantity. Otherwise, this may be a bug,  so contact developer");
        }
        return false;
    }

    // Does the player have enough money?
    const totalPrice = getBuyTransactionCost(stock, shares, PositionTypes.Short);
    if (totalPrice == null) { return false; }
    if (Player.money.lt(totalPrice)) {
        if (tixApi) {
            workerScript!.log("ERROR: shortStock() failed because you do not have enough " +
                             "money to purchase this short position. You need " +
                             numeralWrapper.formatMoney(totalPrice));
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate("You do not have enough money to purchase this short position. You need " +
                            numeralWrapper.formatMoney(totalPrice));
        }

        return false;
    }

    // Would this purchase exceed the maximum number of shares?
    if (shares + stock.playerShares + stock.playerShortShares > stock.maxShares) {
        if (tixApi) {
            workerScript!.log(`ERROR: shortStock() failed because purchasing this many short shares would exceed ${stock.symbol}'s maximum number of shares.`);
        } else if (opts.suppressDialog !== true) {
            dialogBoxCreate(`You cannot purchase this many shares. ${stock.symbol} has a maximum of ${stock.maxShares} shares.`);
        }

        return false;
    }

    const origTotal = stock.playerShortShares * stock.playerAvgShortPx;
    Player.loseMoney(totalPrice);
    const newTotal = origTotal + totalPrice - CONSTANTS.StockMarketCommission;
    stock.playerShortShares = Math.round(stock.playerShortShares + shares);
    stock.playerAvgShortPx = newTotal / stock.playerShortShares;
    processTransactionForecastMovement(stock, shares);

    if (opts.rerenderFn != null && typeof opts.rerenderFn === "function") {
        opts.rerenderFn();
    }

    const resultTxt = `Bought a short position of ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol} ` +
                      `for ${numeralWrapper.formatMoney(totalPrice)}. Paid ${numeralWrapper.formatMoney(CONSTANTS.StockMarketCommission)} ` +
                      `in commission fees.`;
    if (tixApi) {
        if (workerScript!.shouldLog("shortStock")) { workerScript!.log(resultTxt); }
    } else if (!opts.suppressDialog) {
        dialogBoxCreate(resultTxt);
    }

    return true;
}

/**
 * Attempt to sell a stock in the short position
 * @param {Stock} stock - Stock to sell
 * @param {number} shares - Number of shares to sell
 * @param {WorkerScript} workerScript - If this is being called through Netscript
 * @param opts - Optional configuration for this function's behavior. See top of file
 * @returns {boolean} true if successfully sells given amount OR max owned, false otherwise
 */
export function sellShort(stock: Stock, shares: number, workerScript: WorkerScript | null=null, opts: IOptions={}): boolean {
    const tixApi = (workerScript instanceof WorkerScript);

    if (stock == null || isNaN(shares) || shares < 0) {
        if (tixApi) {
            workerScript!.log("ERROR: sellShort() failed because of invalid arguments.");
        } else if (!opts.suppressDialog) {
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
            workerScript!.log(`Failed to sell short position in a stock. This is probably either due to invalid arguments, or a bug`);
        } else if (!opts.suppressDialog) {
            dialogBoxCreate(`Failed to sell short position in a stock. This is probably either due to invalid arguments, or a bug`);
        }

        return false;
    }
    let profit = totalGain - origCost;
    if (isNaN(profit)) { profit = 0; }
    Player.gainMoney(totalGain);
    Player.recordMoneySource(profit, "stock");
    if (tixApi) {
        workerScript!.scriptRef.onlineMoneyMade += profit;
        Player.scriptProdSinceLastAug += profit;
    }

    stock.playerShortShares = Math.round(stock.playerShortShares - shares);
    if (stock.playerShortShares === 0) {
        stock.playerAvgShortPx = 0;
    }
    processTransactionForecastMovement(stock, shares);

    if (opts.rerenderFn != null && typeof opts.rerenderFn === "function") {
        opts.rerenderFn();
    }

    const resultTxt = `Sold your short position of ${numeralWrapper.format(shares, '0,0')} shares of ${stock.symbol}. ` +
                      `After commissions, you gained a total of ${numeralWrapper.formatMoney(totalGain)}`;
    if (tixApi) {
        if (workerScript!.shouldLog("sellShort")) { workerScript!.log(resultTxt); }
    } else if (!opts.suppressDialog) {
        dialogBoxCreate(resultTxt);
    }

    return true;
}
