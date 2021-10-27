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
  getSymbols(): any;
  getPrice(symbol: any): any;
  getAskPrice(symbol: any): any;
  getBidPrice(symbol: any): any;
  getPosition(symbol: any): any;
  getMaxShares(symbol: any): any;
  getPurchaseCost(symbol: any, shares: any, posType: any): any;
  getSaleGain(symbol: any, shares: any, posType: any): any;
  buy(symbol: any, shares: any): any;
  sell(symbol: any, shares: any): any;
  short(symbol: any, shares: any): any;
  sellShort(symbol: any, shares: any): any;
  placeOrder(symbol: any, shares: any, price: any, type: any, pos: any): any;
  cancelOrder(symbol: any, shares: any, price: any, type: any, pos: any): any;
  getOrders(): any;
  getVolatility(symbol: any): any;
  getForecast(symbol: any): any;
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
    getSymbols: function (): any {
      helper.updateDynamicRam("getSymbols", getRamCost("stock", "getSymbols"));
      checkTixApiAccess("getSymbols");
      return Object.values(StockSymbols);
    },
    getPrice: function (symbol: any): any {
      helper.updateDynamicRam("getPrice", getRamCost("stock", "getPrice"));
      checkTixApiAccess("getPrice");
      const stock = getStockFromSymbol(symbol, "getPrice");

      return stock.price;
    },
    getAskPrice: function (symbol: any): any {
      helper.updateDynamicRam("getAskPrice", getRamCost("stock", "getAskPrice"));
      checkTixApiAccess("getAskPrice");
      const stock = getStockFromSymbol(symbol, "getAskPrice");

      return stock.getAskPrice();
    },
    getBidPrice: function (symbol: any): any {
      helper.updateDynamicRam("getBidPrice", getRamCost("stock", "getBidPrice"));
      checkTixApiAccess("getBidPrice");
      const stock = getStockFromSymbol(symbol, "getBidPrice");

      return stock.getBidPrice();
    },
    getPosition: function (symbol: any): any {
      helper.updateDynamicRam("getPosition", getRamCost("stock", "getPosition"));
      checkTixApiAccess("getPosition");
      const stock = SymbolToStockMap[symbol];
      if (stock == null) {
        throw helper.makeRuntimeErrorMsg("getPosition", `Invalid stock symbol: ${symbol}`);
      }
      return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
    },
    getMaxShares: function (symbol: any): any {
      helper.updateDynamicRam("getMaxShares", getRamCost("stock", "getMaxShares"));
      checkTixApiAccess("getMaxShares");
      const stock = getStockFromSymbol(symbol, "getMaxShares");

      return stock.maxShares;
    },
    getPurchaseCost: function (symbol: any, shares: any, posType: any): any {
      helper.updateDynamicRam("getPurchaseCost", getRamCost("stock", "getPurchaseCost"));
      checkTixApiAccess("getPurchaseCost");
      const stock = getStockFromSymbol(symbol, "getPurchaseCost");
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
    getSaleGain: function (symbol: any, shares: any, posType: any): any {
      helper.updateDynamicRam("getSaleGain", getRamCost("stock", "getSaleGain"));
      checkTixApiAccess("getSaleGain");
      const stock = getStockFromSymbol(symbol, "getSaleGain");
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
    buy: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("buy", getRamCost("stock", "buy"));
      checkTixApiAccess("buy");
      const stock = getStockFromSymbol(symbol, "buy");
      const res = buyStock(stock, shares, workerScript, {});
      return res ? stock.price : 0;
    },
    sell: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("sell", getRamCost("stock", "sell"));
      checkTixApiAccess("sell");
      const stock = getStockFromSymbol(symbol, "sell");
      const res = sellStock(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    short: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("short", getRamCost("stock", "short"));
      checkTixApiAccess("short");
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 1) {
          throw helper.makeRuntimeErrorMsg(
            "short",
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(symbol, "short");
      const res = shortStock(stock, shares, workerScript, {});

      return res ? stock.price : 0;
    },
    sellShort: function (symbol: any, shares: any): any {
      helper.updateDynamicRam("sellShort", getRamCost("stock", "sellShort"));
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
      helper.updateDynamicRam("placeOrder", getRamCost("stock", "placeOrder"));
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
      helper.updateDynamicRam("cancelOrder", getRamCost("stock", "cancelOrder"));
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
      helper.updateDynamicRam("getOrders", getRamCost("stock", "getOrders"));
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
    getVolatility: function (symbol: any): any {
      helper.updateDynamicRam("getVolatility", getRamCost("stock", "getVolatility"));
      if (!player.has4SDataTixApi) {
        throw helper.makeRuntimeErrorMsg("getVolatility", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getVolatility");

      return stock.mv / 100; // Convert from percentage to decimal
    },
    getForecast: function (symbol: any): any {
      helper.updateDynamicRam("getForecast", getRamCost("stock", "getForecast"));
      if (!player.has4SDataTixApi) {
        throw helper.makeRuntimeErrorMsg("getForecast", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getForecast");

      let forecast = 50;
      stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
      return forecast / 100; // Convert from percentage to decimal
    },
    purchase4SMarketData: function () {
      helper.updateDynamicRam("purchase4SMarketData", getRamCost("stock", "purchase4SMarketData"));
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
      player.loseMoney(getStockMarket4SDataCost(), "stock");
      workerScript.log("purchase4SMarketData", "Purchased 4S Market Data");
      return true;
    },
    purchase4SMarketDataTixApi: function () {
      helper.updateDynamicRam("purchase4SMarketDataTixApi", getRamCost("stock", "purchase4SMarketDataTixApi"));
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
      player.loseMoney(getStockMarket4STixApiCost(), "stock");
      workerScript.log("purchase4SMarketDataTixApi", "Purchased 4S Market Data TIX API");
      return true;
    },
  };
}
