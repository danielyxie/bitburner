/**
 * Stock Market Helper Functions
 */
import { Stock } from "./Stock";
import { PositionTypes } from "./data/PositionTypes";
import { CONSTANTS } from "../Constants";

// Amount by which a stock's forecast changes during each price movement
export const forecastChangePerPriceMovement = 0.006;

/**
 * Calculate the total cost of a "buy" transaction. This accounts for spread and commission.
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
    if (isLong) {
        return (shares * stock.getAskPrice()) + CONSTANTS.StockMarketCommission;
    } else {
        return (shares * stock.getBidPrice()) + CONSTANTS.StockMarketCommission;
    }
}

/**
 * Calculate the TOTAL amount of money gained from a sale (NOT net profit). This accounts
 * for spread and commission.
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
    if (isLong) {
        return (shares * stock.getBidPrice()) - CONSTANTS.StockMarketCommission;
    } else {
        // Calculating gains for a short position requires calculating the profit made
        const origCost = shares * stock.playerAvgShortPx;
        const profit = ((stock.playerAvgShortPx - stock.getAskPrice()) * shares) - CONSTANTS.StockMarketCommission;

        return origCost + profit;
    }
}

/**
 * Processes a stock's change in forecast & second-order forecast
 * whenever it is transacted
 * @param {Stock} stock - Stock being sold
 * @param {number} shares - Number of sharse being transacted
 * @param {PositionTypes} posType - Long or short position
 */
export function processTransactionForecastMovement(stock: Stock, shares: number): void {
    if (isNaN(shares) || shares <= 0 || !(stock instanceof Stock)) { return; }

    // Cap the 'shares' arg at the stock's maximum shares. This'll prevent
    // hanging in the case when a really big number is passed in
    shares = Math.min(shares, stock.maxShares);

    // If there's only going to be one iteration at most
    const firstShares = stock.shareTxUntilMovement;
    if (shares <= firstShares) {
        stock.shareTxUntilMovement -= shares;
        if (stock.shareTxUntilMovement <= 0) {
            stock.shareTxUntilMovement = stock.shareTxForMovement;
            stock.influenceForecast(forecastChangePerPriceMovement);
            stock.influenceForecastForecast(forecastChangePerPriceMovement * (stock.mv / 100));
        }

        return;
    }

    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - firstShares;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    // If on the offchance we end up perfectly at the next price movement
    stock.shareTxUntilMovement = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovement) % stock.shareTxForMovement);
    if (stock.shareTxUntilMovement === stock.shareTxForMovement || stock.shareTxUntilMovement <= 0) {
        ++numIterations;
        stock.shareTxUntilMovement = stock.shareTxForMovement;
    }

    // Forecast always decreases in magnitude
    const forecastChange = forecastChangePerPriceMovement * (numIterations - 1);
    const forecastForecastChange = forecastChange * (stock.mv / 100);
    stock.influenceForecast(forecastChange);
    stock.influenceForecastForecast(forecastForecastChange);
}

/**
 * Calculate the maximum number of shares of a stock that can be purchased.
 * Handles mid-transaction price movements, both L and S positions, etc.
 * Used for the "Buy Max" button in the UI
 * @param {Stock} stock - Stock being purchased
 * @param {PositionTypes} posType - Long or short position
 * @param {number} money - Amount of money player has
 * @returns maximum number of shares that the player can purchase
 */
export function calculateBuyMaxAmount(stock: Stock, posType: PositionTypes, money: number): number {
    if (!(stock instanceof Stock)) { return 0; }

    const isLong = (posType === PositionTypes.Long);

    let remainingMoney = money - CONSTANTS.StockMarketCommission;
    let currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();

    return Math.floor(remainingMoney / currPrice);
}
