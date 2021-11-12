/**
 * Server and HacknetServer-related methods for the Player class (PlayerObject)
 */
import { IPlayer } from "../IPlayer";

import { CONSTANTS } from "../../Constants";

import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Server } from "../../Server/Server";
import { BaseServer } from "../../Server/BaseServer";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { GetServer, AddToAllServers, createUniqueRandomIp } from "../../Server/AllServers";
import { SpecialServers } from "../../Server/data/SpecialServers";

export function hasTorRouter(this: IPlayer): boolean {
  return !!GetServer(SpecialServers.DarkWeb);
}

export function getCurrentServer(this: IPlayer): BaseServer {
  const server = GetServer(this.currentServer);
  if (server === null) throw new Error(`somehow connected to a server that does not exist. ${this.currentServer}`);
  return server;
}

export function getHomeComputer(this: IPlayer): Server {
  const home = GetServer("home");
  if (home instanceof Server) return home;
  throw new Error("home computer was not a normal server");
}

export function getUpgradeHomeRamCost(this: IPlayer): number {
  //Calculate how many times ram has been upgraded (doubled)
  const currentRam = this.getHomeComputer().maxRam;
  const numUpgrades = Math.log2(currentRam);

  //Calculate cost
  //Have cost increase by some percentage each time RAM has been upgraded
  const mult = Math.pow(1.58, numUpgrades);
  const cost = currentRam * CONSTANTS.BaseCostFor1GBOfRamHome * mult * BitNodeMultipliers.HomeComputerRamCost;
  return cost;
}

export function getUpgradeHomeCoresCost(this: IPlayer): number {
  return 1e9 * Math.pow(7.5, this.getHomeComputer().cpuCores);
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
  this.hacknetNodes.push(server.hostname);

  // Configure the HacknetServer to actually act as a Server
  AddToAllServers(server);
  const homeComputer = this.getHomeComputer();
  homeComputer.serversOnNetwork.push(server.hostname);
  server.serversOnNetwork.push(SpecialServers.Home);

  return server;
}
