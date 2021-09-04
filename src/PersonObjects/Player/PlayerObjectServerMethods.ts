/**
 * Server and HacknetServer-related methods for the Player class (PlayerObject)
 */
import { IPlayer } from "../IPlayer";

import { CONSTANTS } from "../../Constants";

import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Server } from "../../Server/Server";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import {
  AddToAllServers,
  AllServers,
  createUniqueRandomIp,
} from "../../Server/AllServers";
import { SpecialServerIps } from "../../Server/SpecialServerIps";

export function hasTorRouter(this: IPlayer): boolean {
  return SpecialServerIps.hasOwnProperty("Darkweb Server");
}

export function getCurrentServer(this: IPlayer): Server | HacknetServer | null {
  return AllServers[this.currentServer];
}

export function getHomeComputer(this: IPlayer): Server | HacknetServer | null {
  return AllServers[this.homeComputer];
}

export function getUpgradeHomeRamCost(this: IPlayer): number {
  //Calculate how many times ram has been upgraded (doubled)
  const currentRam = this.getHomeComputer().maxRam;
  const numUpgrades = Math.log2(currentRam);

  //Calculate cost
  //Have cost increase by some percentage each time RAM has been upgraded
  const mult = Math.pow(1.58, numUpgrades);
  const cost =
    currentRam *
    CONSTANTS.BaseCostFor1GBOfRamHome *
    mult *
    BitNodeMultipliers.HomeComputerRamCost;
  return cost;
}

export function createHacknetServer(this: IPlayer): HacknetServer {
  const numOwned = this.hacknetNodes.length;
  const name = `hacknet-node-${numOwned}`;
  const server = new HacknetServer({
    adminRights: true,
    hostname: name,
    ip: createUniqueRandomIp(),
    // player: this,
  });
  this.hacknetNodes.push(server.ip);

  // Configure the HacknetServer to actually act as a Server
  AddToAllServers(server);
  const homeComputer = this.getHomeComputer();
  homeComputer.serversOnNetwork.push(server.ip);
  server.serversOnNetwork.push(homeComputer.ip);

  return server;
}
