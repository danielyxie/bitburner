import { Stock } from "./Stock";
import { PositionTypes } from "./data/PositionTypes";
import { CONSTANTS } from "../Constants";

/**
 * Given a stock, calculates the amount by which the stock price is multiplied
 * for an 'upward' price movement. This does not actually increase the stock's price,
 * just calculates the multiplier
 * @param {Stock} stock - Stock for price movement
 * @returns {number | null} Number by which stock's price should be multiplied. Null for invalid args
 */
export function calculateIncreasingPriceMovement(stock: Stock): number | null {
    if (!(stock instanceof Stock)) { return null; }

    return (1 + (stock.priceMovementPerc / 100));
}

/**
 * Given a stock, calculates the amount by which the stock price is multiplied
 * for a "downward" price movement. This does not actually increase the stock's price,
 * just calculates the multiplier
 * @param {Stock} stock - Stock for price movement
 * @returns {number | null} Number by which stock's price should be multiplied. Null for invalid args
 */
export function calculateDecreasingPriceMovement(stock: Stock): number | null {
    if (!(stock instanceof Stock)) { return null; }

    return (1 - (stock.priceMovementPerc / 100));
}


/**
 * Calculate the total cost of a "buy" transaction. This accounts for spread,
 * price movements, and commission.
 * @param {Stock} stock - Stock being purchased
 * @param {number} shares - Number of shares being transacted
 * @param {PositionTypes} posType - Long or short position
 * @returns {number | null} Total transaction cost. Returns null for an invalid transaction
 */
export function getBuyTransactionCost(stock: Stock, shares: number, posType: PositionTypes): number | null {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock)) { return null; }

    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);

    const isLong = (posType === PositionTypes.Long);

    // If the number of shares doesn't trigger a price movement, its a simple calculation
    if (shares <= stock.shareTxUntilMovement) {
        if (isLong) {
            return (shares * stock.getAskPrice()) + CONSTANTS.StockMarketCommission;
        } else {
            return (shares * stock.getBidPrice()) + CONSTANTS.StockMarketCommission;
        }
    }

    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);



    // The initial cost calculation takes care of the first "iteration"
    let currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();
    let totalCost = (stock.shareTxUntilMovement * currPrice);

    function processPriceMovement() {
        if (isLong) {
            currPrice *= calculateIncreasingPriceMovement(stock)!;
        } else {
            currPrice *= calculateDecreasingPriceMovement(stock)!;
        }
    }

    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();

        const amt = Math.min(stock.shareTxForMovement, remainingShares);
        totalCost += (amt * currPrice);
        remainingShares -= amt;
    }

    return totalCost + CONSTANTS.StockMarketCommission;
}

/**
 * Processes a buy transaction's resulting price movement.
 * @param {Stock} stock - Stock being purchased
 * @param {number} shares - Number of shares being transacted
 * @param {PositionTypes} posType - Long or short position
 */
export function processBuyTransactionPriceMovement(stock: Stock, shares: number, posType: PositionTypes): void {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock)) { return; }

    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);

    const isLong = (posType === PositionTypes.Long);

    // If the number of shares doesn't trigger a price movement, just return
    if (shares <= stock.shareTxUntilMovement) {
        stock.shareTxUntilMovement -= shares;
        return;
    }

    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    let currPrice = stock.price;
    function processPriceMovement() {
        if (isLong) {
            currPrice *= calculateIncreasingPriceMovement(stock)!;
        } else {
            currPrice *= calculateDecreasingPriceMovement(stock)!;
        }
    }

    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();
    }

    stock.price = currPrice;
    stock.shareTxUntilMovement = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovement) % stock.shareTxForMovement);
}

/**
 * Calculate the TOTAL amount of money gained from a sale (NOT net profit). This accounts
 * for spread, price movements, and commission.
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of sharse being transacted
 * @param {PositionTypes} posType - Long or short position
 * @returns {number | null} Amount of money gained from transaction. Returns null for an invalid transaction
 */
export function getSellTransactionGain(stock: Stock, shares: number, posType: PositionTypes): number | null {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock)) { return null; }

    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);

    const isLong = (posType === PositionTypes.Long);

    // If the number of shares doesn't trigger a price mvoement, its a simple calculation
    if (shares <= stock.shareTxUntilMovement) {
        if (isLong) {
            return (shares * stock.getBidPrice()) - CONSTANTS.StockMarketCommission;
        } else {
            // Calculating gains for a short position requires calculating the profit made
            const origCost = shares * stock.playerAvgShortPx;
            const profit = ((stock.playerAvgShortPx - stock.getAskPrice()) * shares) - CONSTANTS.StockMarketCommission;

            return origCost + profit;
        }
    }

    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    // Helper function to calculate gain for a single iteration
    function calculateGain(thisPrice: number, thisShares: number) {
        if (isLong) {
            return thisShares * thisPrice;
        } else {
            const origCost = thisShares * stock.playerAvgShortPx;
            const profit = ((stock.playerAvgShortPx - thisPrice) * thisShares);

            return origCost + profit;
        }
    }

    // The initial cost calculation takes care of the first "iteration"
    let currPrice = isLong ? stock.getBidPrice() : stock.getAskPrice();
    let totalGain = calculateGain(currPrice, stock.shareTxUntilMovement);
    for (let i = 1; i < numIterations; ++i) {
        // Price movement
        if (isLong) {
            currPrice *= calculateDecreasingPriceMovement(stock)!;
        } else {
            currPrice *= calculateIncreasingPriceMovement(stock)!;
        }

        const amt = Math.min(stock.shareTxForMovement, remainingShares);
        totalGain += calculateGain(currPrice, amt);
        remainingShares -= amt;
    }

    return totalGain - CONSTANTS.StockMarketCommission;
}

/**
 * Processes a sell transaction's resulting price movement
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of sharse being transacted
 * @param {PositionTypes} posType - Long or short position
 */
export function processSellTransactionPriceMovement(stock: Stock, shares: number, posType: PositionTypes): void {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock)) { return; }

    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);

    const isLong = (posType === PositionTypes.Long);

    if (shares <= stock.shareTxUntilMovement) {
        stock.shareTxUntilMovement -= shares;
        return;
    }

    // Calculate how many iterations of price changes we need to accoutn for
    let remainingShares = shares - stock.shareTxUntilMovement;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    let currPrice = stock.price;
    for (let i = 1; i < numIterations; ++i) {
        // Price movement
        if (isLong) {
            currPrice *= calculateDecreasingPriceMovement(stock)!;
        } else {
            currPrice *= calculateIncreasingPriceMovement(stock)!;
        }
    }

    stock.price = currPrice;
    stock.shareTxUntilMovement = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovement) % stock.shareTxForMovement);
}
