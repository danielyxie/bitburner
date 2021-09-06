import { Server } from "./Server";
import { SpecialServerIps } from "./SpecialServerIps";
import { serverMetadata } from "./data/servers";

import { HacknetServer } from "../Hacknet/HacknetServer";

import { IMap } from "../types";
import { createRandomIp } from "../../utils/IPAddress";
import { getRandomInt } from "../../utils/helpers/getRandomInt";
import { Reviver } from "../../utils/JSONReviver";

/**
 * Map of all Servers that exist in the game
 *  Key (string) = IP
 *  Value = Server object
 */
export let AllServers: IMap<Server | HacknetServer> = {};

export function ipExists(ip: string): boolean {
  return AllServers[ip] != null;
}

export function createUniqueRandomIp(): string {
  const ip = createRandomIp();

  // If the Ip already exists, recurse to create a new one
  if (ipExists(ip)) {
    return createRandomIp();
  }

  return ip;
}

// Saftely add a Server to the AllServers map
export function AddToAllServers(server: Server | HacknetServer): void {
  const serverIp = server.ip;
  if (ipExists(serverIp)) {
    console.warn(`IP of server that's being added: ${serverIp}`);
    console.warn(
      `Hostname of the server thats being added: ${server.hostname}`,
    );
    console.warn(
      `The server that already has this IP is: ${AllServers[serverIp].hostname}`,
    );
    throw new Error("Error: Trying to add a server with an existing IP");
  }

  AllServers[serverIp] = server;
}

interface IServerParams {
  hackDifficulty?: number;
  hostname: string;
  ip: string;
  maxRam?: number;
  moneyAvailable?: number;
  numOpenPortsRequired: number;
  organizationName: string;
  requiredHackingSkill?: number;
  serverGrowth?: number;

  [key: string]: any;
}

export function initForeignServers(homeComputer: Server): void {
  /* Create a randomized network for all the foreign servers */
  //Groupings for creating a randomized network
  const networkLayers: Server[][] = [];
  for (let i = 0; i < 15; i++) {
    networkLayers.push([]);
  }

  // Essentially any property that is of type 'number | IMinMaxRange'
  const propertiesToPatternMatch: string[] = [
    "hackDifficulty",
    "moneyAvailable",
    "requiredHackingSkill",
    "serverGrowth",
  ];

  const toNumber = (value: any): any => {
    switch (typeof value) {
      case "number":
        return value;
      case "object":
        return getRandomInt(value.min, value.max);
      default:
        throw Error(
          `Do not know how to convert the type '${typeof value}' to a number`,
        );
    }
  };

  for (const metadata of serverMetadata) {
    const serverParams: IServerParams = {
      hostname: metadata.hostname,
      ip: createUniqueRandomIp(),
      numOpenPortsRequired: metadata.numOpenPortsRequired,
      organizationName: metadata.organizationName,
    };

    if (metadata.maxRamExponent !== undefined) {
      serverParams.maxRam = Math.pow(2, toNumber(metadata.maxRamExponent));
    }

    for (const prop of propertiesToPatternMatch) {
      if (metadata[prop] !== undefined) {
        serverParams[prop] = toNumber(metadata[prop]);
      }
    }

    const server = new Server(serverParams);
    for (const filename of metadata.literature || []) {
      server.messages.push(filename);
    }

    if (metadata.specialName !== undefined) {
      SpecialServerIps.addIp(metadata.specialName, server.ip);
    }

    AddToAllServers(server);
    if (metadata.networkLayer !== undefined) {
      networkLayers[toNumber(metadata.networkLayer) - 1].push(server);
    }
  }

  /* Create a randomized network for all the foreign servers */
  const linkComputers = (server1: Server, server2: Server): void => {
    server1.serversOnNetwork.push(server2.ip);
    server2.serversOnNetwork.push(server1.ip);
  };

  const getRandomArrayItem = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];

  const linkNetworkLayers = (
    network1: Server[],
    selectServer: () => Server,
  ): void => {
    for (const server of network1) {
      linkComputers(server, selectServer());
    }
  };

  // Connect the first tier of servers to the player's home computer
  linkNetworkLayers(networkLayers[0], () => homeComputer);
  for (let i = 1; i < networkLayers.length; i++) {
    linkNetworkLayers(networkLayers[i], () => getRandomArrayItem(networkLayers[i - 1]),
    );
  }
}

export function prestigeAllServers(): void {
  for (const member in AllServers) {
    delete AllServers[member];
  }
  AllServers = {};
}

export function loadAllServers(saveString: string): void {
  AllServers = JSON.parse(saveString, Reviver);
}
