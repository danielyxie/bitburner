import { PlayerObject } from "./PersonObjects/Player/PlayerObject";
import { sanitizeExploits } from "./Exploits/Exploit";

import { Reviver } from "./utils/JSONReviver";

export let Player = new PlayerObject();

export function loadPlayer(saveString: string): void {
  Player = JSON.parse(saveString, Reviver);
  Player.money = parseFloat(Player.money as any);
  Player.exploits = sanitizeExploits(Player.exploits);
}
