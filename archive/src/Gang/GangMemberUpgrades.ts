import { gangMemberUpgradesMetadata } from "./data/upgrades";
import { GangMemberUpgrade } from "./GangMemberUpgrade";

export const GangMemberUpgrades: {
  [key: string]: GangMemberUpgrade;
} = {};

(function () {
  gangMemberUpgradesMetadata.forEach((e) => {
    GangMemberUpgrades[e.name] = new GangMemberUpgrade(e.name, e.cost, e.upgType, e.mults);
  });
})();
