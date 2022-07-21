import { WorkerScript } from "../Netscript/WorkerScript";
import { IPlayer } from "../PersonObjects/IPlayer";
import { buyStock, sellStock, shortStock, sellShort } from "../StockMarket/BuyingAndSelling";
import { StockMarket, SymbolToStockMap, placeOrder, cancelOrder, initStockMarketFn } from "../StockMarket/StockMarket";
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
import { InternalAPI, NetscriptContext } from "src/Netscript/APIWrapper";

export function NetscriptStockMarket(player: IPlayer, workerScript: WorkerScript): InternalAPI<TIX> {
  /**
   * Checks if the player has TIX API access. Throws an error if the player does not
   */
  const checkTixApiAccess = function (ctx: NetscriptContext): void {
    if (!player.hasWseAccount) {
      throw ctx.makeRuntimeErrorMsg(`You don't have WSE Access! Cannot use ${ctx.function}()`);
    }
    if (!player.hasTixApiAccess) {
      throw ctx.makeRuntimeErrorMsg(`You don't have TIX API Access! Cannot use ${ctx.function}()`);
    }
  };

  const getStockFromSymbol = function (ctx: NetscriptContext, symbol: string): Stock {
    const stock = SymbolToStockMap[symbol];
    if (stock == null) {
      throw ctx.makeRuntimeErrorMsg(`Invalid stock symbol: '${symbol}'`);
    }

    return stock;
  };

  return {
    getSymbols: (ctx: NetscriptContext) => (): string[] => {
      checkTixApiAccess(ctx);
      return Object.values(StockSymbols);
    },
    getPrice:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        checkTixApiAccess(ctx);
        const stock = getStockFromSymbol(ctx, symbol);

        return stock.price;
      },
    getAskPrice:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        checkTixApiAccess(ctx);
        const stock = getStockFromSymbol(ctx, symbol);

        return stock.getAskPrice();
      },
    getBidPrice:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        checkTixApiAccess(ctx);
        const stock = getStockFromSymbol(ctx, symbol);

        return stock.getBidPrice();
      },
    getPosition:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): [number, number, number, number] => {
        const symbol = ctx.helper.string("symbol", _symbol);
        checkTixApiAccess(ctx);
        const stock = SymbolToStockMap[symbol];
        if (stock == null) {
          throw ctx.makeRuntimeErrorMsg(`Invalid stock symbol: ${symbol}`);
        }
        return [stock.playerShares, stock.playerAvgPx, stock.playerShortShares, stock.playerAvgShortPx];
      },
    getMaxShares:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        checkTixApiAccess(ctx);
        const stock = getStockFromSymbol(ctx, symbol);

        return stock.maxShares;
      },
    getPurchaseCost:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown, _posType: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        let shares = ctx.helper.number("shares", _shares);
        const posType = ctx.helper.string("posType", _posType);
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
    getSaleGain:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown, _posType: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        let shares = ctx.helper.number("shares", _shares);
        const posType = ctx.helper.string("posType", _posType);
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
    buyStock:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        const shares = ctx.helper.number("shares", _shares);
        checkTixApiAccess(ctx);
        const stock = getStockFromSymbol(ctx, symbol);
        const res = buyStock(stock, shares, workerScript, {});
        return res ? stock.getAskPrice() : 0;
      },
    sellStock:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        const shares = ctx.helper.number("shares", _shares);
        checkTixApiAccess(ctx);
        const stock = getStockFromSymbol(ctx, symbol);
        const res = sellStock(stock, shares, workerScript, {});

        return res ? stock.getBidPrice() : 0;
      },
    short:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        const shares = ctx.helper.number("shares", _shares);
        checkTixApiAccess(ctx);
        if (player.bitNodeN !== 8) {
          if (player.sourceFileLvl(8) <= 1) {
            throw ctx.makeRuntimeErrorMsg("You must either be in BitNode-8 or you must have Source-File 8 Level 2.");
          }
        }
        const stock = getStockFromSymbol(ctx, symbol);
        const res = shortStock(stock, shares, workerScript, {});

        return res ? stock.getBidPrice() : 0;
      },
    sellShort:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        const shares = ctx.helper.number("shares", _shares);
        checkTixApiAccess(ctx);
        if (player.bitNodeN !== 8) {
          if (player.sourceFileLvl(8) <= 1) {
            throw ctx.makeRuntimeErrorMsg("You must either be in BitNode-8 or you must have Source-File 8 Level 2.");
          }
        }
        const stock = getStockFromSymbol(ctx, symbol);
        const res = sellShort(stock, shares, workerScript, {});

        return res ? stock.getAskPrice() : 0;
      },
    placeOrder:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown, _price: unknown, _type: unknown, _pos: unknown): boolean => {
        const symbol = ctx.helper.string("symbol", _symbol);
        const shares = ctx.helper.number("shares", _shares);
        const price = ctx.helper.number("price", _price);
        const type = ctx.helper.string("type", _type);
        const pos = ctx.helper.string("pos", _pos);
        checkTixApiAccess(ctx);
        if (player.bitNodeN !== 8) {
          if (player.sourceFileLvl(8) <= 2) {
            throw ctx.makeRuntimeErrorMsg("You must either be in BitNode-8 or you must have Source-File 8 Level 3.");
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
          throw ctx.makeRuntimeErrorMsg(`Invalid order type: ${type}`);
        }

        const lpos = pos.toLowerCase();
        if (lpos.includes("l")) {
          orderPos = PositionTypes.Long;
        } else if (lpos.includes("s")) {
          orderPos = PositionTypes.Short;
        } else {
          throw ctx.makeRuntimeErrorMsg(`Invalid position type: ${pos}`);
        }

        return placeOrder(stock, shares, price, orderType, orderPos, workerScript);
      },
    cancelOrder:
      (ctx: NetscriptContext) =>
      (_symbol: unknown, _shares: unknown, _price: unknown, _type: unknown, _pos: unknown): boolean => {
        const symbol = ctx.helper.string("symbol", _symbol);
        const shares = ctx.helper.number("shares", _shares);
        const price = ctx.helper.number("price", _price);
        const type = ctx.helper.string("type", _type);
        const pos = ctx.helper.string("pos", _pos);
        checkTixApiAccess(ctx);
        if (player.bitNodeN !== 8) {
          if (player.sourceFileLvl(8) <= 2) {
            throw ctx.makeRuntimeErrorMsg("You must either be in BitNode-8 or you must have Source-File 8 Level 3.");
          }
        }
        const stock = getStockFromSymbol(ctx, symbol);
        if (isNaN(shares) || isNaN(price)) {
          throw ctx.makeRuntimeErrorMsg(`Invalid shares or price. Must be numeric. shares=${shares}, price=${price}`);
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
          throw ctx.makeRuntimeErrorMsg(`Invalid order type: ${type}`);
        }

        const lpos = pos.toLowerCase();
        if (lpos.includes("l")) {
          orderPos = PositionTypes.Long;
        } else if (lpos.includes("s")) {
          orderPos = PositionTypes.Short;
        } else {
          throw ctx.makeRuntimeErrorMsg(`Invalid position type: ${pos}`);
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
    getOrders: (ctx: NetscriptContext) => (): StockOrder => {
      checkTixApiAccess(ctx);
      if (player.bitNodeN !== 8) {
        if (player.sourceFileLvl(8) <= 2) {
          throw ctx.makeRuntimeErrorMsg("You must either be in BitNode-8 or have Source-File 8 Level 3.");
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
    getVolatility:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        if (!player.has4SDataTixApi) {
          throw ctx.makeRuntimeErrorMsg("You don't have 4S Market Data TIX API Access!");
        }
        const stock = getStockFromSymbol(ctx, symbol);

        return stock.mv / 100; // Convert from percentage to decimal
      },
    getForecast:
      (ctx: NetscriptContext) =>
      (_symbol: unknown): number => {
        const symbol = ctx.helper.string("symbol", _symbol);
        if (!player.has4SDataTixApi) {
          throw ctx.makeRuntimeErrorMsg("You don't have 4S Market Data TIX API Access!");
        }
        const stock = getStockFromSymbol(ctx, symbol);

        let forecast = 50;
        stock.b ? (forecast += stock.otlkMag) : (forecast -= stock.otlkMag);
        return forecast / 100; // Convert from percentage to decimal
      },
    purchase4SMarketData: (ctx: NetscriptContext) => (): boolean => {
      if (player.has4SData) {
        ctx.log(() => "Already purchased 4S Market Data.");
        return true;
      }

      if (player.money < getStockMarket4SDataCost()) {
        ctx.log(() => "Not enough money to purchase 4S Market Data.");
        return false;
      }

      player.has4SData = true;
      player.loseMoney(getStockMarket4SDataCost(), "stock");
      ctx.log(() => "Purchased 4S Market Data");
      return true;
    },
    purchase4SMarketDataTixApi: (ctx: NetscriptContext) => (): boolean => {
      checkTixApiAccess(ctx);

      if (player.has4SDataTixApi) {
        ctx.log(() => "Already purchased 4S Market Data TIX API");
        return true;
      }

      if (player.money < getStockMarket4STixApiCost()) {
        ctx.log(() => "Not enough money to purchase 4S Market Data TIX API");
        return false;
      }

      player.has4SDataTixApi = true;
      player.loseMoney(getStockMarket4STixApiCost(), "stock");
      ctx.log(() => "Purchased 4S Market Data TIX API");
      return true;
    },
    purchaseWseAccount: (ctx: NetscriptContext) => (): boolean => {
      if (player.hasWseAccount) {
        ctx.log(() => "Already purchased WSE Account");
        return true;
      }

      if (player.money < getStockMarketWseCost()) {
        ctx.log(() => "Not enough money to purchase WSE Account Access");
        return false;
      }

      player.hasWseAccount = true;
      initStockMarketFn();
      player.loseMoney(getStockMarketWseCost(), "stock");
      ctx.log(() => "Purchased WSE Account Access");
      return true;
    },
    purchaseTixApi: (ctx: NetscriptContext) => (): boolean => {
      if (player.hasTixApiAccess) {
        ctx.log(() => "Already purchased TIX API");
        return true;
      }

      if (player.money < getStockMarketTixApiCost()) {
        ctx.log(() => "Not enough money to purchase TIX API Access");
        return false;
      }

      player.hasTixApiAccess = true;
      player.loseMoney(getStockMarketTixApiCost(), "stock");
      ctx.log(() => "Purchased TIX API");
      return true;
    },
  };
}
