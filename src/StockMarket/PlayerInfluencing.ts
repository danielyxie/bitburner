/**
 * Implementation of the mechanisms that allow the player to affect the
 * Stock Market
 */
import { Stock } from "./Stock";
import { StockMarket } from "./StockMarket";

import { Company } from "../Company/Company";
import { Server } from "../Server/Server";

// Change in second-order forecast due to hacks/grows
const forecastForecastChangeFromHack = 0.1;

// Change in second-order forecast due to company work
const forecastForecastChangeFromCompanyWork = 0.001;

/**
 * Potentially decreases a stock's second-order forecast when its corresponding
 * server is hacked. The chance of the hack decreasing the stock's second-order
 * forecast is dependent on what percentage of the server's money is hacked
 * @param {Server} server - Server being hack()ed
 * @param {number} moneyHacked - Amount of money stolen from the server
 */
export function influenceStockThroughServerHack(server: Server, moneyHacked: number): void {
    const orgName = server.organizationName;
    let stock: Stock | null = null;
    if (typeof orgName === "string" && orgName !== "") {
        stock = StockMarket[orgName];
    }
    if (!(stock instanceof Stock)) { return; }

    const percTotalMoneyHacked = moneyHacked / server.moneyMax;
    if (Math.random() < percTotalMoneyHacked) {
        console.log(`Influencing stock ${stock.name}`);
        stock.changeForecastForecast(stock.otlkMagForecast - forecastForecastChangeFromHack);
    }
}

/**
 * Potentially increases a stock's second-order forecast when its corresponding
 * server is grown (grow()). The chance of the grow() to increase the stock's
 * second-order forecast is dependent on how much money is added to the server
 * @param {Server} server - Server being grow()n
 * @param {number} moneyHacked - Amount of money added to the server
 */
export function influenceStockThroughServerGrow(server: Server, moneyGrown: number): void {
    const orgName = server.organizationName;
    let stock: Stock | null = null;
    if (typeof orgName === "string" && orgName !== "") {
        stock = StockMarket[orgName];
    }
    if (!(stock instanceof Stock)) { return; }

    const percTotalMoneyGrown = moneyGrown / server.moneyMax;
    if (Math.random() < percTotalMoneyGrown) {
        console.log(`Influencing stock ${stock.name}`);
        stock.changeForecastForecast(stock.otlkMagForecast + forecastForecastChangeFromHack);
    }
}

/**
 * Potentially increases a stock's second-order forecast when the player works for
 * its corresponding company.
 * @param {Company} company - Company being worked for
 * @param {number} performanceMult - Effectiveness of player's work. Affects influence
 * @param {number} cyclesOfWork - # game cycles of work being processed
 */
export function influenceStockThroughCompanyWork(company: Company, performanceMult: number, cyclesOfWork: number): void {
    const compName = company.name;
    let stock: Stock | null = null;
    if (typeof compName === "string" && compName !== "") {
        stock = StockMarket[compName];
    }
    if (!(stock instanceof Stock)) { return; }

    if (Math.random() < 0.001 * cyclesOfWork) {
        const change = forecastForecastChangeFromCompanyWork * performanceMult;
        stock.changeForecastForecast(stock.otlkMagForecast + change);
    }
}
