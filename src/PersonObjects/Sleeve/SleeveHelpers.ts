import { Sleeve } from "./Sleeve";

import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { Factions } from "../../Faction/Factions";

export function findSleevePurchasableAugs(
  sleeve: Sleeve,
  p: IPlayer,
): Augmentation[] {
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

    return true;
  }

  // If player is in a gang, then we return all augs that the player
  // has enough reputation for (since that gang offers all augs)
  if (p.inGang()) {
    const fac = p.getGangFaction();

    for (const augName in Augmentations) {
      const aug = Augmentations[augName];
      if (!isAvailableForSleeve(aug)) {
        continue;
      }

      if (fac.playerReputation > aug.baseRepRequirement) {
        availableAugs.push(aug);
      }
    }

    return availableAugs;
  }

  for (const facName of p.factions) {
    if (facName === "Bladeburners") {
      continue;
    }
    if (facName === "Netburners") {
      continue;
    }
    const fac: Faction | null = Factions[facName];
    if (fac == null) {
      continue;
    }

    for (const augName of fac.augmentations) {
      const aug: Augmentation = Augmentations[augName];
      if (!isAvailableForSleeve(aug)) {
        continue;
      }

      if (fac.playerReputation > aug.baseRepRequirement) {
        availableAugs.push(aug);
      }
    }
  }

  return availableAugs;
}
