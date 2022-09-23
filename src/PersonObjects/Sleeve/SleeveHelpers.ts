import { FactionNames } from "../../Faction/data/FactionNames";
import { Sleeve } from "./Sleeve";

import { IPlayer } from "../IPlayer";
import { Player } from "../../Player";

import { Augmentation } from "../../Augmentation/Augmentation";
import { StaticAugmentations } from "../../Augmentation/StaticAugmentations";
import { Factions } from "../../Faction/Factions";
import { Multipliers } from "../Multipliers";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { getFactionAugmentationsFiltered } from "../../Faction/FactionHelpers";

export function findSleevePurchasableAugs(sleeve: Sleeve, p: IPlayer): Augmentation[] {
  // You can only purchase Augmentations that are actually available from
  // your factions. I.e. you must be in a faction that has the Augmentation
  // and you must also have enough rep in that faction in order to purchase it.

  const ownedAugNames = sleeve.augmentations.map((e) => e.name);
  const availableAugs: Augmentation[] = [];

  // Helper function that helps filter out augs that are already owned
  // and augs that aren't allowed for sleeves
  function isAvailableForSleeve(aug: Augmentation): boolean {
    if (ownedAugNames.includes(aug.name)) return false;
    if (availableAugs.includes(aug)) return false;
    if (aug.isSpecial) return false;

    type MultKey = keyof Multipliers;
    const validMults: MultKey[] = [
      "hacking",
      "strength",
      "defense",
      "dexterity",
      "agility",
      "charisma",
      "hacking_exp",
      "strength_exp",
      "defense_exp",
      "dexterity_exp",
      "agility_exp",
      "charisma_exp",
      "company_rep",
      "faction_rep",
      "crime_money",
      "crime_success",
      "work_money",
    ];
    for (const mult of validMults) {
      if (aug.mults[mult] !== 1) return true;
    }

    return false;
  }

  // If player is in a gang, then we return all augs that the player
  // has enough reputation for (since that gang offers all augs)
  if (p.inGang()) {
    const fac = p.getGangFaction();
    const gangAugs = getFactionAugmentationsFiltered(Player, fac);

    for (const augName of gangAugs) {
      const aug = StaticAugmentations[augName];
      if (!isAvailableForSleeve(aug)) continue;

      if (fac.playerReputation > aug.getCost(p).repCost) {
        availableAugs.push(aug);
      }
    }
  }

  for (const facName of p.factions) {
    if (facName === FactionNames.Bladeburners) continue;
    if (facName === FactionNames.Netburners) continue;
    const fac = Factions[facName];
    if (!fac) continue;

    for (const augName of fac.augmentations) {
      const aug = StaticAugmentations[augName];
      if (!isAvailableForSleeve(aug)) continue;

      if (fac.playerReputation > aug.getCost(p).repCost) {
        availableAugs.push(aug);
      }
    }
  }

  // Add the stanek sleeve aug
  if (
    !ownedAugNames.includes(AugmentationNames.UnnamedAug1) &&
    p.factions.includes(FactionNames.ChurchOfTheMachineGod)
  ) {
    const aug = StaticAugmentations[AugmentationNames.UnnamedAug1];
    availableAugs.push(aug);
  }

  return availableAugs;
}
