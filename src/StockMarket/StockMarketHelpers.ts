import { Stock } from "./Stock";
import { PositionTypes } from "./data/PositionTypes";
import { CONSTANTS } from "../Constants";

// Amount by which a stock's forecast changes during each price movement
export const forecastChangePerPriceMovement = 0.01;

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
    if (isLong) {
        if (shares <= stock.shareTxUntilMovementUp) {
            return (shares * stock.getAskPrice()) + CONSTANTS.StockMarketCommission;
        }
    } else {
        if (shares <= stock.shareTxUntilMovementDown) {
            return (shares * stock.getBidPrice()) + CONSTANTS.StockMarketCommission;
        }
    }

    // Calculate how many iterations of price changes we need to account for
    const firstShares = isLong ? stock.shareTxUntilMovementUp : stock.shareTxUntilMovementDown;
    let remainingShares = shares - firstShares;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    // The initial cost calculation takes care of the first "iteration"
    let currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();
    let totalCost = (firstShares * currPrice);

    const increasingMvmt = calculateIncreasingPriceMovement(stock)!;
    const decreasingMvmt = calculateDecreasingPriceMovement(stock)!;

    function processPriceMovement() {
        if (isLong) {
            currPrice *= increasingMvmt;
        } else {
            currPrice *= decreasingMvmt;
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
 * Processes a buy transaction's resulting price AND forecast movement.
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

    let currPrice = stock.price;
    function processPriceMovement() {
        if (isLong) {
            currPrice *= calculateIncreasingPriceMovement(stock)!;
        } else {
            currPrice *= calculateDecreasingPriceMovement(stock)!;
        }
    }

    // If there's only going to be one iteration
    const firstShares = isLong ? stock.shareTxUntilMovementUp : stock.shareTxUntilMovementDown;
    if (shares <= firstShares) {
        function triggerMovement() {
            processPriceMovement();
            stock.changePrice(currPrice);
            stock.otlkMag -= (forecastChangePerPriceMovement);
        }

        if (isLong) {
            stock.shareTxUntilMovementUp -= shares;
            if (stock.shareTxUntilMovementUp <= 0) {
                stock.shareTxUntilMovementUp = stock.shareTxForMovement;
                triggerMovement();
            }
        } else {
            stock.shareTxUntilMovementDown -= shares;
            if (stock.shareTxUntilMovementDown <= 0) {
                stock.shareTxUntilMovementDown = stock.shareTxForMovement;
                triggerMovement();
            }
        }

        return;
    }

    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - firstShares;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();
    }

    // If on the offchance we end up perfectly at the next price movement
    if (isLong) {
        stock.shareTxUntilMovementUp = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovementUp) % stock.shareTxForMovement);
        if (stock.shareTxUntilMovementUp === stock.shareTxForMovement || stock.shareTxUntilMovementUp <= 0) {
            // The shareTxUntilMovementUp ended up at 0 at the end of the "processing"
            ++numIterations;
            stock.shareTxUntilMovementUp = stock.shareTxForMovement;
            processPriceMovement();
        }
    } else {
        stock.shareTxUntilMovementDown = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovementDown) % stock.shareTxForMovement);
        if (stock.shareTxUntilMovementDown === stock.shareTxForMovement || stock.shareTxUntilMovementDown <= 0) {
            // The shareTxUntilMovementDown ended up at 0 at the end of the "processing"
            ++numIterations;
            stock.shareTxUntilMovementDown = stock.shareTxForMovement;
            processPriceMovement();
        }
    }

    stock.changePrice(currPrice);

    // Forecast always decreases in magnitude
    const forecastChange = Math.min(5, forecastChangePerPriceMovement * (numIterations - 1));
    stock.otlkMag -= forecastChange;
    if (stock.otlkMag < 0.1) {
        stock.otlkMag = 0.1;
    }
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
    const firstShares = isLong ? stock.shareTxUntilMovementDown : stock.shareTxUntilMovementUp;

    // If the number of shares doesn't trigger a price mvoement, its a simple calculation
    if (shares <= firstShares) {
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
    let remainingShares = shares - firstShares;
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
    let totalGain = calculateGain(currPrice, firstShares);
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
    const firstShares = isLong ? stock.shareTxUntilMovementDown : stock.shareTxUntilMovementUp;

    let currPrice = stock.price;
    function processPriceMovement() {
        if (isLong) {
            currPrice *= calculateDecreasingPriceMovement(stock)!;
        } else {
            currPrice *= calculateIncreasingPriceMovement(stock)!;
        }
    }

    // If there's only going to be one iteration at most
    if (shares <= firstShares) {
        function triggerPriceMovement() {
            processPriceMovement();
            stock.changePrice(currPrice);
            stock.otlkMag -= (forecastChangePerPriceMovement);
        }

        if (isLong) {
            stock.shareTxUntilMovementDown -= shares;
            if (stock.shareTxUntilMovementDown <= 0) {
                stock.shareTxUntilMovementDown = stock.shareTxForMovement;
                triggerPriceMovement();
            }
        } else {
            stock.shareTxUntilMovementUp -= shares;
            if (stock.shareTxUntilMovementUp <= 0) {
                stock.shareTxUntilMovementUp = stock.shareTxForMovement;
                triggerPriceMovement();
            }
        }


        return;
    }

    // Calculate how many iterations of price changes we need to account for
    let remainingShares = shares - firstShares;
    let numIterations = 1 + Math.ceil(remainingShares / stock.shareTxForMovement);

    for (let i = 1; i < numIterations; ++i) {
        processPriceMovement();
    }

    // If on the offchance we end up perfectly at the next price movement
    if (isLong) {
        stock.shareTxUntilMovementDown = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovementDown) % stock.shareTxForMovement);
        if (stock.shareTxUntilMovementDown === stock.shareTxForMovement || stock.shareTxUntilMovementDown <= 0) {
            ++numIterations;
            stock.shareTxUntilMovementDown = stock.shareTxForMovement;
            processPriceMovement();
        }
    } else {
        stock.shareTxUntilMovementUp = stock.shareTxForMovement - ((shares - stock.shareTxUntilMovementUp) % stock.shareTxForMovement);
        if (stock.shareTxUntilMovementUp === stock.shareTxForMovement || stock.shareTxUntilMovementUp <= 0) {
            ++numIterations;
            stock.shareTxUntilMovementUp = stock.shareTxForMovement;
            processPriceMovement();
        }
    }

    stock.changePrice(currPrice);

    // Forecast always decreases in magnitude
    const forecastChange = Math.min(5, forecastChangePerPriceMovement * (numIterations - 1));
    stock.otlkMag -= forecastChange;
    if (stock.otlkMag < 0.1) {
        stock.otlkMag = 0.1;
    }
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

    const increasingMvmt = calculateIncreasingPriceMovement(stock);
    const decreasingMvmt = calculateDecreasingPriceMovement(stock);
    if (increasingMvmt == null || decreasingMvmt == null) { return 0; }

    let remainingMoney = money - CONSTANTS.StockMarketCommission;
    let currPrice = isLong ? stock.getAskPrice() : stock.getBidPrice();

    // No price movement
    const firstShares = isLong ? stock.shareTxUntilMovementUp : stock.shareTxUntilMovementDown;
    const firstIterationCost = firstShares * currPrice;
    if (remainingMoney < firstIterationCost) {
        return Math.floor(remainingMoney / currPrice);
    }

    // We'll avoid any accidental infinite loops by having a hardcoded maximum number of
    // iterations
    let numShares = firstShares;
    remainingMoney -= firstIterationCost;
    for (let i = 0; i < 10e3; ++i) {
        if (isLong) {
            currPrice *= increasingMvmt;
        } else {
            currPrice *= decreasingMvmt;
        }

        const affordableShares = Math.floor(remainingMoney / currPrice);
        const actualShares = Math.min(stock.shareTxForMovement, affordableShares);

        // Can't afford any more, so we're done
        if (actualShares <= 0) { break; }

        numShares += actualShares;

        let cost = actualShares * currPrice;
        remainingMoney -= cost;

        if (remainingMoney <= 0) { break; }
    }

    return Math.floor(numShares);
}
