import { GetServer, AddToAllServers } from "./AllServers";
import { IPlayer } from "../PersonObjects/IPlayer";
import { cyrb53 } from "../utils/StringHelperFunctions";
import { hash } from "../hash/hash";
import { safetlyCreateUniqueServer } from "./ServerHelpers";
import { SpecialServers } from "./data/SpecialServers";

/**
 * Mapping for hexadecimal character to military names
 */
const hexaToMilitary = {
  a: "alpha",
  b: "beta",
  c: "charlie",
  d: "delta",
  e: "echo",
  f: "foxtrot",
  "0": "zero",
  "1": "one",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  "10": "ten",
};

/**
 * Attempts to create the exploit server and attaches it the the dark army network
 * @returns Will return true if the server was created at this time.
 */
function createExploitServer(): boolean {
  const s = GetServer(SpecialServers.ExploitServer);
  if (s !== null) return false; // already created, let's get out of here.

  const server = safetlyCreateUniqueServer({
    hostname: SpecialServers.ExploitServer,
    organizationName: "fsociety",
    maxRam: 8,
    numOpenPortsRequired: 5,
    requiredHackingSkill: 9001,
    hidden: true,
  });
  AddToAllServers(server);

  const darkArmyServer = GetServer(SpecialServers.TheDarkArmyServer);
  if (!darkArmyServer) throw new Error("Dark Army Server does not exist"); // this should not happen.
  darkArmyServer.serversOnNetwork.push(server.hostname);
  server.serversOnNetwork.push(darkArmyServer.hostname);

  return true;
}

/**
 * Gets the current passphrase required to unlock the exploit server
 * It will change every reset since it's seeded from data in the player's save
 * @param player Player data is required to get the seed
 * @returns The passphrase that will unlock the server
 */
export function getExploitServerPassphrase(player: IPlayer): string {
  // Fixed seed per augmentation/soft-reset
  const timestamp = player.playtimeSinceLastBitnode - player.playtimeSinceLastAug;
  const seed = timestamp + ((0xdeadbeef * 69) % 420); // nice.

  // Salted with the current commit hash so it'll change every game version
  const hashedHost = cyrb53(`${SpecialServers.ExploitServer}_${hash()}`, seed);

  // Our hashed passphrase is an hexadecimal string, so we can map it to the dictionary above
  const passphrase = [...hashedHost]
    .map((character) => hexaToMilitary[character as keyof typeof hexaToMilitary])
    .join("-");

  return passphrase;
}

/**
 * Compares the attempted passphrase with the current exploit server passphrase.
 * If they match, it'll create the server on the network.
 * @param player Player data is required to get the seed
 * @param attemptPassphrase The unlock attempt
 * @returns Will return true if the passphrase matches
 */
export function attemptToUnlockExploitServer(player: IPlayer, attemptPassphrase: string): boolean {
  const secretPassphrase = getExploitServerPassphrase(player);
  const success = attemptPassphrase === secretPassphrase;

  if (success) {
    createExploitServer();
  }

  return success;
}
