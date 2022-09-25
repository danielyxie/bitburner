/**
 * Implements functions for purchasing servers or purchasing more RAM for
 * the home computer
 */
import { AddToAllServers, createUniqueRandomIp } from "./AllServers";
import { safelyCreateUniqueServer } from "./ServerHelpers";

import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";
import { Player } from "../Player";

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
  if (isNaN(sanitizedRam) || !isPowerOfTwo(sanitizedRam) || !(Math.sign(sanitizedRam) === 1)) {
    return Infinity;
  }

  if (sanitizedRam > getPurchaseServerMaxRam()) {
    return Infinity;
  }

  const upg = Math.max(0, Math.log(sanitizedRam) / Math.log(2) - 6);

  return (
    sanitizedRam *
    CONSTANTS.BaseCostFor1GBOfRamServer *
    BitNodeMultipliers.PurchasedServerCost *
    Math.pow(BitNodeMultipliers.PurchasedServerSoftcap, upg)
  );
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
export function purchaseServer(hostname: string, ram: number, cost: number): void {
  //Check if player has enough money
  if (!Player.canAfford(cost)) {
    dialogBoxCreate("You don't have enough money to purchase this server!");
    return;
  }

  //Maximum server limit
  if (Player.purchasedServers.length >= getPurchaseServerLimit()) {
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
  const newServ = safelyCreateUniqueServer({
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
  Player.purchasedServers.push(newServ.hostname);

  // Connect new server to home computer
  const homeComputer = Player.getHomeComputer();
  homeComputer.serversOnNetwork.push(newServ.hostname);
  newServ.serversOnNetwork.push(homeComputer.hostname);

  Player.loseMoney(cost, "servers");

  dialogBoxCreate("Server successfully purchased with hostname " + newServ.hostname);
}

// Manually upgrade RAM on home computer (NOT through Netscript)
export function purchaseRamForHomeComputer(): void {
  const cost = Player.getUpgradeHomeRamCost();
  if (!Player.canAfford(cost)) {
    dialogBoxCreate("You do not have enough money to purchase additional RAM for your home computer");
    return;
  }

  const homeComputer = Player.getHomeComputer();
  if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
    dialogBoxCreate(`You cannot upgrade your home computer RAM because it is at its maximum possible value`);
    return;
  }

  homeComputer.maxRam *= 2;
  Player.loseMoney(cost, "servers");
}
