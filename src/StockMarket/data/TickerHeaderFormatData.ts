import { StockSymbols } from "./StockSymbols";

export const TickerHeaderFormatData = {
  longestName: 0,
  longestSymbol: 0,
};

for (const [key, symbol] of Object.entries(StockSymbols)) {
  TickerHeaderFormatData.longestName = Math.max(key.length, TickerHeaderFormatData.longestName);
  TickerHeaderFormatData.longestSymbol = Math.max(symbol.length, TickerHeaderFormatData.longestSymbol);
}
