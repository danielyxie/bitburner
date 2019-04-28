import { Stock } from "./Stock";
import { PositionTypes } from "./data/PositionTypes";
import { CONSTANTS } from "../Constants";

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
    for (let i = 1; i < numIterations; ++i) {
        const amt = Math.min(stock.shareTxForMovement, remainingShares);
        totalCost += (amt * currPrice);
        remainingShares -= amt;

        // Price movement
        if (isLong) {
            currPrice *= (1 + (stock.priceMovementPerc / 100));
        } else {
            currPrice *= (1 - (stock.priceMovementPerc / 100));
        }
    }

    return totalCost + CONSTANTS.StockMarketCommission;
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

    // Calculate how many iterations of price changes we need to accoutn for
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
        const amt = Math.min(stock.shareTxForMovement, remainingShares);
        totalGain += calculateGain(currPrice, amt);
        remainingShares -= amt;

        // Price movement
        if (isLong) {
            currPrice *= (1 - (stock.priceMovementPerc / 100));
        } else {
            currPrice *= (1 + (stock.priceMovementPerc / 100));
        }
    }

    return totalGain - CONSTANTS.StockMarketCommission;
}
