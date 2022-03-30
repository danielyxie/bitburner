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
import {
  getStockMarket4SDataCost,
  getStockMarket4STixApiCost,
  getStockMarketWseCost,
  getStockMarketTixApiCost,
} from "../StockMarket/StockMarketCosts";
import { Stock } from "../StockMarket/Stock";
import { TIX } from "../ScriptEditor/NetscriptDefinitions";

export function NetscriptStockMarket(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): TIX {
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
    getSymbols: function (): string[] {
      helper.updateDynamicRam("getSymbols", getRamCost(player, "stock", "getSymbols"));
      checkTixApiAccess("getSymbols");
      return Object.values(StockSymbols);
    },
    getPrice: function (_symbol: unknown): number {
      helper.updateDynamicRam("getPrice", getRamCost(player, "stock", "getPrice"));
      const symbol = helper.string("getPrice", "symbol", _symbol);
      checkTixApiAccess("getPrice");
      const stock = getStockFromSymbol(symbol, "getPrice");

      return stock.price;
    },
    getAskPrice: function (_symbol: unknown): number {
      helper.updateDynamicRam("getAskPrice", getRamCost(player, "stock", "getAskPrice"));
      const symbol = helper.string("getAskPrice", "symbol", _symbol);
      checkTixApiAccess("getAskPrice");
      const stock = getStockFromSymbol(symbol, "getAskPrice");

      return stock.getAskPrice();
    },
    getBidPrice: function (_symbol: unknown): number {
      helper.updateDynamicRam("getBidPrice", getRamCost(player, "stock", "getBidPrice"));
      const symbol = helper.string("getBidPrice", "symbol", _symbol);
      checkTixApiAccess("getBidPrice");
      const stock = getStockFromSymbol(symbol, "getBidPrice");

      return stock.getBidPrice();
    },
    getPosition: function (_symbol: unknown): [number, number, number, number] {
      helper.updateDynamicRam("getPosition", getRamCost(player, "stock", "getPosition"));
      const symbol = helper.string("getPosition", "symbol", _symbol);
      checkTixApiAccess("getPosition");
      const stock = SymbolToStockMap[symbol];
      if (stock == null) {
        throw helper.makeRuntimeErrorMsg("getPosition", `Invalid stock symbol: ${symbol}`);
      }
      return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
    },
    getMaxShares: function (_symbol: unknown): number {
      helper.updateDynamicRam("getMaxShares", getRamCost(player, "stock", "getMaxShares"));
      const symbol = helper.string("getMaxShares", "symbol", _symbol);
      checkTixApiAccess("getMaxShares");
      const stock = getStockFromSymbol(symbol, "getMaxShares");

      return stock.maxShares;
    },
    getPurchaseCost: function (_symbol: unknown, _shares: unknown, _posType: unknown): number {
      helper.updateDynamicRam("getPurchaseCost", getRamCost(player, "stock", "getPurchaseCost"));
      const symbol = helper.string("getPurchaseCost", "symbol", _symbol);
      let shares = helper.number("getPurchaseCost", "shares", _shares);
      const posType = helper.string("getPurchaseCost", "posType", _posType);
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
    getSaleGain: function (_symbol: unknown, _shares: unknown, _posType: unknown): number {
      helper.updateDynamicRam("getSaleGain", getRamCost(player, "stock", "getSaleGain"));
      const symbol = helper.string("getSaleGain", "symbol", _symbol);
      let shares = helper.number("getSaleGain", "shares", _shares);
      const posType = helper.string("getSaleGain", "posType", _posType);
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
    buy: function (_symbol: unknown, _shares: unknown): number {
      helper.updateDynamicRam("buy", getRamCost(player, "stock", "buy"));
      const symbol = helper.string("buy", "symbol", _symbol);
      const shares = helper.number("buy", "shares", _shares);
      checkTixApiAccess("buy");
      const stock = getStockFromSymbol(symbol, "buy");
      const res = buyStock(stock, shares, workerScript, {});
      return res ? stock.getAskPrice() : 0;
    },
    sell: function (_symbol: unknown, _shares: unknown): number {
      helper.updateDynamicRam("sell", getRamCost(player, "stock", "sell"));
      const symbol = helper.string("sell", "symbol", _symbol);
      const shares = helper.number("sell", "shares", _shares);
      checkTixApiAccess("sell");
      const stock = getStockFromSymbol(symbol, "sell");
      const res = sellStock(stock, shares, workerScript, {});

      return res ? stock.getBidPrice() : 0;
    },
    short: function (_symbol: unknown, _shares: unknown): number {
      helper.updateDynamicRam("short", getRamCost(player, "stock", "short"));
      const symbol = helper.string("short", "symbol", _symbol);
      const shares = helper.number("short", "shares", _shares);
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

      return res ? stock.getBidPrice() : 0;
    },
    sellShort: function (_symbol: unknown, _shares: unknown): number {
      helper.updateDynamicRam("sellShort", getRamCost(player, "stock", "sellShort"));
      const symbol = helper.string("sellShort", "symbol", _symbol);
      const shares = helper.number("sellShort", "shares", _shares);
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

      return res ? stock.getAskPrice() : 0;
    },
    placeOrder: function (_symbol: unknown, _shares: unknown, _price: unknown, _type: unknown, _pos: unknown): boolean {
      helper.updateDynamicRam("placeOrder", getRamCost(player, "stock", "placeOrder"));
      const symbol = helper.string("placeOrder", "symbol", _symbol);
      const shares = helper.number("placeOrder", "shares", _shares);
      const price = helper.number("placeOrder", "price", _price);
      const type = helper.string("placeOrder", "type", _type);
      const pos = helper.string("placeOrder", "pos", _pos);
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
    cancelOrder: function (
      _symbol: unknown,
      _shares: unknown,
      _price: unknown,
      _type: unknown,
      _pos: unknown,
    ): boolean {
      helper.updateDynamicRam("cancelOrder", getRamCost(player, "stock", "cancelOrder"));
      const symbol = helper.string("cancelOrder", "symbol", _symbol);
      const shares = helper.number("cancelOrder", "shares", _shares);
      const price = helper.number("cancelOrder", "price", _price);
      const type = helper.string("cancelOrder", "type", _type);
      const pos = helper.string("cancelOrder", "pos", _pos);
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
      helper.updateDynamicRam("getOrders", getRamCost(player, "stock", "getOrders"));
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
      for (const symbol of Object.keys(stockMarketOrders)) {
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
    getVolatility: function (_symbol: unknown): number {
      helper.updateDynamicRam("getVolatility", getRamCost(player, "stock", "getVolatility"));
      const symbol = helper.string("getVolatility", "symbol", _symbol);
      if (!player.has4SDataTixApi) {
        throw helper.makeRuntimeErrorMsg("getVolatility", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getVolatility");

      return stock.mv / 100; // Convert from percentage to decimal
    },
    getForecast: function (_symbol: unknown): number {
      helper.updateDynamicRam("getForecast", getRamCost(player, "stock", "getForecast"));
      const symbol = helper.string("getForecast", "symbol", _symbol);
      if (!player.has4SDataTixApi) {
        throw helper.makeRuntimeErrorMsg("getForecast", "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(symbol, "getForecast");

      let forecast = 50;
      stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
      return forecast / 100; // Convert from percentage to decimal
    },
    purchase4SMarketData: function (): boolean {
      helper.updateDynamicRam("purchase4SMarketData", getRamCost(player, "stock", "purchase4SMarketData"));
      checkTixApiAccess("purchase4SMarketData");

      if (player.has4SData) {
        workerScript.log("stock.purchase4SMarketData", () => "Already purchased 4S Market Data.");
        return true;
      }

      if (player.money < getStockMarket4SDataCost()) {
        workerScript.log("stock.purchase4SMarketData", () => "Not enough money to purchase 4S Market Data.");
        return false;
      }

      player.has4SData = true;
      player.loseMoney(getStockMarket4SDataCost(), "stock");
      workerScript.log("stock.purchase4SMarketData", () => "Purchased 4S Market Data");
      return true;
    },
    purchase4SMarketDataTixApi: function (): boolean {
      helper.updateDynamicRam("purchase4SMarketDataTixApi", getRamCost(player, "stock", "purchase4SMarketDataTixApi"));
      checkTixApiAccess("purchase4SMarketDataTixApi");

      if (player.has4SDataTixApi) {
        workerScript.log("stock.purchase4SMarketDataTixApi", () => "Already purchased 4S Market Data TIX API");
        return true;
      }

      if (player.money < getStockMarket4STixApiCost()) {
        workerScript.log(
          "stock.purchase4SMarketDataTixApi",
          () => "Not enough money to purchase 4S Market Data TIX API",
        );
        return false;
      }

      player.has4SDataTixApi = true;
      player.loseMoney(getStockMarket4STixApiCost(), "stock");
      workerScript.log("stock.purchase4SMarketDataTixApi", () => "Purchased 4S Market Data TIX API");
      return true;
    },
    purchaseWseAccount: function (): boolean {
      helper.updateDynamicRam("PurchaseWseAccount", getRamCost(player, "stock", "purchaseWseAccount"));

      if (player.hasWseAccount) {
        workerScript.log("stock.purchaseWseAccount", () => "Already purchased WSE Account");
        return true;
      }

      if (player.money < getStockMarketWseCost()) {
        workerScript.log("stock.purchaseWseAccount", () => "Not enough money to purchase WSE Account Access");
        return false;
      }

      player.hasWseAccount = true;
      player.loseMoney(getStockMarketWseCost(), "stock");
      workerScript.log("stock.purchaseWseAccount", () => "Purchased WSE Account Access");
      return true;
    },
    purchaseTixApi: function (): boolean {
      helper.updateDynamicRam("purchaseTixApi", getRamCost(player, "stock", "purchaseTixApi"));

      if (player.hasTixApiAccess) {
        workerScript.log("stock.purchaseTixApi", () => "Already purchased TIX API");
        return true;
      }

      if (player.money < getStockMarketTixApiCost()) {
        workerScript.log("stock.purchaseTixApi", () => "Not enough money to purchase TIX API Access");
        return false;
      }

      player.hasTixApiAccess = true;
      player.loseMoney(getStockMarketTixApiCost(), "stock");
      workerScript.log("stock.purchaseTixApi", () => "Purchased TIX API");
      return true;
    },
  };
}
