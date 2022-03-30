import { Server } from "./Server";
import { BaseServer } from "./BaseServer";
import { serverMetadata } from "./data/servers";

import { HacknetServer } from "../Hacknet/HacknetServer";

import { IMap } from "../types";
import { createRandomIp } from "../utils/IPAddress";
import { getRandomInt } from "../utils/helpers/getRandomInt";
import { Reviver } from "../utils/JSONReviver";
import { isValidIPAddress } from "../utils/helpers/isValidIPAddress";
import { SpecialServers } from "./data/SpecialServers";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";

/**
 * Map of all Servers that exist in the game
 *  Key (string) = IP
 *  Value = Server object
 */
let AllServers: IMap<Server | HacknetServer> = {};

function GetServerByIP(ip: string): BaseServer | undefined {
  for (const key of Object.keys(AllServers)) {
    const server = AllServers[key];
    if (server.ip !== ip) continue;
    return server;
  }
}

//Returns server object with corresponding hostname
//    Relatively slow, would rather not use this a lot
function GetServerByHostname(hostname: string): BaseServer | null {
  for (const key of Object.keys(AllServers)) {
    const server = AllServers[key];
    if (server.hostname == hostname) {
      return server;
    }
  }

  return null;
}

//Get server by IP or hostname. Returns null if invalid
export function GetServer(s: string): BaseServer | null {
  if (AllServers.hasOwnProperty(s)) {
    const server = AllServers[s];
    if (server) return server;
  }

  if (!isValidIPAddress(s)) {
    return GetServerByHostname(s);
  }

  const ipserver = GetServerByIP(s);
  if (ipserver !== undefined) {
    return ipserver;
  }

  return null;
}

export function GetAllServers(): BaseServer[] {
  const servers: BaseServer[] = [];
  for (const key of Object.keys(AllServers)) {
    servers.push(AllServers[key]);
  }
  return servers;
}

export function DeleteServer(serverkey: string): void {
  for (const key of Object.keys(AllServers)) {
    const server = AllServers[key];
    if (server.ip !== serverkey && server.hostname !== serverkey) continue;
    delete AllServers[key];
    break;
  }
}

export function ipExists(ip: string): boolean {
  return AllServers[ip] != null;
}

export function createUniqueRandomIp(): string {
  let ip: string;
  // Repeat generating ip, until unique one is found
  do {
    ip = createRandomIp();
  } while (ipExists(ip));

  return ip;
}

// Saftely add a Server to the AllServers map
export function AddToAllServers(server: Server | HacknetServer): void {
  if (GetServer(server.hostname)) {
    console.warn(`Hostname of the server thats being added: ${server.hostname}`);
    console.warn(`The server that already has this IP is: ${AllServers[server.hostname].hostname}`);
    throw new Error("Error: Trying to add a server with an existing IP");
  }

  AllServers[server.hostname] = server;
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
        throw Error(`Do not know how to convert the type '${typeof value}' to a number`);
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

    if (server.hostname === SpecialServers.WorldDaemon) {
      server.requiredHackingSkill *= BitNodeMultipliers.WorldDaemonDifficulty;
    }
    AddToAllServers(server);
    if (metadata.networkLayer !== undefined) {
      networkLayers[toNumber(metadata.networkLayer) - 1].push(server);
    }
  }

  /* Create a randomized network for all the foreign servers */
  const linkComputers = (server1: Server, server2: Server): void => {
    server1.serversOnNetwork.push(server2.hostname);
    server2.serversOnNetwork.push(server1.hostname);
  };

  const getRandomArrayItem = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)];

  const linkNetworkLayers = (network1: Server[], selectServer: () => Server): void => {
    for (const server of network1) {
      linkComputers(server, selectServer());
    }
  };

  // Connect the first tier of servers to the player's home computer
  linkNetworkLayers(networkLayers[0], () => homeComputer);
  for (let i = 1; i < networkLayers.length; i++) {
    linkNetworkLayers(networkLayers[i], () => getRandomArrayItem(networkLayers[i - 1]));
  }
}

export function prestigeAllServers(): void {
  for (const member of Object.keys(AllServers)) {
    delete AllServers[member];
  }
  AllServers = {};
}

export function loadAllServers(saveString: string): void {
  AllServers = JSON.parse(saveString, Reviver);
}

export function saveAllServers(excludeRunningScripts = false): string {
  const TempAllServers = JSON.parse(JSON.stringify(AllServers), Reviver);
  for (const key of Object.keys(TempAllServers)) {
    const server = TempAllServers[key];
    if (excludeRunningScripts) {
      server.runningScripts = [];
      continue;
    }
    for (let i = 0; i < server.runningScripts.length; ++i) {
      const runningScriptObj = server.runningScripts[i];
      runningScriptObj.logs.length = 0;
      runningScriptObj.logs = [];
    }
  }

  return JSON.stringify(TempAllServers);
}
