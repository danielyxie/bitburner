import { CONSTANTS } from "../src/Constants";
import { Player } from "../src/Player";
import { IMap } from "../src/types";

import { Company } from "../src/Company/Company";
import { Server } from "../src/Server/Server";

import { buyStock, sellStock, shortStock, sellShort } from "../src/StockMarket/BuyingAndSelling";
import { IStockMarket } from "../src/StockMarket/IStockMarket";
import { Order } from "../src/StockMarket/Order";
import {
  forecastForecastChangeFromCompanyWork,
  forecastForecastChangeFromHack,
  influenceStockThroughCompanyWork,
  influenceStockThroughServerGrow,
  influenceStockThroughServerHack,
} from "../src/StockMarket/PlayerInfluencing";
import { processOrders, IProcessOrderRefs } from "../src/StockMarket/OrderProcessing";
import { Stock, StockForecastInfluenceLimit } from "../src/StockMarket/Stock";
import {
  cancelOrder,
  deleteStockMarket,
  initStockMarket,
  initSymbolToStockMap,
  placeOrder,
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
import { OrderTypes } from "../src/StockMarket/data/OrderTypes";
import { PositionTypes } from "../src/StockMarket/data/PositionTypes";
// import { jest } from "jest";

// jest.mock("../src/ui/React/createPopup.tsx", () => ({
//   createPopup: jest.fn(),
// }));

describe("Stock Market Tests", function () {
  const commission = CONSTANTS.StockMarketCommission;

  // Generic Stock object that can be used by each test
  let stock: Stock;
  const ctorParams = {
    b: true,
    initPrice: 10e3,
    marketCap: 5e9,
    mv: 2,
    name: "MockStock",
    otlkMag: 20,
    spreadPerc: 1,
    shareTxForMovement: 5e3,
    symbol: "mock",
  };

  beforeEach(function () {
    function construct(): void {
      stock = new Stock(ctorParams);
    }

    expect(construct).not.throw();
  });

  describe("Stock Class", function () {
    describe("constructor", function () {
      it("should have default parameters", function () {
        function construct(): void {
          new Stock(); // eslint-disable-line no-new
        }
        expect(construct).not.throw();

        const defaultStock = new Stock();
        expect(defaultStock).not.equal(null);
        expect(defaultStock.name).equal("");
      });

      it("should properly initialize props from parameters", function () {
        expect(stock.name).equal(ctorParams.name);
        expect(stock.symbol).equal(ctorParams.symbol);
        expect(stock.price).equal(ctorParams.initPrice);
        expect(stock.lastPrice).equal(ctorParams.initPrice);
        expect(stock.b).equal(ctorParams.b);
        expect(stock.mv).equal(ctorParams.mv);
        expect(stock.shareTxForMovement).equal(ctorParams.shareTxForMovement);
        expect(stock.shareTxUntilMovement).equal(ctorParams.shareTxForMovement);
        expect(stock.maxShares).lessThan(stock.totalShares);
        expect(stock.spreadPerc).equal(ctorParams.spreadPerc);
        expect(stock.otlkMag).equal(ctorParams.otlkMag);
        expect(stock.otlkMagForecast).equal(ctorParams.b ? 50 + ctorParams.otlkMag : 50 - ctorParams.otlkMag);
      });

      it("should properly initialize props from range-values", function () {
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

        function construct(): void {
          new Stock(params); // eslint-disable-line no-new
        }

        expect(construct).not.throw();

        const stock = new Stock(params);
        expect(stock).not.equal(null);
        expect(stock.price).gte(params.initPrice.min);
        expect(stock.price).lte(params.initPrice.max);
        expect(stock.mv).gte(params.mv.min / params.mv.divisor);
        expect(stock.mv).lte(params.mv.max / params.mv.divisor);
        expect(stock.spreadPerc).gte(params.spreadPerc.min / params.spreadPerc.divisor);
        expect(stock.spreadPerc).lte(params.spreadPerc.max / params.spreadPerc.divisor);
        expect(stock.shareTxForMovement).gte(params.shareTxForMovement.min);
        expect(stock.shareTxForMovement).lte(params.shareTxForMovement.max);
      });

      it("should round the 'totalShare' prop to the nearest 100k", function () {
        expect(stock.totalShares % 100e3).equal(0);
      });
    });

    describe("#changeForecastForecast()", function () {
      it("should get the stock's second-order forecast property", function () {
        stock.changeForecastForecast(99);
        expect(stock.otlkMagForecast).equal(99);
        stock.changeForecastForecast(1);
        expect(stock.otlkMagForecast).equal(1);
      });

      it("should prevent values outside of 0-100", function () {
        stock.changeForecastForecast(101);
        expect(stock.otlkMagForecast).equal(100);
        stock.changeForecastForecast(-1);
        expect(stock.otlkMagForecast).equal(0);
      });
    });

    describe("#changePrice()", function () {
      it("should set both the last price and current price properties", function () {
        const newPrice = 20e3;
        stock.changePrice(newPrice);
        expect(stock.lastPrice).equal(ctorParams.initPrice);
        expect(stock.price).equal(newPrice);
      });
    });

    describe("#cycleForecast()", function () {
      it("should appropriately change the otlkMag by the given amount when b=true", function () {
        stock.getForecastIncreaseChance = () => {
          return 1;
        };
        stock.cycleForecast(5);
        expect(stock.otlkMag).equal(ctorParams.otlkMag + 5);

        stock.getForecastIncreaseChance = () => {
          return 0;
        };
        stock.cycleForecast(10);
        expect(stock.otlkMag).equal(ctorParams.otlkMag - 5);
      });

      it("should NOT(!) the stock's 'b' property if it causes 'otlkMag' to go below 0", function () {
        stock.getForecastIncreaseChance = () => {
          return 0;
        };
        stock.cycleForecast(25);
        expect(stock.otlkMag).equal(5);
        expect(stock.b).equal(false);
      });
    });

    describe("#cycleForecastForecast()", function () {
      it("should increase the stock's second-order forecast by a given amount", function () {
        const expected = [65, 75];
        stock.cycleForecastForecast(5);
        expect(expected).contain(stock.otlkMagForecast);
      });
    });

    describe("#flipForecastForecast()", function () {
      it("should flip the 'otlkMagForecast' property around 50", function () {
        stock.otlkMagForecast = 50;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(50);

        stock.otlkMagForecast = 60;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(40);

        stock.otlkMagForecast = 90;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(10);

        stock.otlkMagForecast = 100;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(0);

        stock.otlkMagForecast = 40;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(60);

        stock.otlkMagForecast = 0;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(100);

        stock.otlkMagForecast = 25;
        stock.flipForecastForecast();
        expect(stock.otlkMagForecast).equal(75);
      });
    });

    describe("#getAbsoluteForecast()", function () {
      it("should return the absolute forecast on a 1-100 scale", function () {
        stock.b = true;
        stock.otlkMag = 10;
        expect(stock.getAbsoluteForecast()).equal(60);

        stock.b = false;
        expect(stock.getAbsoluteForecast()).equal(40);

        stock.otlkMag = 30;
        expect(stock.getAbsoluteForecast()).equal(20);

        stock.b = true;
        expect(stock.getAbsoluteForecast()).equal(80);

        stock.otlkMag = 0;
        expect(stock.getAbsoluteForecast()).equal(50);

        stock.b = false;
        expect(stock.getAbsoluteForecast()).equal(50);
      });
    });

    describe("#getAskPrice()", function () {
      it("should return the price increased by spread percentage", function () {
        const perc = stock.spreadPerc / 100;
        expect(perc).lte(1);
        expect(perc).gte(0);

        const expected = stock.price * (1 + perc);
        expect(stock.getAskPrice()).equal(expected);
      });
    });

    describe("#getBidPrice()", function () {
      it("should return the price decreased by spread percentage", function () {
        const perc = stock.spreadPerc / 100;
        expect(perc).lte(1);
        expect(perc).gte(0);

        const expected = stock.price * (1 - perc);
        expect(stock.getBidPrice()).equal(expected);
      });
    });

    describe("#getForecastIncreaseChance()", function () {
      it("should return the chance that the stock has of increasing in decimal form", function () {
        stock.b = true;

        stock.otlkMagForecast = 90;
        stock.otlkMag = 20; // Absolute forecast of 70
        expect(stock.getForecastIncreaseChance()).equal(0.7);

        stock.otlkMag = 25; // Absolute forecast of 75
        expect(stock.getForecastIncreaseChance()).equal(0.65);

        stock.otlkMagForecast = 100;
        stock.otlkMag = 0; // Absolute forecast of 50
        expect(stock.getForecastIncreaseChance()).equal(0.95);

        stock.otlkMagForecast = 60;
        stock.otlkMag = 25; // Absolute forecast of 75
        expect(stock.getForecastIncreaseChance()).equal(0.35);

        stock.otlkMagForecast = 10;
        expect(stock.getForecastIncreaseChance()).equal(0.05);

        stock.b = false;

        stock.otlkMagForecast = 90;
        stock.otlkMag = 20; // Absolute forecast of 30
        expect(stock.getForecastIncreaseChance()).equal(0.95);

        stock.otlkMagForecast = 50;
        stock.otlkMag = 25; // Absolute forecast of 25
        expect(stock.getForecastIncreaseChance()).equal(0.75);

        stock.otlkMagForecast = 100;
        stock.otlkMag = 0; // Absolute forecast of 50
        expect(stock.getForecastIncreaseChance()).equal(0.95);

        stock.otlkMagForecast = 5;
        stock.otlkMag = 25; // Absolute forecast of 25
        expect(stock.getForecastIncreaseChance()).equal(0.3);

        stock.otlkMagForecast = 10;
        expect(stock.getForecastIncreaseChance()).equal(0.35);

        stock.otlkMagForecast = 50;
        stock.otlkMag = 0;
        expect(stock.getForecastIncreaseChance()).equal(0.5);

        stock.otlkMagForecast = 25;
        stock.otlkMag = 5; // Asolute forecast of 45
        expect(stock.getForecastIncreaseChance()).equal(0.3);
      });
    });

    describe("#influenceForecast()", function () {
      beforeEach(function () {
        stock.otlkMag = 10;
      });

      it("should change the forecast's value towards 50", function () {
        stock.influenceForecast(2);
        expect(stock.otlkMag).equal(8);
      });

      it("should not care about whether the stock is in bull or bear mode", function () {
        stock.b = true;
        stock.influenceForecast(1);
        expect(stock.otlkMag).equal(9);

        stock.b = false;
        stock.influenceForecast(2);
        expect(stock.otlkMag).equal(7);
      });

      it("should not influence the forecast beyond the limit", function () {
        stock.influenceForecast(10);
        expect(stock.otlkMag).equal(StockForecastInfluenceLimit);

        stock.influenceForecast(10);
        expect(stock.otlkMag).equal(StockForecastInfluenceLimit);
      });
    });

    describe("#influenceForecastForecast()", function () {
      it("should change the second-order forecast's value towards 50", function () {
        stock.otlkMagForecast = 75;
        stock.influenceForecastForecast(15);
        expect(stock.otlkMagForecast).equal(60);

        stock.otlkMagForecast = 25;
        stock.influenceForecastForecast(15);
        expect(stock.otlkMagForecast).equal(40);
      });

      it("should not change the second-order forecast past 50", function () {
        stock.otlkMagForecast = 40;
        stock.influenceForecastForecast(20);
        expect(stock.otlkMagForecast).equal(50);

        stock.otlkMagForecast = 60;
        stock.influenceForecastForecast(20);
        expect(stock.otlkMagForecast).equal(50);
      });
    });
  });

  describe("StockMarket object", function () {
    describe("Initialization", function () {
      // Keeps track of initialized stocks. Contains their symbols
      const stocks: string[] = [];

      beforeEach(function () {
        expect(initStockMarket).not.throw();
        expect(initSymbolToStockMap).not.throw();
      });

      it("should have Stock objects", function () {
        for (const prop in StockMarket) {
          const stock = StockMarket[prop];
          if (stock instanceof Stock) {
            stocks.push(stock.symbol);
          }
        }

        // We'll just check that there are some stocks
        expect(stocks.length).gte(1);
      });

      it("should have an order book in the 'Orders' property", function () {
        expect(StockMarket).have.property("Orders");

        const orderbook = StockMarket["Orders"];
        for (const symbol of stocks) {
          const ordersForStock = orderbook[symbol];
          expect(ordersForStock).equal([]);
          expect(ordersForStock.length).equal(0);
        }
      });

      it("should have properties for managing game cycles", function () {
        expect(StockMarket).have.property("storedCycles");
        expect(StockMarket["storedCycles"]).equal(0);
        expect(StockMarket).have.property("lastUpdate");
        expect(StockMarket["lastUpdate"]).equal(0);
        expect(StockMarket).have.property("ticksUntilCycle");
        expect(typeof StockMarket["ticksUntilCycle"]).instanceOf("number");
      });
    });

    describe("Deletion", function () {
      it("should set StockMarket to be an empty object", function () {
        expect(StockMarket).not.equal({});
        deleteStockMarket();
        expect(StockMarket).equal({});
      });
    });

    describe("processStockPrices()", function () {
      beforeEach(function () {
        deleteStockMarket();
        initStockMarket();
        initSymbolToStockMap();
      });

      it("should store cycles until it actually processes", function () {
        expect(StockMarket["storedCycles"]).equal(0);
        processStockPrices(10);
        expect(StockMarket["storedCycles"]).equal(10);
      });

      it("should trigger a price update when it has enough cycles", function () {
        // Get the initial prices
        const initialValues: IMap<any> = {};
        for (const stockName in StockMarket) {
          const stock = StockMarket[stockName];
          if (!(stock instanceof Stock)) {
            continue;
          }
          initialValues[stock.symbol] = {
            b: stock.b,
            otlkMag: stock.otlkMag,
            price: stock.price,
          };
        }

        // Don't know or care how many exact cycles are required
        StockMarket.lastUpdate = new Date().getTime() - 5e3;
        processStockPrices(1e9);

        // Both price and 'otlkMag' should be different
        for (const stockName in StockMarket) {
          const stock = StockMarket[stockName];
          if (!(stock instanceof Stock)) {
            continue;
          }
          const initValue = initialValues[stock.symbol];
          expect(initValue.price).not.equal(stock.price);
          if (initValue.otlkMag === stock.otlkMag && initValue.b === stock.b) {
            throw new Error("expected either price or otlkMag to be different");
          }
        }
      });
    });
  });

  describe("StockToSymbolMap", function () {
    beforeEach(function () {
      deleteStockMarket();
      initStockMarket();
      initSymbolToStockMap();
    });

    it("should map stock symbols to their corresponding Stock Objects", function () {
      for (const stockName in StockMarket) {
        const stock = StockMarket[stockName];
        if (!(stock instanceof Stock)) {
          continue;
        }

        expect(SymbolToStockMap[stock.symbol]).equal(stock);
      }
    });
  });

  describe("Transaction Cost Calculator Functions", function () {
    describe("getBuyTransactionCost()", function () {
      it("should fail on invalid 'stock' argument", function () {
        const res = getBuyTransactionCost({} as Stock, 10, PositionTypes.Long);
        expect(res).equal(null);
      });

      it("should fail on invalid 'shares' arg", function () {
        let res = getBuyTransactionCost(stock, NaN, PositionTypes.Long);
        expect(res).equal(null);

        res = getBuyTransactionCost(stock, -1, PositionTypes.Long);
        expect(res).equal(null);
      });

      it("should properly evaluate LONG transactions", function () {
        const shares = ctorParams.shareTxForMovement / 2;
        const res = getBuyTransactionCost(stock, shares, PositionTypes.Long);
        expect(res).equal(shares * stock.getAskPrice() + commission);
      });

      it("should properly evaluate SHORT transactions", function () {
        const shares = ctorParams.shareTxForMovement / 2;
        const res = getBuyTransactionCost(stock, shares, PositionTypes.Short);
        expect(res).equal(shares * stock.getBidPrice() + commission);
      });

      it("should cap the 'shares' argument at the stock's maximum number of shares", function () {
        const maxRes = getBuyTransactionCost(stock, stock.maxShares, PositionTypes.Long);
        const exceedRes = getBuyTransactionCost(stock, stock.maxShares * 10, PositionTypes.Long);
        expect(maxRes).equal(exceedRes);
      });
    });

    describe("getSellTransactionGain()", function () {
      it("should fail on invalid 'stock' argument", function () {
        const res = getSellTransactionGain({} as Stock, 10, PositionTypes.Long);
        expect(res).equal(null);
      });

      it("should fail on invalid 'shares' arg", function () {
        let res = getSellTransactionGain(stock, NaN, PositionTypes.Long);
        expect(res).equal(null);

        res = getSellTransactionGain(stock, -1, PositionTypes.Long);
        expect(res).equal(null);
      });

      it("should properly evaluate LONG transactionst", function () {
        const shares = ctorParams.shareTxForMovement / 2;
        const res = getSellTransactionGain(stock, shares, PositionTypes.Long);
        const expected = shares * stock.getBidPrice() - commission;
        expect(res).equal(expected);
      });

      it("should properly evaluate SHORT transactions", function () {
        // We need to set this property in order to calculate gains from short position
        stock.playerAvgShortPx = stock.price * 2;

        const shares = ctorParams.shareTxForMovement / 2;
        const res = getSellTransactionGain(stock, shares, PositionTypes.Short);
        const expected =
          shares * stock.playerAvgShortPx + shares * (stock.playerAvgShortPx - stock.getAskPrice()) - commission;
        expect(res).equal(expected);
      });

      it("should cap the 'shares' argument at the stock's maximum number of shares", function () {
        const maxRes = getSellTransactionGain(stock, stock.maxShares, PositionTypes.Long);
        const exceedRes = getSellTransactionGain(stock, stock.maxShares * 10, PositionTypes.Long);
        expect(maxRes).equal(exceedRes);
      });
    });
  });

  describe("Forecast Movement Processor Function", function () {
    // N = 1 is the original forecast
    function getNthForecast(origForecast: number, n: number): number {
      return origForecast - forecastChangePerPriceMovement * (n - 1);
    }

    function getNthForecastForecast(origForecastForecast: number, n: number): number {
      if (stock.otlkMagForecast > 50) {
        const expected = origForecastForecast - forecastChangePerPriceMovement * (n - 1) * (stock.mv / 100);
        return expected < 50 ? 50 : expected;
      } else if (stock.otlkMagForecast < 50) {
        const expected = origForecastForecast + forecastChangePerPriceMovement * (n - 1) * (stock.mv / 100);
        return expected > 50 ? 50 : expected;
      } else {
        return 50;
      }
    }

    describe("processTransactionForecastMovement() for buy transactions", function () {
      const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
      const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

      it("should do nothing on invalid 'stock' argument", function () {
        const oldTracker = stock.shareTxUntilMovement;

        processTransactionForecastMovement({} as Stock, mvmtShares);
        expect(stock.shareTxUntilMovement).equal(oldTracker);
      });

      it("should do nothing on invalid 'shares' arg", function () {
        const oldTracker = stock.shareTxUntilMovement;

        processTransactionForecastMovement(stock, NaN);
        expect(stock.shareTxUntilMovement).equal(oldTracker);

        processTransactionForecastMovement(stock, -1);
        expect(stock.shareTxUntilMovement).equal(oldTracker);
      });

      it("should properly evaluate a LONG transaction that doesn't trigger a forecast movement", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, noMvmtShares);
        expect(stock.otlkMag).equal(oldForecast);
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate a SHORT transaction that doesn't trigger a forecast movement", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, noMvmtShares);
        expect(stock.otlkMag).equal(oldForecast);
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate LONG transactions that triggers forecast movements", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, mvmtShares);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate SHORT transactions that triggers forecast movements", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, mvmtShares);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate LONG transactions of exactly 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate LONG transactions that total to 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2));
        expect(stock.shareTxUntilMovement).lessThan(stock.shareTxForMovement);
        processTransactionForecastMovement(stock, stock.shareTxUntilMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate LONG transactions that are a multiple of 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate SHORT transactions of exactly 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate SHORT transactions that total to 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2));
        expect(stock.shareTxUntilMovement).lessThan(stock.shareTxForMovement);
        processTransactionForecastMovement(stock, stock.shareTxUntilMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate SHORT transactions that are a multiple of 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;
        const oldForecastForecast = stock.otlkMagForecast;

        processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.otlkMagForecast).equal(getNthForecastForecast(oldForecastForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });
    });

    describe("processTransactionForecastMovement() for sell transactions", function () {
      const noMvmtShares = Math.round(ctorParams.shareTxForMovement / 2.2);
      const mvmtShares = ctorParams.shareTxForMovement * 3 + noMvmtShares;

      it("should do nothing on invalid 'stock' argument", function () {
        const oldTracker = stock.shareTxUntilMovement;

        processTransactionForecastMovement({} as Stock, mvmtShares);
        expect(stock.shareTxUntilMovement).equal(oldTracker);
      });

      it("should do nothing on invalid 'shares' arg", function () {
        const oldTracker = stock.shareTxUntilMovement;

        processTransactionForecastMovement(stock, NaN);
        expect(stock.shareTxUntilMovement).equal(oldTracker);

        processTransactionForecastMovement(stock, -1);
        expect(stock.shareTxUntilMovement).equal(oldTracker);
      });

      it("should properly evaluate a LONG transaction that doesn't trigger a price movement", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, noMvmtShares);
        expect(stock.otlkMag).equal(oldForecast);
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate a SHORT transaction that doesn't trigger a price movement", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, noMvmtShares);
        expect(stock.otlkMag).equal(oldForecast);
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate LONG transactions that trigger price movements", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, mvmtShares);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate SHORT transactions that trigger price movements", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, mvmtShares);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement - noMvmtShares);
      });

      it("should properly evaluate LONG transactions of exactly 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate LONG transactions that total to 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2));
        expect(stock.shareTxUntilMovement).lessThan(stock.shareTxForMovement);
        processTransactionForecastMovement(stock, stock.shareTxUntilMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate LONG transactions that are a multiple of 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate SHORT transactions of exactly 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate SHORT transactions that total to 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, Math.round(stock.shareTxForMovement / 2));
        expect(stock.shareTxUntilMovement).lessThan(stock.shareTxForMovement);
        processTransactionForecastMovement(stock, stock.shareTxUntilMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 2));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });

      it("should properly evaluate SHORT transactions that are a multiple of 'shareTxForMovement' shares", function () {
        const oldForecast = stock.otlkMag;

        processTransactionForecastMovement(stock, 3 * stock.shareTxForMovement);
        expect(stock.otlkMag).equal(getNthForecast(oldForecast, 4));
        expect(stock.shareTxUntilMovement).equal(stock.shareTxForMovement);
      });
    });
  });

  describe("Transaction (Buy/Sell) Functions", function () {
    const suppressDialogOpt = { suppressDialog: true };

    describe("buyStock()", function () {
      it("should fail for invalid arguments", function () {
        expect(buyStock({} as Stock, 1, null, suppressDialogOpt)).equal(false);
        expect(buyStock(stock, 0, null, suppressDialogOpt)).equal(false);
        expect(buyStock(stock, -1, null, suppressDialogOpt)).equal(false);
        expect(buyStock(stock, NaN, null, suppressDialogOpt)).equal(false);
      });

      it("should fail if player doesn't have enough money", function () {
        Player.setMoney(0);
        expect(buyStock(stock, 1, null, suppressDialogOpt)).equal(false);
      });

      it("should not allow for transactions that exceed the maximum shares", function () {
        const maxShares = stock.maxShares;
        expect(buyStock(stock, maxShares + 1, null, suppressDialogOpt)).equal(false);
      });

      it("should return true and properly update stock properties for successful transactions", function () {
        const shares = 1e3;
        const cost = getBuyTransactionCost(stock, shares, PositionTypes.Long);
        expect(cost).not.null;

        // Checked above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Player.setMoney(cost!);

        expect(buyStock(stock, shares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShares).equal(shares);
        expect(stock.playerAvgPx).greaterThan(0);
        expect(Player.money).equal(0);
      });
    });

    describe("sellStock()", function () {
      it("should fail for invalid arguments", function () {
        expect(sellStock({} as Stock, 1, null, suppressDialogOpt)).equal(false);
        expect(sellStock(stock, 0, null, suppressDialogOpt)).equal(false);
        expect(sellStock(stock, -1, null, suppressDialogOpt)).equal(false);
        expect(sellStock(stock, NaN, null, suppressDialogOpt)).equal(false);
      });

      it("should fail if player doesn't have any shares", function () {
        Player.setMoney(0);
        expect(sellStock(stock, 1, null, suppressDialogOpt)).equal(false);
      });

      it("should not allow for transactions that exceed the maximum shares", function () {
        const maxShares = stock.maxShares;
        expect(sellStock(stock, maxShares + 1, null, suppressDialogOpt)).equal(false);
      });

      it("should return true and properly update stock properties for successful transactions", function () {
        const shares = 1e3;
        stock.playerShares = shares;
        stock.playerAvgPx = stock.price;
        const gain = getSellTransactionGain(stock, shares, PositionTypes.Long);
        Player.setMoney(0);

        expect(sellStock(stock, shares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShares).equal(0);
        expect(stock.playerAvgPx).equal(0);
        expect(Player.money).equal(gain);
      });

      it("should cap the number of sharse sold to however many the player owns", function () {
        const attemptedShares = 2e3;
        const actualShares = 1e3;
        stock.playerShares = actualShares;
        stock.playerAvgPx = stock.price;
        const gain = getSellTransactionGain(stock, actualShares, PositionTypes.Long);
        Player.setMoney(0);

        expect(sellStock(stock, attemptedShares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShares).equal(0);
        expect(stock.playerAvgPx).equal(0);
        expect(Player.money).equal(gain);
      });

      it("should properly update stock properties for partial transactions", function () {
        const shares = 1e3;
        const origPrice = stock.price;
        stock.playerShares = 2 * shares;
        stock.playerAvgPx = origPrice;
        const gain = getSellTransactionGain(stock, shares, PositionTypes.Long);
        Player.setMoney(0);

        expect(sellStock(stock, shares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShares).equal(shares);
        expect(stock.playerAvgPx).equal(origPrice);
        expect(Player.money).equal(gain);
      });
    });

    describe("shortStock()", function () {
      it("should fail for invalid arguments", function () {
        expect(shortStock({} as Stock, 1, null, suppressDialogOpt)).equal(false);
        expect(shortStock(stock, 0, null, suppressDialogOpt)).equal(false);
        expect(shortStock(stock, -1, null, suppressDialogOpt)).equal(false);
        expect(shortStock(stock, NaN, null, suppressDialogOpt)).equal(false);
      });

      it("should fail if player doesn't have enough money", function () {
        Player.setMoney(0);
        expect(shortStock(stock, 1, null, suppressDialogOpt)).equal(false);
      });

      it("should not allow for transactions that exceed the maximum shares", function () {
        const maxShares = stock.maxShares;
        expect(shortStock(stock, maxShares + 1, null, suppressDialogOpt)).equal(false);
      });

      it("should return true and properly update stock properties for successful transactions", function () {
        const shares = 1e3;
        const cost = getBuyTransactionCost(stock, shares, PositionTypes.Short);
        expect(cost).not.null;

        // Checked above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Player.setMoney(cost!);

        expect(shortStock(stock, shares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShortShares).equal(shares);
        expect(stock.playerAvgShortPx).greaterThan(0);
        expect(Player.money).equal(0);
      });
    });

    describe("sellShort()", function () {
      it("should fail for invalid arguments", function () {
        expect(sellShort({} as Stock, 1, null, suppressDialogOpt)).equal(false);
        expect(sellShort(stock, 0, null, suppressDialogOpt)).equal(false);
        expect(sellShort(stock, -1, null, suppressDialogOpt)).equal(false);
        expect(sellShort(stock, NaN, null, suppressDialogOpt)).equal(false);
      });

      it("should fail if player doesn't have any shares", function () {
        Player.setMoney(0);
        expect(sellShort(stock, 1, null, suppressDialogOpt)).equal(false);
      });

      it("should not allow for transactions that exceed the maximum shares", function () {
        const maxShares = stock.maxShares;
        expect(sellShort(stock, maxShares + 1, null, suppressDialogOpt)).equal(false);
      });

      it("should return true and properly update stock properties for successful transactions", function () {
        const shares = 1e3;
        stock.playerShortShares = shares;
        stock.playerAvgShortPx = stock.price;
        const gain = getSellTransactionGain(stock, shares, PositionTypes.Short);
        Player.setMoney(0);

        expect(sellShort(stock, shares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShortShares).equal(0);
        expect(stock.playerAvgShortPx).equal(0);
        expect(Player.money).equal(gain);
      });

      it("should cap the number of sharse sold to however many the player owns", function () {
        const attemptedShares = 2e3;
        const actualShares = 1e3;
        stock.playerShortShares = actualShares;
        stock.playerAvgShortPx = stock.price;
        const gain = getSellTransactionGain(stock, actualShares, PositionTypes.Short);
        Player.setMoney(0);

        expect(sellShort(stock, attemptedShares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShortShares).equal(0);
        expect(stock.playerAvgShortPx).equal(0);
        expect(Player.money).equal(gain);
      });

      it("should properly update stock properties for partial transactions", function () {
        const shares = 1e3;
        const origPrice = stock.price;
        stock.playerShortShares = 2 * shares;
        stock.playerAvgShortPx = origPrice;
        const gain = getSellTransactionGain(stock, shares, PositionTypes.Short);
        Player.setMoney(0);

        expect(sellShort(stock, shares, null, suppressDialogOpt)).equal(true);
        expect(stock.playerShortShares).equal(shares);
        expect(stock.playerAvgShortPx).equal(origPrice);
        expect(Player.money).equal(gain);
      });
    });
  });

  describe("Order Class", function () {
    it("should throw on invalid arguments", function () {
      function invalid1(): Order {
        return new Order({} as string, 1, 1, OrderTypes.LimitBuy, PositionTypes.Long);
      }
      function invalid2(): Order {
        return new Order("FOO", "z" as any as number, 0, OrderTypes.LimitBuy, PositionTypes.Short);
      }
      function invalid3(): Order {
        return new Order("FOO", 1, {} as number, OrderTypes.LimitBuy, PositionTypes.Short);
      }
      function invalid4(): Order {
        return new Order("FOO", 1, NaN, OrderTypes.LimitBuy, PositionTypes.Short);
      }
      function invalid5(): Order {
        return new Order("FOO", NaN, 0, OrderTypes.LimitBuy, PositionTypes.Short);
      }

      expect(invalid1).throw();
      expect(invalid2).throw();
      expect(invalid3).throw();
      expect(invalid4).throw();
      expect(invalid5).throw();
    });
  });

  describe("Order Placing & Processing", function () {
    beforeEach(function () {
      expect(initStockMarket).not.throw();
      expect(initSymbolToStockMap).not.throw();

      // Create an order book for our mock stock
      StockMarket["Orders"][stock.symbol] = [];
    });

    describe("placeOrder()", function () {
      it("should return false when it's called with invalid arguments", function () {
        const invalid1 = placeOrder({} as Stock, 1, 1, OrderTypes.LimitBuy, PositionTypes.Long);
        const invalid2 = placeOrder(stock, "foo" as any as number, 2, OrderTypes.LimitBuy, PositionTypes.Long);
        const invalid3 = placeOrder(stock, 1, "foo" as any as number, OrderTypes.LimitBuy, PositionTypes.Long);

        expect(invalid1).equal(false);
        expect(invalid2).equal(false);
        expect(invalid3).equal(false);

        expect(StockMarket["Orders"][stock.symbol]).equal([]);
      });

      it("should return true and update the order book for valid arguments", function () {
        const res = placeOrder(stock, 1e3, 9e3, OrderTypes.LimitBuy, PositionTypes.Long);
        expect(res).equal(true);

        expect(StockMarket["Orders"][stock.symbol]).length(1);
        const order = StockMarket["Orders"][stock.symbol][0];
        expect(order).instanceOf(Order);
        expect(order.stockSymbol).equal(ctorParams.symbol);
        expect(order.shares).equal(1e3);
        expect(order.price).equal(9e3);
        expect(order.type).equal(OrderTypes.LimitBuy);
        expect(order.pos).equal(PositionTypes.Long);
      });
    });

    describe("cancelOrder()", function () {
      beforeEach(function () {
        StockMarket["Orders"][stock.symbol] = [];

        const res = placeOrder(stock, 1e3, 9e3, OrderTypes.LimitBuy, PositionTypes.Long);
        expect(res).equal(true);
        expect(StockMarket["Orders"][stock.symbol]).length(1);
      });

      it("returns true & removes an Order from the order book", function () {
        const order = StockMarket["Orders"][stock.symbol][0];
        const res = cancelOrder({ order });
        expect(res).equal(true);
        expect(StockMarket["Orders"][stock.symbol]).length(0);
      });

      it("should also work when passing in order parameters separately", function () {
        const res = cancelOrder({
          stock,
          shares: 1e3,
          price: 9e3,
          type: OrderTypes.LimitBuy,
          pos: PositionTypes.Long,
        });
        expect(res).equal(true);
        expect(StockMarket["Orders"][stock.symbol]).length(0);
      });

      it("should return false and do nothing when the specified order doesn't exist", function () {
        // Same parameters, but its a different object
        const order = new Order(stock.symbol, 1e3, 9e3, OrderTypes.LimitBuy, PositionTypes.Long);
        const res = cancelOrder({ order });
        expect(res).equal(false);
        expect(StockMarket["Orders"][stock.symbol]).length(1);

        const res2 = cancelOrder({
          stock,
          shares: 999,
          price: 9e3,
          type: OrderTypes.LimitBuy,
          pos: PositionTypes.Long,
        });
        expect(res2).equal(false);
        expect(StockMarket["Orders"][stock.symbol]).length(1);
      });
    });

    describe("processOrders()", function () {
      let processOrdersRefs: IProcessOrderRefs;

      beforeEach(function () {
        expect(initStockMarket).not.throw();
        expect(initSymbolToStockMap).not.throw();

        StockMarket[stock.name] = stock;
        SymbolToStockMap[stock.symbol] = stock;
        StockMarket["Orders"][stock.symbol] = [];

        stock.playerShares = 1e3;
        stock.playerShortShares = 1e3;
        Player.setMoney(100e9);

        processOrdersRefs = {
          stockMarket: StockMarket as IStockMarket,
          symbolToStockMap: SymbolToStockMap,
        };
      });

      function checkThatOrderExists(placeOrderRes?: boolean): void {
        if (typeof placeOrderRes === "boolean") {
          expect(placeOrderRes).equal(true);
        }
        expect(StockMarket["Orders"][stock.symbol]).length(1);
      }

      function checkThatOrderExecuted(): void {
        expect(StockMarket["Orders"][stock.symbol]).length(0);
      }

      it("should execute LONG Limit Buy orders when price <= order price", function () {
        const res = placeOrder(stock, 1e3, 9e3, OrderTypes.LimitBuy, PositionTypes.Long);
        checkThatOrderExists(res);

        stock.changePrice(9e3);
        processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Long, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShares).equal(2e3);
      });

      it("should execute SHORT Limit Buy Orders when price >= order price", function () {
        const res = placeOrder(stock, 1e3, 11e3, OrderTypes.LimitBuy, PositionTypes.Short);
        checkThatOrderExists(res);

        stock.changePrice(11e3);
        processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Short, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShortShares).equal(2e3);
      });

      it("should execute LONG Limit Sell Orders when price >= order price", function () {
        const res = placeOrder(stock, 1e3, 11e3, OrderTypes.LimitSell, PositionTypes.Long);
        checkThatOrderExists(res);

        stock.changePrice(11e3);
        processOrders(stock, OrderTypes.LimitSell, PositionTypes.Long, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShares).equal(0);
      });

      it("should execute SHORT Limit Sell Orders when price <= order price", function () {
        const res = placeOrder(stock, 1e3, 9e3, OrderTypes.LimitSell, PositionTypes.Short);
        checkThatOrderExists(res);

        stock.changePrice(9e3);
        processOrders(stock, OrderTypes.LimitSell, PositionTypes.Short, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShortShares).equal(0);
      });

      it("should execute LONG Stop Buy Orders when price >= order price", function () {
        const res = placeOrder(stock, 1e3, 11e3, OrderTypes.StopBuy, PositionTypes.Long);
        checkThatOrderExists(res);

        stock.changePrice(11e3);
        processOrders(stock, OrderTypes.StopBuy, PositionTypes.Long, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShares).equal(2e3);
      });

      it("should execute SHORT Stop Buy Orders when price <= order price", function () {
        const res = placeOrder(stock, 1e3, 9e3, OrderTypes.StopBuy, PositionTypes.Short);
        checkThatOrderExists(res);

        stock.changePrice(9e3);
        processOrders(stock, OrderTypes.StopBuy, PositionTypes.Short, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShortShares).equal(2e3);
      });

      it("should execute LONG Stop Sell Orders when price <= order price", function () {
        const res = placeOrder(stock, 1e3, 9e3, OrderTypes.StopSell, PositionTypes.Long);
        checkThatOrderExists(res);

        stock.changePrice(9e3);
        processOrders(stock, OrderTypes.StopSell, PositionTypes.Long, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShares).equal(0);
      });

      it("should execute SHORT Stop Sell Orders when price >= order price", function () {
        const res = placeOrder(stock, 1e3, 11e3, OrderTypes.StopSell, PositionTypes.Short);
        checkThatOrderExists(res);

        stock.changePrice(11e3);
        processOrders(stock, OrderTypes.StopSell, PositionTypes.Short, processOrdersRefs);
        checkThatOrderExecuted();
        expect(stock.playerShortShares).equal(0);
      });

      it("should execute immediately if their conditions are satisfied", function () {
        placeOrder(stock, 1e3, 11e3, OrderTypes.LimitBuy, PositionTypes.Long);
        checkThatOrderExecuted();
        expect(stock.playerShares).equal(2e3);
      });
    });
  });

  // TODO
  describe("Player Influencing", function () {
    const server = new Server({
      hostname: "mockserver",
      moneyAvailable: 1e6,
      organizationName: "MockStock",
    });

    const company = new Company({
      name: "MockStock",
      info: "",
      companyPositions: {},
      expMultiplier: 1,
      salaryMultiplier: 1,
      jobStatReqOffset: 1,
    });

    beforeEach(function () {
      expect(initStockMarket).not.throw();
      expect(initSymbolToStockMap).not.throw();

      StockMarket[stock.name] = stock;
    });

    describe("influenceStockThroughServerHack()", function () {
      it("should decrease a stock's second-order forecast when all of its money is hacked", function () {
        const oldSecondOrderForecast = stock.otlkMagForecast;
        influenceStockThroughServerHack(server, server.moneyMax);
        expect(stock.otlkMagForecast).equal(oldSecondOrderForecast - forecastForecastChangeFromHack);
      });

      it("should not decrease the stock's second-order forecast when no money is stolen", function () {
        const oldSecondOrderForecast = stock.otlkMagForecast;
        influenceStockThroughServerHack(server, 0);
        expect(stock.otlkMagForecast).equal(oldSecondOrderForecast);
      });
    });

    describe("influenceStockThroughServerGrow()", function () {
      it("should increase a stock's second-order forecast when all of its money is grown", function () {
        const oldSecondOrderForecast = stock.otlkMagForecast;
        influenceStockThroughServerGrow(server, server.moneyMax);
        expect(stock.otlkMagForecast).equal(oldSecondOrderForecast + forecastForecastChangeFromHack);
      });

      it("should not increase the stock's second-order forecast when no money is grown", function () {
        const oldSecondOrderForecast = stock.otlkMagForecast;
        influenceStockThroughServerGrow(server, 0);
        expect(stock.otlkMagForecast).equal(oldSecondOrderForecast);
      });
    });

    describe("influenceStockThroughCompanyWork()", function () {
      it("should increase the server's second order forecast", function () {
        const oldSecondOrderForecast = stock.otlkMagForecast;

        // Use 1e3 for numCycles to force a change
        // (This may break later if numbers are rebalanced);
        influenceStockThroughCompanyWork(company, 1, 500);
        expect(stock.otlkMagForecast).equal(oldSecondOrderForecast + forecastForecastChangeFromCompanyWork);
      });

      it("should be affected by performanceMult", function () {
        const oldSecondOrderForecast = stock.otlkMagForecast;

        // Use 1e3 for numCycles to force a change
        // (This may break later if numbers are rebalanced);
        influenceStockThroughCompanyWork(company, 4, 1e3);
        expect(stock.otlkMagForecast).equal(oldSecondOrderForecast + 4 * forecastForecastChangeFromCompanyWork);
      });
    });
  });
});
