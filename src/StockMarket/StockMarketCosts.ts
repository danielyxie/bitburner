import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";

export function getStockMarket4SDataCost(): number {
  return CONSTANTS.MarketData4SCost * BitNodeMultipliers.FourSigmaMarketDataCost;
}

export function getStockMarket4STixApiCost(): number {
  return CONSTANTS.MarketDataTixApi4SCost * BitNodeMultipliers.FourSigmaMarketDataApiCost;
}
