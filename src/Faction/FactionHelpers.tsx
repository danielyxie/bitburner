import { Augmentations } from "../Augmentation/Augmentations";
import { Augmentation } from "../Augmentation/Augmentation";
import { PlayerOwnedAugmentation } from "../Augmentation/PlayerOwnedAugmentation";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../Constants";

import { Faction } from "./Faction";
import { Factions } from "./Factions";
import { Player } from "../Player";
import { Settings } from "../Settings/Settings";
import {
  getHackingWorkRepGain,
  getFactionSecurityWorkRepGain,
  getFactionFieldWorkRepGain,
} from "../PersonObjects/formulas/reputation";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { InvitationEvent } from "./ui/InvitationModal";
import { FactionNames } from "./data/FactionNames";

export function inviteToFaction(faction: Faction): void {
  Player.receiveInvite(faction.name);
  faction.alreadyInvited = true;
  if (!Settings.SuppressFactionInvites) {
    InvitationEvent.emit(faction);
  }
}

export function joinFaction(faction: Faction): void {
  if (faction.isMember) return;
  faction.isMember = true;
  Player.factions.push(faction.name);
  const allFactions = Object.values(FactionNames).map((faction) => faction as string);
  Player.factions.sort((a, b) => allFactions.indexOf(a) - allFactions.indexOf(b));
  const factionInfo = faction.getInfo();

  //Determine what factions you are banned from now that you have joined this faction
  for (const enemy of factionInfo.enemies) {
    if (Factions[enemy] instanceof Faction) {
      Factions[enemy].isBanned = true;
    }
  }
  for (let i = 0; i < Player.factionInvitations.length; ++i) {
    if (Player.factionInvitations[i] == faction.name || Factions[Player.factionInvitations[i]].isBanned) {
      Player.factionInvitations.splice(i, 1);
      i--;
    }
  }
}

//Returns a boolean indicating whether the player has the prerequisites for the
//specified Augmentation
export function hasAugmentationPrereqs(aug: Augmentation): boolean {
  let hasPrereqs = true;
  if (aug.prereqs && aug.prereqs.length > 0) {
    for (let i = 0; i < aug.prereqs.length; ++i) {
      const prereqAug = Augmentations[aug.prereqs[i]];
      if (prereqAug == null) {
        console.error(`Invalid prereq Augmentation ${aug.prereqs[i]}`);
        continue;
      }
      if (prereqAug.owned === false) {
        hasPrereqs = false;

        // Check if the aug is purchased
        for (let j = 0; j < Player.queuedAugmentations.length; ++j) {
          if (Player.queuedAugmentations[j].name === prereqAug.name) {
            hasPrereqs = true;
            break;
          }
        }
      }
    }
  }

  return hasPrereqs;
}

export function purchaseAugmentation(aug: Augmentation, fac: Faction, sing = false): string {
  const factionInfo = fac.getInfo();
  const hasPrereqs = hasAugmentationPrereqs(aug);
  if (!hasPrereqs) {
    const txt = `You must first purchase or install ${aug.prereqs.join(",")} before you can purchase this one.`;
    if (sing) {
      return txt;
    } else {
      dialogBoxCreate(txt);
    }
  } else if (aug.baseCost !== 0 && Player.money < aug.baseCost * factionInfo.augmentationPriceMult) {
    const txt = "You don't have enough money to purchase " + aug.name;
    if (sing) {
      return txt;
    }
    dialogBoxCreate(txt);
  } else if (fac.playerReputation < aug.baseRepRequirement) {
    const txt = "You don't have enough faction reputation to purchase " + aug.name;
    if (sing) {
      return txt;
    }
    dialogBoxCreate(txt);
  } else if (aug.baseCost === 0 || Player.money >= aug.baseCost * factionInfo.augmentationPriceMult) {
    const queuedAugmentation = new PlayerOwnedAugmentation(aug.name);
    if (aug.name == AugmentationNames.NeuroFluxGovernor) {
      queuedAugmentation.level = getNextNeurofluxLevel();
    }
    Player.queuedAugmentations.push(queuedAugmentation);

    Player.loseMoney(aug.baseCost * factionInfo.augmentationPriceMult, "augmentations");

    // If you just purchased Neuroflux Governor, recalculate the cost
    if (aug.name == AugmentationNames.NeuroFluxGovernor) {
      let nextLevel = getNextNeurofluxLevel();
      --nextLevel;
      const mult = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
      aug.baseRepRequirement = 500 * mult * BitNodeMultipliers.AugmentationRepCost;
      aug.baseCost = 750e3 * mult * BitNodeMultipliers.AugmentationMoneyCost;

      for (let i = 0; i < Player.queuedAugmentations.length - 1; ++i) {
        aug.baseCost *= CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][SourceFileFlags[11]];
      }
    }

    for (const name of Object.keys(Augmentations)) {
      if (Augmentations.hasOwnProperty(name)) {
        Augmentations[name].baseCost *= CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][SourceFileFlags[11]];
      }
    }

    if (sing) {
      return "You purchased " + aug.name;
    } else if (!Settings.SuppressBuyAugmentationConfirmation) {
      dialogBoxCreate(
        "You purchased " +
          aug.name +
          ". Its enhancements will not take " +
          "effect until they are installed. To install your augmentations, go to the " +
          "'Augmentations' tab on the left-hand navigation menu. Purchasing additional " +
          "augmentations will now be more expensive.",
      );
    }
  } else {
    dialogBoxCreate(
      "Hmm, something went wrong when trying to purchase an Augmentation. " +
        "Please report this to the game developer with an explanation of how to " +
        "reproduce this.",
    );
  }
  return "";
}

export function getNextNeurofluxLevel(): number {
  // Get current Neuroflux level based on Player's augmentations
  let currLevel = 0;
  for (let i = 0; i < Player.augmentations.length; ++i) {
    if (Player.augmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
      currLevel = Player.augmentations[i].level;
    }
  }

  // Account for purchased but uninstalled Augmentations
  for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
    if (Player.queuedAugmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
      ++currLevel;
    }
  }
  return currLevel + 1;
}

export function processPassiveFactionRepGain(numCycles: number): void {
  for (const name of Object.keys(Factions)) {
    if (name === Player.currentWorkFactionName) continue;
    if (!Factions.hasOwnProperty(name)) continue;
    const faction = Factions[name];
    if (!faction.isMember) continue;
    // No passive rep for special factions
    const info = faction.getInfo();
    if (!info.offersWork()) continue;
    // No passive rep for gangs.
    if (Player.getGangName() === name) continue;
    // 0 favor = 1%/s
    // 50 favor = 6%/s
    // 100 favor = 11%/s
    const favorMult = Math.min(0.1, faction.favor / 1000 + 0.01);
    // Find the best of all possible favor gain, minimum 1 rep / 2 minute.
    const hRep = getHackingWorkRepGain(Player, faction);
    const sRep = getFactionSecurityWorkRepGain(Player, faction);
    const fRep = getFactionFieldWorkRepGain(Player, faction);
    const rate = Math.max(hRep * favorMult, sRep * favorMult, fRep * favorMult, 1 / 120);

    faction.playerReputation += rate * numCycles * Player.faction_rep_mult * BitNodeMultipliers.FactionPassiveRepGain;
  }
}
