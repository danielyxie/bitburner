import { Corporation } from "./Corporation/Corporation";
import { PlayerObject } from "./PersonObjects/Player/PlayerObject";
import { sanitizeExploits } from "./Exploits/Exploit";

import { Reviver } from "./utils/JSONReviver";
import Decimal from "decimal.js";
import { Programs } from "./Programs/Programs";

export let Player = new PlayerObject();

export function loadPlayer(saveString: string): void {
  Player = JSON.parse(saveString, Reviver);

  // Parse Decimal.js objects
  Player.money = new Decimal(Player.money);

  if (Player.corporation instanceof Corporation) {
    Player.corporation.funds = new Decimal(Player.corporation.funds);
    Player.corporation.revenue = new Decimal(Player.corporation.revenue);
    Player.corporation.expenses = new Decimal(Player.corporation.expenses);

    for (let i = 0; i < Player.corporation.divisions.length; ++i) {
      const ind = Player.corporation.divisions[i];
      ind.lastCycleRevenue = new Decimal(ind.lastCycleRevenue);
      ind.lastCycleExpenses = new Decimal(ind.lastCycleExpenses);
      ind.thisCycleRevenue = new Decimal(ind.thisCycleRevenue);
      ind.thisCycleExpenses = new Decimal(ind.thisCycleExpenses);
    }
  }

  Player.exploits = sanitizeExploits(Player.exploits);
}
