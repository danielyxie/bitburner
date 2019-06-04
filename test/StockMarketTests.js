import { CONSTANTS } from "../src/Constants";
import { Player } from "../src/Player";
import {
    buyStock,
    sellStock,
    shortStock,
    sellShort,
} from "../src/StockMarket/BuyingAndSelling";
import { Order } from "../src/StockMarket/Order";
import { processOrders } from "../src/StockMarket/OrderProcessing";
import { Stock } from "../src/StockMarket/Stock";
import {
    deleteStockMarket,
    initStockMarket,
    initSymbolToStockMap,
    loadStockMarket,
    processStockPrices,
    StockMarket,
    SymbolToStockMap,
} from "../src/StockMarket/StockMarket";
import {
    forecastChangePerPriceMovement,
    getBuyTransactionCost,
    getSellTransactionGain,
    processTransactionForecastMovement,
} from "../src/StockMarket/StockMarketHelpers";
import { OrderTypes } from "../src/StockMarket/data/OrderTypes"
import { PositionTypes } from "../src/StockMarket/data/PositionTypes";

import { expect } from "chai";

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
        otlkMag: 20,
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
                expect(stock.otlkMag).to.be.a("number");
                expect(stock.otlkMag).to.equal(ctorParams.otlkMag);
                expect(stock.otlkMagForecast).to.equal(ctorParams.b ? 50 + ctorParams.otlkMag : 50 - ctorParams.otlkMag);
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

        describe("#changeForecastForecast()", function() {
            it("should get the stock's second-order forecast property", function() {
                stock.changeForecastForecast(99);
                expect(stock.otlkMagForecast).to.equal(99);
                stock.changeForecastForecast(1);
                expect(stock.otlkMagForecast).to.equal(1);
            });

            it("should prevent values outside of 0-100", function() {
                stock.changeForecastForecast(101);
                expect(stock.otlkMagForecast).to.equal(100);
                stock.changeForecastForecast(-1);
                expect(stock.otlkMagForecast).to.equal(0);
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

        describe("#cycleForecast()", function() {
            it("should appropriately change the otlkMag by the given amount when b=true", function() {
                stock.getForecastIncreaseChance = () => { return 1; }
                stock.cycleForecast(5);
                expect(stock.otlkMag).to.equal(ctorParams.otlkMag + 5);

                stock.getForecastIncreaseChance = () => { return 0; }
                stock.cycleForecast(10);
                expect(stock.otlkMag).to.equal(ctorParams.otlkMag - 5);
            });

            it("should NOT(!) the stock's 'b' property if it causes 'otlkMag' to go below 0", function() {
                stock.getForecastIncreaseChance = () => { return 0; }
                stock.cycleForecast(25);
                expect(stock.otlkMag).to.equal(5);
                expect(stock.b).to.equal(false);
            });
        });

        describe("#cycleForecastForecast()", function() {
            it("should increase the stock's second-order forecast by a given amount", function() {
                const expected = [65, 75];
                stock.cycleForecastForecast(5);
                expect(stock.otlkMagForecast).to.be.oneOf(expected);
            });
        });

        describe("#flipForecastForecast()", function() {
            it("should flip the 'otlkMagForecast' property around 50", function() {
                stock.otlkMagForecast = 50;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(50);

                stock.otlkMagForecast = 60;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(40);

                stock.otlkMagForecast = 90;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(10);

                stock.otlkMagForecast = 100;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(0);

                stock.otlkMagForecast = 40;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(60);

                stock.otlkMagForecast = 0;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(100);

                stock.otlkMagForecast = 25;
                stock.flipForecastForecast();
                expect(stock.otlkMagForecast).to.equal(75);
            })
        });

        describe("#getAbsoluteForecast()", function() {
            it("should return the absolute forecast on a 1-100 scale", function() {
                stock.b = true;
                stock.otlkMag = 10;
                expect(stock.getAbsoluteForecast()).to.equal(60);

                stock.b = false;
                expect(stock.getAbsoluteForecast()).to.equal(40);

                stock.otlkMag = 30;
                expect(stock.getAbsoluteForecast()).to.equal(20);

                stock.b = true;
                expect(stock.getAbsoluteForecast()).to.equal(80);

                stock.otlkMag = 0;
                expect(stock.getAbsoluteForecast()).to.equal(50);

                stock.b = false;
                expect(stock.getAbsoluteForecast()).to.equal(50);
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

        describe("#getForecastIncreaseChance()", function() {
            it("should return the chance that the stock has of increasing in decimal form", function() {
                stock.b = true;

                stock.otlkMagForecast = 90;
                stock.otlkMag = 20; // Absolute forecast of 70
                expect(stock.getForecastIncreaseChance()).to.equal(0.7);

                stock.otlkMag = 25; // Absolute forecast of 75
                expect(stock.getForecastIncreaseChance()).to.equal(0.65);

                stock.otlkMagForecast = 100;
                stock.otlkMag = 0; // Absolute forecast of 50
                expect(stock.getForecastIncreaseChance()).to.equal(0.95);

                stock.otlkMagForecast = 60;
                stock.otlkMag = 25; // Absolute forecast of 75
                expect(stock.getForecastIncreaseChance()).to.equal(0.35);

                stock.otlkMagForecast = 10;
                expect(stock.getForecastIncreaseChance()).to.equal(0.05);

                stock.b = false;

                stock.otlkMagForecast = 90;
                stock.otlkMag = 20; // Absolute forecast of 30
                expect(stock.getForecastIncreaseChance()).to.equal(0.95);

                stock.otlkMagForecast = 50;
                stock.otlkMag = 25; // Absolute forecast of 25
                expect(stock.getForecastIncreaseChance()).to.equal(0.75);

                stock.otlkMagForecast = 100;
                stock.otlkMag = 0; // Absolute forecast of 50
                expect(stock.getForecastIncreaseChance()).to.equal(0.95);

                stock.otlkMagForecast = 5;
                stock.otlkMag = 25; // Absolute forecast of 25
                expect(stock.getForecastIncreaseChance()).to.equal(0.3);

                stock.otlkMagForecast = 10;
                expect(stock.getForecastIncreaseChance()).to.equal(0.35);

                stock.otlkMagForecast = 50;
                stock.otlkMag = 0;
                expect(stock.getForecastIncreaseChance()).to.equal(0.5);

                stock.otlkMagForecast = 25;
                stock.otlkMag = 5; // Asolute forecast of 45
                expect(stock.getForecastIncreaseChance()).to.equal(0.3);
            });
        });
    });

    describe("StockMarket object", function() {
        describe("Initialization", function() {
            // Keeps track of initialized stocks. Contains their symbols
            const stocks = [];

            before(function() {
                expect(initStockMarket).to.not.throw();
                expect(initSymbolToStockMap).to.not.throw();
            });

            it("should have Stock objects", function() {
                for (const prop in StockMarket) {
                    const stock = StockMarket[prop];
                    if (stock instanceof Stock) {
                        stocks.push(stock.symbol);
                    }
                }

                // We'll just check that there are some stocks
                expect(stocks.length).to.be.at.least(1);
            });

            it("should have an order book in the 'Orders' property", function() {
                expect(StockMarket).to.have.property("Orders");

                const orderbook = StockMarket["Orders"];
                for (const symbol of stocks) {
                    const ordersForStock = orderbook[symbol];
                    expect(ordersForStock).to.be.an("array");
                    expect(ordersForStock.length).to.equal(0);
                }
            });

            it("should have properties for managing game cycles", function() {
                expect(StockMarket).to.have.property("storedCycles");
                expect(StockMarket["storedCycles"]).to.equal(0);
                expect(StockMarket).to.have.property("lastUpdate");
                expect(StockMarket["lastUpdate"]).to.equal(0);
                expect(StockMarket).to.have.property("ticksUntilCycle");
                expect(StockMarket["ticksUntilCycle"]).to.be.a("number");
            });
        });

        // Because 'StockMarket' is a global object, the effects of initialization from
        // the block above should still stand
        describe("Deletion", function() {
            it("should set StockMarket to be an empty object", function() {
                expect(StockMarket).to.be.an("object").that.is.not.empty;
                deleteStockMarket();
                expect(StockMarket).to.be.an("object").that.is.empty;
            });
        });

        describe("processStockPrices()", function() {
            before(function() {
                deleteStockMarket();
                initStockMarket();
                initSymbolToStockMap();
            });

            it("should store cycles until it actually processes", function() {
                expect(StockMarket["storedCycles"]).to.equal(0);
                processStockPrices(10);
                expect(StockMarket["storedCycles"]).to.equal(10);
            });

            it("should trigger a price update when it has enough cycles", function() {
                // Get the initial prices
                const initialValues = {};
                for (const stockName in StockMarket) {
                    const stock = StockMarket[stockName];
                    if (!(stock instanceof Stock)) { continue; }
                    initialValues[stock.symbol] = {
                        b: stock.b,
                        otlkMag: stock.otlkMag,
                        price: stock.price,
                    }
                }

                // Don't know or care how many exact cycles are required
                StockMarket.lastUpdate = new Date().getTime() - 5e3;
                processStockPrices(1e9);

                // Both price and 'otlkMag' should be different
                for (const stockName in StockMarket) {
                    const stock = StockMarket[stockName];
                    if (!(stock instanceof Stock)) { continue; }
                    expect(initialValues[stock.symbol].price).to.not.equal(stock.price);
                    // expect(initialValues[stock.symbol].otlkMag).to.not.equal(stock.otlkMag);
                    expect(initialValues[stock.symbol]).to.satisfy(function(initValue) {
                        if ((initValue.otlkMag !== stock.otlkMag) || (initValue.b !== stock.b)) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                }
            });
        });
    });

    describe("StockToSymbolMap", function() {
        before(function() {
            deleteStockMarket();
            initStockMarket();
            initSymbolToStockMap();
        });

        it("should map stock symbols to their corresponding Stock Objects", function() {
            for (const stockName in StockMarket) {
                const stock = StockMarket[stockName];
                if (!(stock instanceof Stock)) { continue; }

                expect(SymbolToStockMap[stock.symbol]).to.equal(stock);
            }
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

            it("should properly evaluate LONG transactions", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = getBuyTransactionCost(stock, shares, PositionTypes.Long);
                expect(res).to.equal(shares * stock.getAskPrice() + commission);
            });

            it("should properly evaluate SHORT transactions", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = getBuyTransactionCost(stock, shares, PositionTypes.Short);
                expect(res).to.equal(shares * stock.getBidPrice() + commission);
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

            it("should properly evaluate LONG transactionst", function() {
                const shares = ctorParams.shareTxForMovement / 2;
                const res = getSellTransactionGain(stock, shares, PositionTypes.Long);
                const expected = shares * stock.getBidPrice() - commission;
                expect(res).to.equal(expected);
            });

            it("should properly evaluate SHORT transactions", function() {
                // We need to set this property in order to calculate gains from short position
                stock.playerAvgShortPx = stock.price * 2;

                const shares = ctorParams.shareTxForMovement / 2;
                const res = getSellTransactionGain(stock, shares, PositionTypes.Short);
                const expected = (shares * stock.playerAvgShortPx) + (shares * (stock.playerAvgShortPx - stock.getAskPrice())) - commission;
                expect(res).to.equal(expected);
            });

            it("should cap the 'shares' argument at the stock's maximum number of shares", function() {
                const maxRes = getSellTransactionGain(stock, stock.maxShares, PositionTypes.Long);
                const exceedRes = getSellTransactionGain(stock, stock.maxShares * 10, PositionTypes.Long);
                expect(maxRes).to.equal(exceedRes);
            });
        });
    });

    describe("Forecast Movement Processor Function", function() {
        // N = 1 is the original forecast
        function getNthForecast(origForecast, n) {
            return origForecast - forecastChangePerPriceMovement * (n - 1);
        }

        describe("processTransactionForecastMovement() for buy transactions", function() {
            const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
            const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

            it("should do nothing on invalid 'stock' argument", function() {
                const oldTracker = stock.shareTxUntilMovement;

                processTransactionForecastMovement({}, mvmtShares, PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should do nothing on invalid 'shares' arg", function() {
                const oldTracker = stock.shareTxUntilMovement;

                processTransactionForecastMovement(stock, NaN, PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);

                processTransactionForecastMovement(stock, -1, PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should properly evaluate a LONG transaction that doesn't trigger a forecast movement", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, noMvmtShares, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate a SHORT transaction that doesn't trigger a forecast movement", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, noMvmtShares, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions that triggers forecast movements", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, mvmtShares, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that triggers forecast movements", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, mvmtShares, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions of exactly 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, stock.shareTxForMovement, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that total to 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2), PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.be.below(stock.shareTxForMovement);
                processTransactionForecastMovement(stock, stock.shareTxUntilMovement, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions of exactly 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, stock.shareTxForMovement, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that total to 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2), PositionTypes.Short);
                expect(stock.shareTxUntilMovement).to.be.below(stock.shareTxForMovement);
                processTransactionForecastMovement(stock, stock.shareTxUntilMovement, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });
        });

        describe("processTransactionForecastMovement() for sell transactions", function() {
            const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
            const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

            it("should do nothing on invalid 'stock' argument", function() {
                const oldTracker = stock.shareTxUntilMovement;

                processTransactionForecastMovement({}, mvmtShares, PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should do nothing on invalid 'shares' arg", function() {
                const oldTracker = stock.shareTxUntilMovement;

                processTransactionForecastMovement(stock, NaN, PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);

                processTransactionForecastMovement(stock, -1, PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.equal(oldTracker);
            });

            it("should properly evaluate a LONG transaction that doesn't trigger a price movement", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, noMvmtShares, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate a SHORT transaction that doesn't trigger a price movement", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, noMvmtShares, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(oldForecast);
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions that trigger price movements", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, mvmtShares, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate SHORT transactions that trigger price movements", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, mvmtShares, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement - noMvmtShares);
            });

            it("should properly evaluate LONG transactions of exactly 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, stock.shareTxForMovement, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that total to 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2), PositionTypes.Long);
                expect(stock.shareTxUntilMovement).to.be.below(stock.shareTxForMovement);
                processTransactionForecastMovement(stock, stock.shareTxUntilMovement, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate LONG transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement, PositionTypes.Long);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions of exactly 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, stock.shareTxForMovement, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that total to 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2), PositionTypes.Short);
                expect(stock.shareTxUntilMovement).to.be.below(stock.shareTxForMovement);
                processTransactionForecastMovement(stock, stock.shareTxUntilMovement, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 2));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });

            it("should properly evaluate SHORT transactions that are a multiple of 'shareTxForMovement' shares", function() {
                const oldForecast = stock.otlkMag;

                processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement, PositionTypes.Short);
                expect(stock.otlkMag).to.equal(getNthForecast(oldForecast, 4));
                expect(stock.shareTxUntilMovement).to.equal(stock.shareTxForMovement);
            });
        });
    });

    describe("Transaction (Buy/Sell) Functions", function() {
        const suppressDialogOpt = { suppressDialog: true };

        describe("buyStock()", function() {
            it("should fail for invalid arguments", function() {
                expect(buyStock({}, 1, null, suppressDialogOpt)).to.equal(false);
                expect(buyStock(stock, 0, null, suppressDialogOpt)).to.equal(false);
                expect(buyStock(stock, -1, null, suppressDialogOpt)).to.equal(false);
                expect(buyStock(stock, NaN, null, suppressDialogOpt)).to.equal(false);
            });

            it("should fail if player doesn't have enough money", function() {
                Player.setMoney(0);
                expect(buyStock(stock, 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should not allow for transactions that exceed the maximum shares", function() {
                const maxShares = stock.maxShares;
                expect(buyStock(stock, maxShares + 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should return true and properly update stock properties for successful transactions", function() {
                const shares = 1e3;
                const cost = getBuyTransactionCost(stock, shares, PositionTypes.Long);
                Player.setMoney(cost);

                expect(buyStock(stock, shares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShares).to.equal(shares);
                expect(stock.playerAvgPx).to.be.above(0);
                expect(Player.money.toNumber()).to.equal(0);
            });
        });

        describe("sellStock()", function() {
            it("should fail for invalid arguments", function() {
                expect(sellStock({}, 1, null, suppressDialogOpt)).to.equal(false);
                expect(sellStock(stock, 0, null, suppressDialogOpt)).to.equal(false);
                expect(sellStock(stock, -1, null, suppressDialogOpt)).to.equal(false);
                expect(sellStock(stock, NaN, null, suppressDialogOpt)).to.equal(false);
            });

            it("should fail if player doesn't have any shares", function() {
                Player.setMoney(0);
                expect(sellStock(stock, 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should not allow for transactions that exceed the maximum shares", function() {
                const maxShares = stock.maxShares;
                expect(sellStock(stock, maxShares + 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should return true and properly update stock properties for successful transactions", function() {
                const shares = 1e3;
                stock.playerShares = shares;
                stock.playerAvgPx = stock.price;
                const gain = getSellTransactionGain(stock, shares, PositionTypes.Long);
                Player.setMoney(0);

                expect(sellStock(stock, shares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShares).to.equal(0);
                expect(stock.playerAvgPx).to.equal(0);
                expect(Player.money.toNumber()).to.equal(gain);
            });

            it("should cap the number of sharse sold to however many the player owns", function() {
                const attemptedShares = 2e3;
                const actualShares = 1e3;
                stock.playerShares = actualShares;
                stock.playerAvgPx = stock.price;
                const gain = getSellTransactionGain(stock, actualShares, PositionTypes.Long);
                Player.setMoney(0);

                expect(sellStock(stock, attemptedShares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShares).to.equal(0);
                expect(stock.playerAvgPx).to.equal(0);
                expect(Player.money.toNumber()).to.equal(gain);
            });

            it("should properly update stock properties for partial transactions", function() {
                const shares = 1e3;
                const origPrice = stock.price;
                stock.playerShares = 2 * shares;
                stock.playerAvgPx = origPrice;
                const gain = getSellTransactionGain(stock, shares, PositionTypes.Long);
                Player.setMoney(0);

                expect(sellStock(stock, shares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShares).to.equal(shares);
                expect(stock.playerAvgPx).to.equal(origPrice);
                expect(Player.money.toNumber()).to.equal(gain);
            });
        });

        describe("shortStock()", function() {
            it("should fail for invalid arguments", function() {
                expect(shortStock({}, 1, null, suppressDialogOpt)).to.equal(false);
                expect(shortStock(stock, 0, null, suppressDialogOpt)).to.equal(false);
                expect(shortStock(stock, -1, null, suppressDialogOpt)).to.equal(false);
                expect(shortStock(stock, NaN, null, suppressDialogOpt)).to.equal(false);
            });

            it("should fail if player doesn't have enough money", function() {
                Player.setMoney(0);
                expect(shortStock(stock, 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should not allow for transactions that exceed the maximum shares", function() {
                const maxShares = stock.maxShares;
                expect(shortStock(stock, maxShares + 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should return true and properly update stock properties for successful transactions", function() {
                const shares = 1e3;
                const cost = getBuyTransactionCost(stock, shares, PositionTypes.Short);
                Player.setMoney(cost);

                expect(shortStock(stock, shares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShortShares).to.equal(shares);
                expect(stock.playerAvgShortPx).to.be.above(0);
                expect(Player.money.toNumber()).to.equal(0);
            });
        });

        describe("sellShort()", function() {
            it("should fail for invalid arguments", function() {
                expect(sellShort({}, 1, null, suppressDialogOpt)).to.equal(false);
                expect(sellShort(stock, 0, null, suppressDialogOpt)).to.equal(false);
                expect(sellShort(stock, -1, null, suppressDialogOpt)).to.equal(false);
                expect(sellShort(stock, NaN, null, suppressDialogOpt)).to.equal(false);
            });

            it("should fail if player doesn't have any shares", function() {
                Player.setMoney(0);
                expect(sellShort(stock, 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should not allow for transactions that exceed the maximum shares", function() {
                const maxShares = stock.maxShares;
                expect(sellShort(stock, maxShares + 1, null, suppressDialogOpt)).to.equal(false);
            });

            it("should return true and properly update stock properties for successful transactions", function() {
                const shares = 1e3;
                stock.playerShortShares = shares;
                stock.playerAvgShortPx = stock.price;
                const gain = getSellTransactionGain(stock, shares, PositionTypes.Short);
                Player.setMoney(0);

                expect(sellShort(stock, shares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShortShares).to.equal(0);
                expect(stock.playerAvgShortPx).to.equal(0);
                expect(Player.money.toNumber()).to.equal(gain);
            });

            it("should cap the number of sharse sold to however many the player owns", function() {
                const attemptedShares = 2e3;
                const actualShares = 1e3;
                stock.playerShortShares = actualShares;
                stock.playerAvgShortPx = stock.price;
                const gain = getSellTransactionGain(stock, actualShares, PositionTypes.Short);
                Player.setMoney(0);

                expect(sellShort(stock, attemptedShares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShortShares).to.equal(0);
                expect(stock.playerAvgShortPx).to.equal(0);
                expect(Player.money.toNumber()).to.equal(gain);
            });

            it("should properly update stock properties for partial transactions", function() {
                const shares = 1e3;
                const origPrice = stock.price;
                stock.playerShortShares = 2 * shares;
                stock.playerAvgShortPx = origPrice;
                const gain = getSellTransactionGain(stock, shares, PositionTypes.Short);
                Player.setMoney(0);

                expect(sellShort(stock, shares, null, suppressDialogOpt)).to.equal(true);
                expect(stock.playerShortShares).to.equal(shares);
                expect(stock.playerAvgShortPx).to.equal(origPrice);
                expect(Player.money.toNumber()).to.equal(gain);
            });
        });
    });

    describe("Order Class", function() {
        it("should throw on invalid arguments", function() {
            function invalid1() {
                return new Order({}, 1, 1, OrderTypes.LimitBuy, PositionTypes.Long);
            }
            function invalid2() {
                return new Order("FOO", "z", 0, OrderTypes.LimitBuy, PositionTypes.Short);
            }
            function invalid3() {
                return new Order("FOO", 1, {}, OrderTypes.LimitBuy, PositionTypes.Short);
            }
            function invalid4() {
                return new Order("FOO", 1, NaN, OrderTypes.LimitBuy, PositionTypes.Short);
            }
            function invalid5() {
                return new Order("FOO", NaN, 0, OrderTypes.LimitBuy, PositionTypes.Short);
            }

            expect(invalid1).to.throw();
            expect(invalid2).to.throw();
            expect(invalid3).to.throw();
            expect(invalid4).to.throw();
            expect(invalid5).to.throw();
        });
    });

    describe("Order Processing", function() {
        // TODO
    });

    describe("Player Influencing", function() {
        // TODO
    });
});
