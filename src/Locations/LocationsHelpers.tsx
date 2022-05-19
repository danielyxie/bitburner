/**
 * Location and traveling-related helper functions.
 * Mostly used for UI
 */
import { SpecialServers } from "../Server/data/SpecialServers";
import { CONSTANTS } from "../Constants";

import { IPlayer } from "../PersonObjects/IPlayer";
import { GetServer } from "../Server/AllServers";

import { dialogBoxCreate } from "../ui/React/DialogBox";

/**
 * Attempt to purchase a TOR router
 * @param {IPlayer} p - Player object
 */
export function purchaseTorRouter(p: IPlayer): void {
  if (p.hasTorRouter) {
    dialogBoxCreate(`You already have a TOR Router!`);
    return;
  }
  if (!p.canAfford(CONSTANTS.TorRouterCost)) {
    dialogBoxCreate("You cannot afford to purchase the TOR router!");
    return;
  }
  p.loseMoney(CONSTANTS.TorRouterCost, "other");

  const darkweb = GetServer(SpecialServers.DarkWeb);
  p.hasTorRouter = true;

  p.getHomeComputer()!.serversOnNetwork!.push(darkweb!.hostname);
  darkweb!.serversOnNetwork.push(p.getHomeComputer().hostname);
  dialogBoxCreate(
    "You have purchased a TOR router!<br>" +
      "You now have access to the dark web from your home computer.<br>" +
      "Use the scan/scan-analyze commands to search for the dark web connection.",
  );
}
