/**
 * Location and traveling-related helper functions.
 * Mostly used for UI
 */
import { CONSTANTS } from "../Constants";

import { IPlayer } from "../PersonObjects/IPlayer";
import { AddToAllServers, createUniqueRandomIp } from "../Server/AllServers";
import { safetlyCreateUniqueServer } from "../Server/ServerHelpers";
import { SpecialServerIps } from "../Server/SpecialServerIps";

import { dialogBoxCreate } from "../ui/React/DialogBox";

/**
 * Attempt to purchase a TOR router
 * @param {IPlayer} p - Player object
 */
export function purchaseTorRouter(p: IPlayer): void {
  if (p.hasTorRouter()) {
    dialogBoxCreate(`You already have a TOR Router!`);
    return;
  }
  if (!p.canAfford(CONSTANTS.TorRouterCost)) {
    dialogBoxCreate("You cannot afford to purchase the TOR router!");
    return;
  }
  p.loseMoney(CONSTANTS.TorRouterCost);

  const darkweb = safetlyCreateUniqueServer({
    ip: createUniqueRandomIp(),
    hostname: "darkweb",
    organizationName: "",
    isConnectedTo: false,
    adminRights: false,
    purchasedByPlayer: false,
    maxRam: 1,
  });
  AddToAllServers(darkweb);
  SpecialServerIps.addIp("Darkweb Server", darkweb.ip);

  p.getHomeComputer().serversOnNetwork.push(darkweb.ip);
  darkweb.serversOnNetwork.push(p.getHomeComputer().ip);
  dialogBoxCreate(
    "You have purchased a TOR router!<br>" +
      "You now have access to the dark web from your home computer.<br>" +
      "Use the scan/scan-analyze commands to search for the dark web connection.",
  );
}
