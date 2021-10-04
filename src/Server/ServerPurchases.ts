/**
 * Implements functions for purchasing servers or purchasing more RAM for
 * the home computer
 */
import { AddToAllServers, createUniqueRandomIp } from "./AllServers";
import { safetlyCreateUniqueServer } from "./ServerHelpers";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { isPowerOfTwo } from "../utils/helpers/isPowerOfTwo";

// Returns the cost of purchasing a server with the given RAM
// Returns Infinity for invalid 'ram' arguments
/**
 * @param ram Amount of RAM on purchased server (GB)
 * @returns Cost of purchasing the given server. Returns infinity for invalid arguments
 */
export function getPurchaseServerCost(ram: number): number {
  const sanitizedRam = Math.round(ram);
  if (isNaN(sanitizedRam) || !isPowerOfTwo(sanitizedRam)) {
    return Infinity;
  }

  if (sanitizedRam > getPurchaseServerMaxRam()) {
    return Infinity;
  }

  return sanitizedRam * CONSTANTS.BaseCostFor1GBOfRamServer * BitNodeMultipliers.PurchasedServerCost;
}

export function getPurchaseServerLimit(): number {
  return Math.round(CONSTANTS.PurchasedServerLimit * BitNodeMultipliers.PurchasedServerLimit);
}

export function getPurchaseServerMaxRam(): number {
  const ram = Math.round(CONSTANTS.PurchasedServerMaxRam * BitNodeMultipliers.PurchasedServerMaxRam);

  // Round this to the nearest power of 2
  return 1 << (31 - Math.clz32(ram));
}

// Manually purchase a server (NOT through Netscript)
export function purchaseServer(hostname: string, ram: number, cost: number, p: IPlayer): void {
  //Check if player has enough money
  if (!p.canAfford(cost)) {
    dialogBoxCreate("You don't have enough money to purchase this server!");
    return;
  }

  //Maximum server limit
  if (p.purchasedServers.length >= getPurchaseServerLimit()) {
    dialogBoxCreate(
      "You have reached the maximum limit of " +
        getPurchaseServerLimit() +
        " servers. " +
        "You cannot purchase any more. You can " +
        "delete some of your purchased servers using the deleteServer() Netscript function in a script",
    );
    return;
  }

  if (hostname == "") {
    dialogBoxCreate("You must enter a hostname for your new server!");
    return;
  }

  // Create server
  const newServ = safetlyCreateUniqueServer({
    adminRights: true,
    hostname: hostname,
    ip: createUniqueRandomIp(),
    isConnectedTo: false,
    maxRam: ram,
    organizationName: "",
    purchasedByPlayer: true,
  });
  AddToAllServers(newServ);

  // Add to Player's purchasedServers array
  p.purchasedServers.push(newServ.ip);

  // Connect new server to home computer
  const homeComputer = p.getHomeComputer();
  homeComputer.serversOnNetwork.push(newServ.ip);
  newServ.serversOnNetwork.push(homeComputer.ip);

  p.loseMoney(cost);

  dialogBoxCreate("Server successfully purchased with hostname " + hostname);
}

// Manually upgrade RAM on home computer (NOT through Netscript)
export function purchaseRamForHomeComputer(p: IPlayer): void {
  const cost = p.getUpgradeHomeRamCost();
  if (!p.canAfford(cost)) {
    dialogBoxCreate("You do not have enough money to purchase additional RAM for your home computer");
    return;
  }

  const homeComputer = p.getHomeComputer();
  if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
    dialogBoxCreate(`You cannot upgrade your home computer RAM because it is at its maximum possible value`);
    return;
  }

  homeComputer.maxRam *= 2;
  p.loseMoney(cost);
}
