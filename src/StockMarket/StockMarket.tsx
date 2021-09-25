import { IOrderBook } from "./IOrderBook";
import { IStockMarket } from "./IStockMarket";
import { Order } from "./Order";
import { processOrders } from "./OrderProcessing";
import { Stock } from "./Stock";
import { TicksPerCycle } from "./StockMarketConstants";
import { InitStockMetadata } from "./data/InitStockMetadata";
import { OrderTypes } from "./data/OrderTypes";
import { PositionTypes } from "./data/PositionTypes";
import { StockSymbols } from "./data/StockSymbols";

import { CONSTANTS } from "../Constants";
import { WorkerScript } from "../Netscript/WorkerScript";
import { IMap } from "../types";
import { EventEmitter } from "../utils/EventEmitter";

import { numeralWrapper } from ".././ui/numeralFormat";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reviver } from "../utils/JSONReviver";

export let StockMarket: IStockMarket = {
  lastUpdate: 0,
  Orders: {},
  storedCycles: 0,
  ticksUntilCycle: 0,
} as IStockMarket; // Maps full stock name -> Stock object
export const SymbolToStockMap: IMap<Stock> = {}; // Maps symbol -> Stock object

export function placeOrder(
  stock: Stock,
  shares: number,
  price: number,
  type: OrderTypes,
  position: PositionTypes,
  workerScript: WorkerScript | null = null,
): boolean {
  if (!(stock instanceof Stock)) {
    if (workerScript) {
      workerScript.log("placeOrder", `Invalid stock: '${stock}'`);
    } else {
      dialogBoxCreate(`ERROR: Invalid stock passed to placeOrder() function`);
    }
    return false;
  }
  if (typeof shares !== "number" || typeof price !== "number") {
    if (workerScript) {
      workerScript.log("placeOrder", `Invalid arguments: shares='${shares}' price='${price}'`);
    } else {
      dialogBoxCreate("ERROR: Invalid numeric value provided for either 'shares' or 'price' argument");
    }
    return false;
  }

  const order = new Order(stock.symbol, shares, price, type, position);
  if (StockMarket["Orders"] == null) {
    const orders: IOrderBook = {};
    for (const name in StockMarket) {
      const stk = StockMarket[name];
      if (!(stk instanceof Stock)) {
        continue;
      }
      orders[stk.symbol] = [];
    }
    StockMarket["Orders"] = orders;
  }
  StockMarket["Orders"][stock.symbol].push(order);

  // Process to see if it should be executed immediately
  const processOrderRefs = {
    stockMarket: StockMarket as IStockMarket,
    symbolToStockMap: SymbolToStockMap,
  };
  processOrders(stock, order.type, order.pos, processOrderRefs);

  return true;
}

// Returns true if successfully cancels an order, false otherwise
interface ICancelOrderParams {
  order?: Order;
  pos?: PositionTypes;
  price?: number;
  shares?: number;
  stock?: Stock;
  type?: OrderTypes;
}
export function cancelOrder(params: ICancelOrderParams, workerScript: WorkerScript | null = null): boolean {
  if (StockMarket["Orders"] == null) {
    return false;
  }
  if (params.order && params.order instanceof Order) {
    const order = params.order;
    // An 'Order' object is passed in
    const stockOrders = StockMarket["Orders"][order.stockSymbol];
    for (let i = 0; i < stockOrders.length; ++i) {
      if (order == stockOrders[i]) {
        stockOrders.splice(i, 1);
        return true;
      }
    }
    return false;
  } else if (
    params.stock &&
    params.shares &&
    params.price &&
    params.type &&
    params.pos &&
    params.stock instanceof Stock
  ) {
    // Order properties are passed in. Need to look for the order
    const stockOrders = StockMarket["Orders"][params.stock.symbol];
    const orderTxt = params.stock.symbol + " - " + params.shares + " @ " + numeralWrapper.formatMoney(params.price);
    for (let i = 0; i < stockOrders.length; ++i) {
      const order = stockOrders[i];
      if (
        params.shares === order.shares &&
        params.price === order.price &&
        params.type === order.type &&
        params.pos === order.pos
      ) {
        stockOrders.splice(i, 1);
        if (workerScript) {
          workerScript.scriptRef.log("Successfully cancelled order: " + orderTxt);
        }
        return true;
      }
    }
    if (workerScript) {
      workerScript.scriptRef.log("Failed to cancel order: " + orderTxt);
    }
    return false;
  }
  return false;
}

export function loadStockMarket(saveString: string): void {
  if (saveString === "") {
    StockMarket = {
      lastUpdate: 0,
      Orders: {},
      storedCycles: 0,
      ticksUntilCycle: 0,
    } as IStockMarket;
  } else {
    StockMarket = JSON.parse(saveString, Reviver);
  }
}

export function deleteStockMarket(): void {
  StockMarket = {
    lastUpdate: 0,
    Orders: {},
    storedCycles: 0,
    ticksUntilCycle: 0,
  } as IStockMarket;
}

export function initStockMarket(): void {
  for (const stk in StockMarket) {
    if (StockMarket.hasOwnProperty(stk)) {
      delete StockMarket[stk];
    }
  }

  for (const metadata of InitStockMetadata) {
    const name = metadata.name;
    StockMarket[name] = new Stock(metadata);
  }

  const orders: IOrderBook = {};
  for (const name in StockMarket) {
    const stock = StockMarket[name];
    if (!(stock instanceof Stock)) {
      continue;
    }
    orders[stock.symbol] = [];
  }
  StockMarket["Orders"] = orders;

  StockMarket.storedCycles = 0;
  StockMarket.lastUpdate = 0;
  StockMarket.ticksUntilCycle = TicksPerCycle;
}

export function initSymbolToStockMap(): void {
  for (const name in StockSymbols) {
    if (StockSymbols.hasOwnProperty(name)) {
      const stock = StockMarket[name];
      if (stock == null) {
        console.error(`Could not find Stock for ${name}`);
        continue;
      }
      const symbol = StockSymbols[name];
      SymbolToStockMap[symbol] = stock;
    }
  }
}

export function stockMarketCycle(): void {
  for (const name in StockMarket) {
    const stock = StockMarket[name];
    if (!(stock instanceof Stock)) {
      continue;
    }

    const roll = Math.random();
    if (roll < 0.45) {
      stock.b = !stock.b;
      stock.flipForecastForecast();
    }

    StockMarket.ticksUntilCycle = TicksPerCycle;
  }
}

// Stock prices updated every 6 seconds
const msPerStockUpdate = 6e3;
const cyclesPerStockUpdate = msPerStockUpdate / CONSTANTS.MilliPerCycle;
export function processStockPrices(numCycles = 1): void {
  if (StockMarket.storedCycles == null || isNaN(StockMarket.storedCycles)) {
    StockMarket.storedCycles = 0;
  }
  StockMarket.storedCycles += numCycles;

  if (StockMarket.storedCycles < cyclesPerStockUpdate) {
    return;
  }

  // We can process the update every 4 seconds as long as there are enough
  // stored cycles. This lets us account for offline time
  const timeNow = new Date().getTime();
  if (timeNow - StockMarket.lastUpdate < 4e3) {
    return;
  }

  StockMarket.lastUpdate = timeNow;
  StockMarket.storedCycles -= cyclesPerStockUpdate;

  // Cycle
  if (StockMarket.ticksUntilCycle == null || typeof StockMarket.ticksUntilCycle !== "number") {
    StockMarket.ticksUntilCycle = TicksPerCycle;
  }
  --StockMarket.ticksUntilCycle;
  if (StockMarket.ticksUntilCycle <= 0) {
    stockMarketCycle();
  }

  const v = Math.random();
  for (const name in StockMarket) {
    const stock = StockMarket[name];
    if (!(stock instanceof Stock)) {
      continue;
    }
    let av = (v * stock.mv) / 100;
    if (isNaN(av)) {
      av = 0.02;
    }

    let chc = 50;
    if (stock.b) {
      chc = (chc + stock.otlkMag) / 100;
    } else {
      chc = (chc - stock.otlkMag) / 100;
    }
    if (stock.price >= stock.cap) {
      chc = 0.1; // "Soft Limit" on stock price. It could still go up but its unlikely
      stock.b = false;
    }
    if (isNaN(chc)) {
      chc = 0.5;
    }

    const c = Math.random();
    const processOrderRefs = {
      stockMarket: StockMarket,
      symbolToStockMap: SymbolToStockMap,
    };
    if (c < chc) {
      stock.changePrice(stock.price * (1 + av));
      processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Short, processOrderRefs);
      processOrders(stock, OrderTypes.LimitSell, PositionTypes.Long, processOrderRefs);
      processOrders(stock, OrderTypes.StopBuy, PositionTypes.Long, processOrderRefs);
      processOrders(stock, OrderTypes.StopSell, PositionTypes.Short, processOrderRefs);
    } else {
      stock.changePrice(stock.price / (1 + av));
      processOrders(stock, OrderTypes.LimitBuy, PositionTypes.Long, processOrderRefs);
      processOrders(stock, OrderTypes.LimitSell, PositionTypes.Short, processOrderRefs);
      processOrders(stock, OrderTypes.StopBuy, PositionTypes.Short, processOrderRefs);
      processOrders(stock, OrderTypes.StopSell, PositionTypes.Long, processOrderRefs);
    }

    let otlkMagChange = stock.otlkMag * av;
    if (stock.otlkMag < 5) {
      if (stock.otlkMag <= 1) {
        otlkMagChange = 1;
      } else {
        otlkMagChange *= 10;
      }
    }
    stock.cycleForecast(otlkMagChange);
    stock.cycleForecastForecast(otlkMagChange / 2);

    // Shares required for price movement gradually approaches max over time
    stock.shareTxUntilMovement = Math.min(stock.shareTxUntilMovement + 10, stock.shareTxForMovement);
  }
}

export function initStockMarketFnForReact(): void {
  initStockMarket();
  initSymbolToStockMap();
}

export const eventEmitterForUiReset = new EventEmitter<[]>();
