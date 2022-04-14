import { FactionNames } from "../../Faction/data/FactionNames";
import { Sleeve } from "./Sleeve";

import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";
import { StaticAugmentations } from "../../Augmentation/StaticAugmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";

export function findSleevePurchasableAugs(sleeve: Sleeve, p: IPlayer): Augmentation[] {
  // You can only purchase Augmentations that are actually available from
  // your factions. I.e. you must be in a faction that has the Augmentation
  // and you must also have enough rep in that faction in order to purchase it.

  const ownedAugNames: string[] = sleeve.augmentations.map((e) => {
    return e.name;
  });
  const availableAugs: Augmentation[] = [];

  // Helper function that helps filter out augs that are already owned
  // and augs that aren't allowed for sleeves
  function isAvailableForSleeve(aug: Augmentation): boolean {
    if (aug.name === AugmentationNames.NeuroFluxGovernor) {
      return false;
    }
    if (ownedAugNames.includes(aug.name)) {
      return false;
    }
    if (availableAugs.includes(aug)) {
      return false;
    }
    if (aug.isSpecial) {
      return false;
    }

    const validMults = [
      "hacking_mult",
      "strength_mult",
      "defense_mult",
      "dexterity_mult",
      "agility_mult",
      "charisma_mult",
      "hacking_exp_mult",
      "strength_exp_mult",
      "defense_exp_mult",
      "dexterity_exp_mult",
      "agility_exp_mult",
      "charisma_exp_mult",
      "company_rep_mult",
      "faction_rep_mult",
      "crime_money_mult",
      "crime_success_mult",
      "work_money_mult",
    ];
    for (const mult of Object.keys(aug.mults)) {
      if (validMults.includes(mult)) {
        return true;
      }
    }

    return false;
  }

  // If player is in a gang, then we return all augs that the player
  // has enough reputation for (since that gang offers all augs)
  if (p.inGang()) {
    const fac = p.getGangFaction();

    for (const augName of Object.keys(StaticAugmentations)) {
      const aug = StaticAugmentations[augName];
      if (!isAvailableForSleeve(aug)) {
        continue;
      }

      if (fac.playerReputation > aug.getCost(p).repCost) {
        availableAugs.push(aug);
      }
    }
  }

  for (const facName of p.factions) {
    if (facName === FactionNames.Bladeburners) {
      continue;
    }
    if (facName === FactionNames.Netburners) {
      continue;
    }
    const fac: Faction | null = Factions[facName];
    if (fac == null) {
      continue;
    }

    for (const augName of fac.augmentations) {
      const aug: Augmentation = StaticAugmentations[augName];
      if (!isAvailableForSleeve(aug)) {
        continue;
      }

      if (fac.playerReputation > aug.getCost(p).repCost) {
        availableAugs.push(aug);
      }
    }
  }

  return availableAugs;
}
