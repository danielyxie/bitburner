import { Corporation } from "./Corporation/Corporation";
import { PlayerObject } from "./PersonObjects/Player/PlayerObject";

import { Reviver } from "../utils/JSONReviver";

import Decimal from "decimal.js";

export let Player = new PlayerObject();

export function loadPlayer(saveString) {
    Player  = JSON.parse(saveString, Reviver);

    // Parse Decimal.js objects
    Player.money = new Decimal(Player.money);

    if (Player.corporation instanceof Corporation) {
        Player.corporation.funds = new Decimal(Player.corporation.funds);
        Player.corporation.revenue = new Decimal(Player.corporation.revenue);
        Player.corporation.expenses = new Decimal(Player.corporation.expenses);

        for (var i = 0; i < Player.corporation.divisions.length; ++i) {
            var ind = Player.corporation.divisions[i];
            ind.lastCycleRevenue = new Decimal(ind.lastCycleRevenue);
            ind.lastCycleExpenses = new Decimal(ind.lastCycleExpenses);
            ind.thisCycleRevenue = new Decimal(ind.thisCycleRevenue);
            ind.thisCycleExpenses = new Decimal(ind.thisCycleExpenses);
        }
    }
}
