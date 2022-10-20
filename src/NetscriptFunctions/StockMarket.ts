import { Player as player } from "../Player";
import { buyStock, sellStock, shortStock, sellShort } from "../StockMarket/BuyingAndSelling";
import { StockMarket, SymbolToStockMap, placeOrder, cancelOrder, initStockMarket } from "../StockMarket/StockMarket";
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
import { StockOrder, TIX } from "../ScriptEditor/NetscriptDefinitions";
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { helpers } from "../Netscript/NetscriptHelpers";

export function NetscriptStockMarket(): InternalAPI<TIX> {
  /** Checks if the player has TIX API access. Throws an error if the player does not */
  const checkTixApiAccess = function (ctx: NetscriptContext): void {
    if (!player.hasWseAccount) {
      throw helpers.makeRuntimeErrorMsg(ctx, `You don't have WSE Access! Cannot use ${ctx.function}()`);
    }
    if (!player.hasTixApiAccess) {
      throw helpers.makeRuntimeErrorMsg(ctx, `You don't have TIX API Access! Cannot use ${ctx.function}()`);
    }
  };

  const getStockFromSymbol = function (ctx: NetscriptContext, symbol: string): Stock {
    const stock = SymbolToStockMap[symbol];
    if (stock == null) {
      throw helpers.makeRuntimeErrorMsg(ctx, `Invalid stock symbol: '${symbol}'`);
    }

    return stock;
  };

  return {
    hasWSEAccount: () => () => {
      return player.hasWseAccount;
    },
    hasTIXAPIAccess: () => () => {
      return player.hasTixApiAccess;
    },
    has4SData: () => () => {
      return player.has4SData;
    },
    has4SDataTIXAPI: () => () => {
      return player.has4SDataTixApi;
    },
    getSymbols: (ctx) => () => {
      checkTixApiAccess(ctx);
      return Object.values(StockSymbols);
    },
    getPrice: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);

      return stock.price;
    },
    getAskPrice: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);

      return stock.getAskPrice();
    },
    getBidPrice: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);

      return stock.getBidPrice();
    },
    getPosition: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      checkTixApiAccess(ctx);
      const stock = SymbolToStockMap[symbol];
      if (stock == null) {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid stock symbol: ${symbol}`);
      }
      return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
    },
    getMaxShares: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);

      return stock.maxShares;
    },
    getPurchaseCost: (ctx) => (_symbol, _shares, _posType) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      let shares = helpers.number(ctx, "shares", _shares);
      const posType = helpers.string(ctx, "posType", _posType);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);
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
    getSaleGain: (ctx) => (_symbol, _shares, _posType) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      let shares = helpers.number(ctx, "shares", _shares);
      const posType = helpers.string(ctx, "posType", _posType);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);
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
    buyStock: (ctx) => (_symbol, _shares) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      const shares = helpers.number(ctx, "shares", _shares);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);
      const res = buyStock(stock, shares, ctx, {});
      return res ? stock.getAskPrice() : 0;
    },
    sellStock: (ctx) => (_symbol, _shares) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      const shares = helpers.number(ctx, "shares", _shares);
      checkTixApiAccess(ctx);
      const stock = getStockFromSymbol(ctx, symbol);
      const res = sellStock(stock, shares, ctx, {});

      return res ? stock.getBidPrice() : 0;
    },
    buyShort: (ctx) => (_symbol, _shares) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      const shares = helpers.number(ctx, "shares", _shares);
      checkTixApiAccess(ctx);
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 1) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(ctx, symbol);
      const res = shortStock(stock, shares, ctx, {});

      return res ? stock.getBidPrice() : 0;
    },
    sellShort: (ctx) => (_symbol, _shares) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      const shares = helpers.number(ctx, "shares", _shares);
      checkTixApiAccess(ctx);
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 1) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            "You must either be in BitNode-8 or you must have Source-File 8 Level 2.",
          );
        }
      }
      const stock = getStockFromSymbol(ctx, symbol);
      const res = sellShort(stock, shares, ctx, {});

      return res ? stock.getAskPrice() : 0;
    },
    placeOrder: (ctx) => (_symbol, _shares, _price, _type, _pos) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      const shares = helpers.number(ctx, "shares", _shares);
      const price = helpers.number(ctx, "price", _price);
      const type = helpers.string(ctx, "type", _type);
      const pos = helpers.string(ctx, "pos", _pos);
      checkTixApiAccess(ctx);
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            "You must either be in BitNode-8 or you must have Source-File 8 Level 3.",
          );
        }
      }
      const stock = getStockFromSymbol(ctx, symbol);

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
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid order type: ${type}`);
      }

      const lpos = pos.toLowerCase();
      if (lpos.includes("l")) {
        orderPos = PositionTypes.Long;
      } else if (lpos.includes("s")) {
        orderPos = PositionTypes.Short;
      } else {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid position type: ${pos}`);
      }

      return placeOrder(stock, shares, price, orderType, orderPos, ctx);
    },
    cancelOrder: (ctx) => (_symbol, _shares, _price, _type, _pos) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      const shares = helpers.number(ctx, "shares", _shares);
      const price = helpers.number(ctx, "price", _price);
      const type = helpers.string(ctx, "type", _type);
      const pos = helpers.string(ctx, "pos", _pos);
      checkTixApiAccess(ctx);
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw helpers.makeRuntimeErrorMsg(
            ctx,
            "You must either be in BitNode-8 or you must have Source-File 8 Level 3.",
          );
        }
      }
      const stock = getStockFromSymbol(ctx, symbol);
      if (isNaN(shares) || isNaN(price)) {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
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
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid order type: ${type}`);
      }

      const lpos = pos.toLowerCase();
      if (lpos.includes("l")) {
        orderPos = PositionTypes.Long;
      } else if (lpos.includes("s")) {
        orderPos = PositionTypes.Short;
      } else {
        throw helpers.makeRuntimeErrorMsg(ctx, `Invalid position type: ${pos}`);
      }
      const params = {
        stock: stock,
        shares: shares,
        price: price,
        type: orderType,
        pos: orderPos,
      };
      return cancelOrder(params, ctx);
    },
    getOrders: (ctx) => () => {
      checkTixApiAccess(ctx);
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw helpers.makeRuntimeErrorMsg(ctx, "You must either be in BitNode-8 or have Source-File 8 Level 3.");
        }
      }

      const orders: StockOrder = {};

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
    getVolatility: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      if (!player.has4SDataTixApi) {
        throw helpers.makeRuntimeErrorMsg(ctx, "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(ctx, symbol);

      return stock.mv / 100; // Convert from percentage to decimal
    },
    getForecast: (ctx) => (_symbol) => {
      const symbol = helpers.string(ctx, "symbol", _symbol);
      if (!player.has4SDataTixApi) {
        throw helpers.makeRuntimeErrorMsg(ctx, "You don't have 4S Market Data TIX API Access!");
      }
      const stock = getStockFromSymbol(ctx, symbol);

      let forecast = 50;
      stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
      return forecast / 100; // Convert from percentage to decimal
    },
    purchase4SMarketData: (ctx) => () => {
      if (player.has4SData) {
        helpers.log(ctx, () => "Already purchased 4S Market Data.");
        return true;
      }

      if (player.money < getStockMarket4SDataCost()) {
        helpers.log(ctx, () => "Not enough money to purchase 4S Market Data.");
        return false;
      }

      player.has4SData = true;
      player.loseMoney(getStockMarket4SDataCost(), "stock");
      helpers.log(ctx, () => "Purchased 4S Market Data");
      return true;
    },
    purchase4SMarketDataTixApi: (ctx) => () => {
      checkTixApiAccess(ctx);

      if (player.has4SDataTixApi) {
        helpers.log(ctx, () => "Already purchased 4S Market Data TIX API");
        return true;
      }

      if (player.money < getStockMarket4STixApiCost()) {
        helpers.log(ctx, () => "Not enough money to purchase 4S Market Data TIX API");
        return false;
      }

      player.has4SDataTixApi = true;
      player.loseMoney(getStockMarket4STixApiCost(), "stock");
      helpers.log(ctx, () => "Purchased 4S Market Data TIX API");
      return true;
    },
    purchaseWseAccount: (ctx) => () => {
      if (player.hasWseAccount) {
        helpers.log(ctx, () => "Already purchased WSE Account");
        return true;
      }

      if (player.money < getStockMarketWseCost()) {
        helpers.log(ctx, () => "Not enough money to purchase WSE Account Access");
        return false;
      }

      player.hasWseAccount = true;
      initStockMarket();
      player.loseMoney(getStockMarketWseCost(), "stock");
      helpers.log(ctx, () => "Purchased WSE Account Access");
      return true;
    },
    purchaseTixApi: (ctx) => () => {
      if (player.hasTixApiAccess) {
        helpers.log(ctx, () => "Already purchased TIX API");
        return true;
      }

      if (player.money < getStockMarketTixApiCost()) {
        helpers.log(ctx, () => "Not enough money to purchase TIX API Access");
        return false;
      }

      player.hasTixApiAccess = true;
      player.loseMoney(getStockMarketTixApiCost(), "stock");
      helpers.log(ctx, () => "Purchased TIX API");
      return true;
    },
  };
}
