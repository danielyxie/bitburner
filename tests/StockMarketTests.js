import { CONSTANTS } from "../src/Constants";
import { Stock } from "../src/StockMarket/Stock";
import {
    calculateIncreasingPriceMovement,
    calculateDecreasingPriceMovement,
    getBuyTransactionCost,
    getSellTransactionGain,
    processBuyTransactionPriceMovement,
    processSellTransactionPriceMovement,
} from "../src/StockMarket/StockMarketHelpers";
import { PositionTypes } from "../src/StockMarket/data/PositionTypes";

const assert = chai.assert;
const expect = chai.expect;

console.log("Beginning Stock Market Tests");

describe("Stock Market Tests", function() {
    const commission = CONSTANTS.StockMarketCommission;

    // Generic Stock object that can be used by each test
    let stock;
    const ctorParams = {
        b: true,
        initPrice: 10e3,
        marketCap: 5e9,
        mv: 1,
        name: "MockStock",
        otlkMag: 10,
        spreadPerc: 1,
        shareTxForMovement: 5e3,
        symbol: "mock",
    };

    beforeEach(function() {
        function construct() {
            stock = new Stock(ctorParams);
        }

        expect(construct).to.not.throw();
    });

    describe("Stock Class", function() {
        describe("constructor", function() {
            it("should have default parameters", function() {
                let defaultStock;
                function construct() {
                    defaultStock = new Stock();
                }

                expect(construct).to.not.throw();
                expect(defaultStock.name).to.equal("");
            });

            it("should properly initialize props from parameters", function() {
                expect(stock.name).to.equal(ctorParams.name);
                expect(stock.symbol).to.equal(ctorParams.symbol);
                expect(stock.price).to.equal(ctorParams.initPrice);
                expect(stock.lastPrice).to.equal(ctorParams.initPrice);
                expect(stock.b).to.equal(ctorParams.b);
                expect(stock.mv).to.equal(ctorParams.mv);
                expect(stock.shareTxForMovement).to.equal(ctorParams.shareTxForMovement);
                expect(stock.shareTxUntilMovement).to.equal(ctorParams.shareTxForMovement);
                expect(stock.maxShares).to.be.below(stock.totalShares);
                expect(stock.spreadPerc).to.equal(ctorParams.spreadPerc);
                expect(stock.priceMovementPerc).to.be.a("number");
                expect(stock.priceMovementPerc).to.be.at.most(stock.spreadPerc);
                expect(stock.priceMovementPerc).to.be.at.least(0);
            });

            it ("should properly initialize props from range-values", function() {
                let stock;
                const params = {
                    b: true,
                    initPrice: {
                        max: 10e3,
                        min: 1e3,
                    },
                    marketCap: 5e9,
                    mv: {
                        divisor: 100,
                        max: 150,
                        min: 50,
                    },
                    name: "MockStock",
                    otlkMag: 10,
                    spreadPerc: {
                        divisor: 10,
                        max: 10,
                        min: 1,
                    },
                    shareTxForMovement: {
                        max: 10e3,
                        min: 5e3,
                    },
                    symbol: "mock",
                };

                function construct() {
                    stock = new Stock(params);
                }

                expect(construct).to.not.throw();
                expect(stock.price).to.be.within(params.initPrice.min, params.initPrice.max);
                expect(stock.mv).to.be.within(params.mv.min / params.mv.divisor, params.mv.max / params.mv.divisor);
                expect(stock.spreadPerc).to.be.within(params.spreadPerc.min / params.spreadPerc.divisor, params.spreadPerc.max / params.spreadPerc.divisor);
                expect(stock.shareTxForMovement).to.be.within(params.shareTxForMovement.min, params.shareTxForMovement.max);
            });

            it("should round the 'totalShare' prop to the nearest 100k", function() {
                expect(stock.totalShares % 100e3).to.equal(0);
            });
        });

        describe("#changePrice()", function() {
            it("should set both the last price and current price properties", function() {
                const newPrice = 20e3;
                stock.changePrice(newPrice);
                expect(stock.lastPrice).to.equal(ctorParams.initPrice);
                expect(stock.price).to.equal(newPrice);
            });
        });

        describe("#getAskPrice()", function() {
            it("should return the price increased by spread percentage", function() {
                const perc = stock.spreadPerc / 100;
                expect(perc).to.be.at.most(1);
                expect(perc).to.be.at.least(0);

                const expected = stock.price * (1 + perc);
                expect(stock.getAskPrice()).to.equal(expected);
            });
        });

        describe("#getBidPrice()", function() {
            it("should return the price decreased by spread percentage", function() {
                const perc = stock.spreadPerc / 100;
                expect(perc).to.be.at.most(1);
                expect(perc).to.be.at.least(0);

                const expected = stock.price * (1 - perc);
                expect(stock.getBidPrice()).to.equal(expected);
            });
        });
    });

    describe("Transaction Cost Calculator Functions", function() {
        describe("getBuyTransactionCost()", function() {
            it("should fail on invalid 'stock' argument", function() {
                const res = getBuyTransactionCost({}, 10, PositionTypes.Long);
                expect(res).to.equal(null);
            });

            it("should fail on invalid 'shares' arg", function() {
                let res = getBuyTransactionCost(stock, NaN, PositionTypes.Long);
                expect(res).to.equal(null);

                res = getBuyTransactionCost(stock, -1, PositionTypes.Long);
                expect(res).to.equal(null);
            });

            it("should properly evaluate LONG transactions that doesn't trigger a price movement", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = getBuyTransactionCost(stock, shares, PositionTypes.Long);
                expect(res).to.equal(shares * stock.getAskPrice() + commission);
            });

            it("should properly evaluate SHORT transactions that doesn't trigger a price movement", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = getBuyTransactionCost(stock, shares, PositionTypes.Short);
                expect(res).to.equal(shares * stock.getBidPrice() + commission);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = getBuyTransactionCost(stock, shares, PositionTypes.Long);

                // Calculate expected cost
                const secondPrice = stock.getAskPrice() * calculateIncreasingPriceMovement(stock);
                const thirdPrice = secondPrice * calculateIncreasingPriceMovement(stock);
                let expected = (sharesPerMvmt * stock.getAskPrice()) + (sharesPerMvmt * secondPrice) + (sharesPerMvmt * thirdPrice);

                expect(res).to.equal(expected + commission);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = getBuyTransactionCost(stock, shares, PositionTypes.Short);

                // Calculate expected cost
                const secondPrice = stock.getBidPrice() * calculateDecreasingPriceMovement(stock);
                const thirdPrice = secondPrice * calculateDecreasingPriceMovement(stock);
                let expected = (sharesPerMvmt * stock.getBidPrice()) + (sharesPerMvmt * secondPrice) + (sharesPerMvmt * thirdPrice);

                expect(res).to.equal(expected + commission);
            });

            it("should cap the 'shares' argument at the stock's maximum number of shares", function() {
                const maxRes = getBuyTransactionCost(stock, stock.maxShares, PositionTypes.Long);
                const exceedRes = getBuyTransactionCost(stock, stock.maxShares * 10, PositionTypes.Long);
                expect(maxRes).to.equal(exceedRes);
            });
        });

        describe("getSellTransactionGain()", function() {
            it("should fail on invalid 'stock' argument", function() {
                const res = getSellTransactionGain({}, 10, PositionTypes.Long);
                expect(res).to.equal(null);
            });

            it("should fail on invalid 'shares' arg", function() {
                let res = getSellTransactionGain(stock, NaN, PositionTypes.Long);
                expect(res).to.equal(null);

                res = getSellTransactionGain(stock, -1, PositionTypes.Long);
                expect(res).to.equal(null);
            });

            it("should properly evaluate LONG transactions that doesn't trigger a price movement", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = getSellTransactionGain(stock, shares, PositionTypes.Long);
                const expected = shares * stock.getBidPrice() - commission;
                expect(res).to.equal(expected);
            });

            it("should properly evaluate SHORT transactions that doesn't trigger a price movement", function() {
                // We need to set this property in order to calculate gains from short position
                stock.playerAvgShortPx = stock.price * 2;

                const shares = ctorParams.shareTxForMovement / 2;
                const res = getSellTransactionGain(stock, shares, PositionTypes.Short);
                const expected = (shares * stock.playerAvgShortPx) + (shares * (stock.playerAvgShortPx - stock.getAskPrice())) - commission;
                expect(res).to.equal(expected);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = getSellTransactionGain(stock, shares, PositionTypes.Long);

                // Calculated expected gain
                const mvmt = calculateDecreasingPriceMovement(stock);
                const secondPrice = stock.getBidPrice() * mvmt;
                const thirdPrice = secondPrice * mvmt;
                const expected = (sharesPerMvmt * stock.getBidPrice()) + (sharesPerMvmt * secondPrice) + (sharesPerMvmt * thirdPrice);

                expect(res).to.equal(expected - commission);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                // We need to set this property in order to calculate gains from short position
                stock.playerAvgShortPx = stock.price * 2;

                const sharesPerMvmt = ctorParams.shareTxForMovement;
                const shares = sharesPerMvmt * 3;
                const res = getSellTransactionGain(stock, shares, PositionTypes.Short);

                // Calculate expected gain
                const mvmt = calculateIncreasingPriceMovement(stock);
                const secondPrice = stock.getAskPrice() * mvmt;
                const thirdPrice = secondPrice * mvmt;
                function getGainForPrice(thisPrice) {
                    const origCost = sharesPerMvmt * stock.playerAvgShortPx;
                    return origCost + ((stock.playerAvgShortPx - thisPrice) * sharesPerMvmt);
                }
                const expected = getGainForPrice(stock.getAskPrice()) + getGainForPrice(secondPrice) + getGainForPrice(thirdPrice);

                expect(res).to.equal(expected - commission);
            });

            it("should cap the 'shares' argument at the stock's maximum number of shares", function() {
                const maxRes = getSellTransactionGain(stock, stock.maxShares, PositionTypes.Long);
                const exceedRes = getSellTransactionGain(stock, stock.maxShares * 10, PositionTypes.Long);
                expect(maxRes).to.equal(exceedRes);
            });
        });
    });

    describe("Price Movement Processor Functions", function() {
        describe("processBuyTransactionPriceMovement()", function() {
            const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
            const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

            it("should do nothing on invalid 'stock' argument", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                processBuyTransactionPriceMovement({}, mvmtShares, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should do nothing on invalid 'shares' arg", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                processBuyTransactionPriceMovement(stock, NaN, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);

                processBuyTransactionPriceMovement(stock, -1, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should properly evaluate LONG transactions that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;

                processBuyTransactionPriceMovement(stock, noMvmtShares, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;

                processBuyTransactionPriceMovement(stock, noMvmtShares, PositionTypes.Short);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                function getNthPrice(n) {
                    let price = oldPrice;
                    for (let i = 1; i < n; ++i) {
                        price *= calculateIncreasingPriceMovement(stock);
                    }

                    return price;
                }

                processBuyTransactionPriceMovement(stock, mvmtShares, PositionTypes.Long);
                expect(stock.price).to.equal(getNthPrice(4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                function getNthPrice(n) {
                    let price = oldPrice;
                    for (let i = 1; i < n; ++i) {
                        price *= calculateDecreasingPriceMovement(stock);
                    }

                    return price;
                }

                processBuyTransactionPriceMovement(stock, mvmtShares, PositionTypes.Short);
                expect(stock.price).to.equal(getNthPrice(4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });
        });

        describe("processSellTransactionPriceMovement()", function() {
            const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
            const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

            it("should do nothing on invalid 'stock' argument", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                processSellTransactionPriceMovement({}, mvmtShares, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should do nothing on invalid 'shares' arg", function() {
                const oldPrice = stock.price;
                const oldTracker = stock.shareTxUntilMovement;

                processSellTransactionPriceMovement(stock, NaN, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);

                processSellTransactionPriceMovement(stock, -1, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should properly evaluate LONG transactions that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;

                processSellTransactionPriceMovement(stock, noMvmtShares, PositionTypes.Long);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that doesn't trigger a price movement", function() {
                const oldPrice = stock.price;

                processSellTransactionPriceMovement(stock, noMvmtShares, PositionTypes.Short);
                expect(stock.price).to.equal(oldPrice);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                function getNthPrice(n) {
                    let price = oldPrice;
                    for (let i = 1; i < n; ++i) {
                        price *= calculateDecreasingPriceMovement(stock);
                    }

                    return price;
                }

                processSellTransactionPriceMovement(stock, mvmtShares, PositionTypes.Long);
                expect(stock.price).to.equal(getNthPrice(4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const oldPrice = stock.price;
                function getNthPrice(n) {
                    let price = oldPrice;
                    for (let i = 1; i < n; ++i) {
                        price *= calculateIncreasingPriceMovement(stock);
                    }

                    return price;
                }

                processSellTransactionPriceMovement(stock, mvmtShares, PositionTypes.Short);
                expect(stock.price).to.equal(getNthPrice(4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });
        });
    });
});
