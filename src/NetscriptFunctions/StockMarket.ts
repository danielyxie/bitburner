import { INetscriptHelper } from "./INetscriptHelper";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { getRamCost } from "../Netscript/RamCostGenerator";
import { buyStock, sellStock, shortStock, sellShort } from "../StockMarket/BuyingAndSelling";
import { StockMarket, SymbolToStockMap, placeOrder, cancelOrder } from "../StockMarket/StockMarket";
import { getBuyTransactionCost, getSellTransactionGain } from "../StockMarket/StockMarketHelpers";
import { OrderTypes } from "../StockMarket/data/OrderTypes";
import { PositionTypes } from "../StockMarket/data/PositionTypes";
import { StockSymbols } from "../StockMarket/data/StockSymbols";
import { getStockMarket4SDataCost, getStockMarket4STixApiCost } from "../StockMarket/StockMarketCosts";
import { Stock } from "../StockMarket/Stock";

export interface INetscriptStockMarket {
  getStockSymbols(): any;
  getStockPrice(symbol: any): any;
  getStockAskPrice(symbol: any): any;
  getStockBidPrice(symbol: any): any;
  getStockPosition(symbol: any): any;
  getStockMaxShares(symbol: any): any;
  getStockPurchaseCost(symbol: any, shares: any, posType: any): any;
  getStockSaleGain(symbol: any, shares: any, posType: any): any;
  buyStock(symbol: any, shares: any): any;
  sellStock(symbol: any, shares: any): any;
  shortStock(symbol: any, shares: any): any;
  sellShort(symbol: any, shares: any): any;
  placeOrder(symbol: any, shares: any, price: any, type: any, pos: any): any;
  cancelOrder(symbol: any, shares: any, price: any, type: any, pos: any): any;
  getOrders(): any;
  getStockVolatility(symbol: any): any;
  getStockForecast(symbol: any): any;
  purchase4SMarketData(): void;
  purchase4SMarketDataTixApi(): void;
}

export function NetscriptStockMarket(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptStockMarket {
  /**
   * Checks if the player has TIX API access. Throws an error if the player does not
   */
  const checkTixApiAccess = function (callingFn: string): void {
    if (!player.hasWseAccount) {
      throw helper.makeRuntimeErrorMsg(callingFn, `You don't have WSE Access! Cannot use ${callingFn}()`);
    }
    if (!player.hasTixApiAccess) {
      throw helper.makeRuntimeErrorMsg(callingFn, `You don't have TIX API Access! Cannot use ${callingFn}()`);
    }
  };

  const getStockFromSymbol = function (symbol: string, callingFn: string): Stock {
    const stock = SymbolToStockMap[symbol];
    if (stock == null) {
      throw helper.makeRuntimeErrorMsg(callingFn, `Invalid stock symbol: '${symbol}'`);
    }

    return stock;
  };
  return {
    getStockSymbols: function (): any {
      helper.updateDynamicRam("getStockSymbols", getRamCost("getStockSymbols"));
      checkTixApiAccess("getStockSymbols");
      return Object.values(StockSymbols);
    },
    getStockPrice: function (symbol: any): any {
      helper.updateDynamicRam("getStockPrice", getRamCost("getStockPrice"));
      checkTixApiAccess("getStockPrice");
      const stock = getStockFromSymbol(symbol, "getStockPrice");

      return stock.price;
    },
    getStockAskPrice: function (symbol: any): any {
      helper.updateDynamicRam("getStockAskPrice", getRamCost("getStockAskPrice"));
      checkTixApiAccess("getStockAskPrice");
      const stock = getStockFromSymbol(symbol, "getStockAskPrice");

      return stock.getAskPrice();
    },
    getStockBidPrice: function (symbol: any): any {
      helper.updateDynamicRam("getStockBidPrice", getRamCost("getStockBidPrice"));
      checkTixApiAccess("getStockBidPrice");
      const stock = getStockFromSymbol(symbol, "getStockBidPrice");

      return stock.getBidPrice();
    },
    getStockPosition: function (symbol: any): any {
      helper.updateDynamicRam("getStockPosition", getRamCost("getStockPosition"));
      checkTixApiAccess("getStockPosition");
      const stock = SymbolToStockMap[symbol];
      if (stock == null) {
        throw helper.makeRuntimeErrorMsg("getStockPosition", `Invalid stock symbol: ${symbol}`);
      }
      return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
    },
    getStockMaxShares: function (symbol: any): any {
      helper.updateDynamicRam("getStockMaxShares", getRamCost("getStockMaxShares"));
      checkTixApiAccess("getStockMaxShares");
      const stock = getStockFromSymbol(symbol, "getStockMaxShares");

      return stock.maxShares;
    },
    getStockPurchaseCost: function (symbol: any, shares: any, posType: any): any {
      helper.updateDynamicRam("getStockPurchaseCost", getRamCost("getStockPurchaseCost"));
      checkTixApiAccess("getStockPurchaseCost");
      const stock = getStockFromSymbol(symbol, "getStockPurchaseCost");
      shares = Math.round(shares);

      let pos;
      const sanitizedPosType = posType.toLowerCase();
      if (sanitizedPosType.includes("l")) {
        pos = PositionTypes.Long;
      } else if (sanitizedPosType.includes("s")) {
        pos = PositionTypes.Short;
      } else {
        return Infinity;
      }

      const res = getBuyTransactionCost(stock, shares, pos);
      if (res == null) {
        return Infinity;
      }

      return res;
    },
    getStockSaleGain: function (symbol: any, shares: any, posType: any): any {
      helper.updateDynamicRam("getStockSaleGain", getRamCost("getStockSaleGain"));
      checkTixApiAccess("getStockSaleGain");
      const stock = getStockFromSymbol(symbol, "getStockSaleGain");
      shares = Math.round(shares);

      let pos;
      const sanitizedPosType = posType.toLowerCase();
      if (sanitizedPosType.includes("l")) {
        pos = PositionTypes.Long;
      } else if (sanitizedPosType.includes("s")) {
        pos = PositionTypes.Short;
      } else {
        return 0;
      }

      const res = getSellTransactionGain(stock, shares, pos);
      if (res == null) {
        return 0;
      }

      return res;
    },
    buyStock: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("buyStock", getRamCost("buyStock"));
      checkTixApiAccess("buyStock");
      const stock = getStockFromSymbol(symbol, "buyStock");
      const res = buyStock(stock, shares, workerScript, {});
      return res ? stock.price : 0;
    },
    sellStock: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("sellStock", getRamCost("sellStock"));
      checkTixApiAccess("sellStock");
      const stock = getStockFromSymbol(symbol, "sellStock");
      const res = sellStock(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    shortStock: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("shortStock", getRamCost("shortStock"));
      checkTixApiAccess("shortStock");
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 1) {
          throw helper.makeRuntimeErrorMsg(
            "shortStock",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "shortStock");
      const res = shortStock(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    sellShort: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("sellShort", getRamCost("sellShort"));
      checkTixApiAccess("sellShort");
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 1) {
          throw helper.makeRuntimeErrorMsg(
            "sellShort",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "sellShort");
      const res = sellShort(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    placeOrder: function (symbol: any, shares: any, price: any, type: any, pos: any): any {
      helper.updateDynamicRam("placeOrder", getRamCost("placeOrder"));
      checkTixApiAccess("placeOrder");
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw helper.makeRuntimeErrorMsg(
            "placeOrder",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 3.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "placeOrder");

      let orderType;
      let orderPos;
      const ltype = type.toLowerCase();
      if (ltype.includes("limit") && ltype.includes("buy")) {
        orderType = OrderTypes.LimitBuy;
      } else if (ltype.includes("limit") && ltype.includes("sell")) {
        orderType = OrderTypes.LimitSell;
      } else if (ltype.includes("stop") && ltype.includes("buy")) {
        orderType = OrderTypes.StopBuy;
      } else if (ltype.includes("stop") && ltype.includes("sell")) {
        orderType = OrderTypes.StopSell;
      } else {
        throw helper.makeRuntimeErrorMsg("placeOrder", `Invalid order type: ${type}`);
      }

      const lpos = pos.toLowerCase();
      if (lpos.includes("l")) {
        orderPos = PositionTypes.Long;
      } else if (lpos.includes("s")) {
        orderPos = PositionTypes.Short;
      } else {
        throw helper.makeRuntimeErrorMsg("placeOrder", `Invalid position type: ${pos}`);
      }

      return placeOrder(stock, shares, price, orderType, orderPos, workerScript);
    },
    cancelOrder: function (symbol: any, shares: any, price: any, type: any, pos: any): any {
      helper.updateDynamicRam("cancelOrder", getRamCost("cancelOrder"));
      checkTixApiAccess("cancelOrder");
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw helper.makeRuntimeErrorMsg(
            "cancelOrder",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 3.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "cancelOrder");
      if (isNaN(shares) || isNaN(price)) {
        throw helper.makeRuntimeErrorMsg(
          "cancelOrder",
          `Invalid shares or price. Must be numeric. shares=${shares}, price=${price}`,
        );
      }
      let orderType;
      let orderPos;
      const ltype = type.toLowerCase();
      if (ltype.includes("limit") && ltype.includes("buy")) {
        orderType = OrderTypes.LimitBuy;
      } else if (ltype.includes("limit") && ltype.includes("sell")) {
        orderType = OrderTypes.LimitSell;
      } else if (ltype.includes("stop") && ltype.includes("buy")) {
        orderType = OrderTypes.StopBuy;
      } else if (ltype.includes("stop") && ltype.includes("sell")) {
        orderType = OrderTypes.StopSell;
      } else {
        throw helper.makeRuntimeErrorMsg("cancelOrder", `Invalid order type: ${type}`);
      }

      const lpos = pos.toLowerCase();
      if (lpos.includes("l")) {
        orderPos = PositionTypes.Long;
      } else if (lpos.includes("s")) {
        orderPos = PositionTypes.Short;
      } else {
        throw helper.makeRuntimeErrorMsg("cancelOrder", `Invalid position type: ${pos}`);
      }
      const params = {
        stock: stock,
        shares: shares,
        price: price,
        type: orderType,
        pos: orderPos,
      };
      return cancelOrder(params, workerScript);
    },
    getOrders: function (): any {
      helper.updateDynamicRam("getOrders", getRamCost("getOrders"));
      checkTixApiAccess("getOrders");
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw helper.makeRuntimeErrorMsg(
            "getOrders",
            "You must either be in BitNode-8 or have Source-File 8 Level 3.",
          );
        }
      }

      const orders: any = {};

      const stockMarketOrders = StockMarket["Orders"];
      for (const symbol in stockMarketOrders) {
        const orderBook = stockMarketOrders[symbol];
        if (orderBook.constructor === Array && orderBook.length > 0) {
          orders[symbol] = [];
          for (let i = 0; i < orderBook.length; ++i) {
            orders[symbol].push({
              shares: orderBook[i].shares,
              price: orderBook[i].price,
              type: orderBook[i].type,
              position: orderBook[i].pos,
            });
          }
        }
      }

      return orders;
    },
    getStockVolatility: function (symbol: any): any {
      helper.updateDynamicRam("getStockVolatility", getRamCost("getStockVolatility"));
      if (!player.has4SDataTixApi) {
        throw helper.makeRuntimeErrorMsg("getStockVolatility", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getStockVolatility");

      return stock.mv / 100; // Convert from percentage to decimal
    },
    getStockForecast: function (symbol: any): any {
      helper.updateDynamicRam("getStockForecast", getRamCost("getStockForecast"));
      if (!player.has4SDataTixApi) {
        throw helper.makeRuntimeErrorMsg("getStockForecast", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getStockForecast");

      let forecast = 50;
      stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
      return forecast / 100; // Convert from percentage to decimal
    },
    purchase4SMarketData: function () {
      helper.updateDynamicRam("purchase4SMarketData", getRamCost("purchase4SMarketData"));
      checkTixApiAccess("purchase4SMarketData");

      if (player.has4SData) {
        workerScript.log("purchase4SMarketData", "Already purchased 4S Market Data.");
        return true;
      }

      if (player.money.lt(getStockMarket4SDataCost())) {
        workerScript.log("purchase4SMarketData", "Not enough money to purchase 4S Market Data.");
        return false;
      }

      player.has4SData = true;
      player.loseMoney(getStockMarket4SDataCost());
      workerScript.log("purchase4SMarketData", "Purchased 4S Market Data");
      return true;
    },
    purchase4SMarketDataTixApi: function () {
      helper.updateDynamicRam("purchase4SMarketDataTixApi", getRamCost("purchase4SMarketDataTixApi"));
      checkTixApiAccess("purchase4SMarketDataTixApi");

      if (player.has4SDataTixApi) {
        workerScript.log("purchase4SMarketDataTixApi", "Already purchased 4S Market Data TIX API");
        return true;
      }

      if (player.money.lt(getStockMarket4STixApiCost())) {
        workerScript.log("purchase4SMarketDataTixApi", "Not enough money to purchase 4S Market Data TIX API");
        return false;
      }

      player.has4SDataTixApi = true;
      player.loseMoney(getStockMarket4STixApiCost());
      workerScript.log("purchase4SMarketDataTixApi", "Purchased 4S Market Data TIX API");
      return true;
    },
  };
}
