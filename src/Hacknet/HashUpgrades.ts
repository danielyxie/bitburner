/**
 * Map of all Hash Upgrades
 * Key = Hash name, Value = HashUpgrade object
 */
import type { IMap } from "../types";

import { HashUpgradesMetadata } from "./data/HashUpgradesMetadata";
import { HashUpgrade } from "./HashUpgrade";
import type { IConstructorParams } from "./HashUpgrade";

export const HashUpgrades: IMap<HashUpgrade> = {};

function createHashUpgrade(p: IConstructorParams): void {
  HashUpgrades[p.name] = new HashUpgrade(p);
}

for (const metadata of HashUpgradesMetadata) {
  createHashUpgrade(metadata);
}
