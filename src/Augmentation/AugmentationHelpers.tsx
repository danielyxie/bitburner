import { Augmentation } from "./Augmentation";
import { Augmentations } from "./Augmentations";
import { PlayerOwnedAugmentation, IPlayerOwnedAugmentation } from "./PlayerOwnedAugmentation";
import { AugmentationNames } from "./data/AugmentationNames";

import { CONSTANTS } from "../Constants";
import { Factions, factionExists } from "../Faction/Factions";
import { Player } from "../Player";
import { prestigeAugmentation } from "../Prestige";
import { SourceFileFlags } from "../SourceFile/SourceFileFlags";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { clearObject } from "../utils/helpers/clearObject";

import { FactionNames } from "../Faction/data/FactionNames";
import {
  bladeburnerAugmentations,
  churchOfTheMachineGodAugmentations,
  generalAugmentations,
  infiltratorsAugmentations,
  initNeuroFluxGovernor,
  initUnstableCircadianModulator,
} from "./AugmentationCreator";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";

export function AddToAugmentations(aug: Augmentation): void {
  const name = aug.name;
  Augmentations[name] = aug;
}

export function getNextNeuroFluxLevel(): number {
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

function createAugmentations(): void {
  [
    initNeuroFluxGovernor(),
    initUnstableCircadianModulator(),
    ...generalAugmentations,
    ...infiltratorsAugmentations,
    ...(factionExists(FactionNames.Bladeburners) ? bladeburnerAugmentations : []),
    ...(factionExists(FactionNames.ChurchOfTheMachineGod) ? churchOfTheMachineGodAugmentations : []),
  ].map(resetAugmentation);
}

function resetFactionAugmentations(): void {
  for (const name of Object.keys(Factions)) {
    if (Factions.hasOwnProperty(name)) {
      Factions[name].augmentations = [];
    }
  }
}

function initAugmentations(): void {
  resetFactionAugmentations();
  clearObject(Augmentations);
  createAugmentations();
  updateAugmentationCosts();
  Player.reapplyAllAugmentations();
}

function getBaseAugmentationPriceMultiplier(): number {
  return CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][SourceFileFlags[11]];
}
export function getGenericAugmentationPriceMultiplier(): number {
  return Math.pow(getBaseAugmentationPriceMultiplier(), Player.queuedAugmentations.length);
}

function updateNeuroFluxGovernorCosts(neuroFluxGovernorAugmentation: Augmentation): void {
  let nextLevel = getNextNeuroFluxLevel();
  --nextLevel;
  const multiplier = Math.pow(CONSTANTS.NeuroFluxGovernorLevelMult, nextLevel);
  neuroFluxGovernorAugmentation.baseRepRequirement =
    neuroFluxGovernorAugmentation.startingRepRequirement * multiplier * BitNodeMultipliers.AugmentationRepCost;
  neuroFluxGovernorAugmentation.baseCost =
    neuroFluxGovernorAugmentation.startingCost * multiplier * BitNodeMultipliers.AugmentationMoneyCost;

  for (let i = 0; i < Player.queuedAugmentations.length - 1; ++i) {
    neuroFluxGovernorAugmentation.baseCost *= getBaseAugmentationPriceMultiplier();
  }
}

function updateInfiltratorCosts(infiltratorAugmentation: Augmentation): void {
  const infiltratorMultiplier =
    infiltratorsAugmentations.filter((augmentation) => Player.hasAugmentation(augmentation.name)).length + 1;
  infiltratorAugmentation.baseCost = Math.pow(infiltratorAugmentation.startingCost * 1000, infiltratorMultiplier);
  if (infiltratorsAugmentations.find((augmentation) => augmentation.name === infiltratorAugmentation.name)) {
    infiltratorAugmentation.baseRepRequirement = infiltratorAugmentation.startingRepRequirement * infiltratorMultiplier;
  }
}

export function updateAugmentationCosts(): void {
  for (const name of Object.keys(Augmentations)) {
    if (Augmentations.hasOwnProperty(name)) {
      const augmentationToUpdate = Augmentations[name];
      if (augmentationToUpdate.name === AugmentationNames.NeuroFluxGovernor) {
        updateNeuroFluxGovernorCosts(augmentationToUpdate);
      } else if (augmentationToUpdate.factions.includes(FactionNames.Infiltrators)) {
        updateInfiltratorCosts(augmentationToUpdate);
      } else {
        augmentationToUpdate.baseCost *= getGenericAugmentationPriceMultiplier();
      }
    }
  }
}

//Resets an Augmentation during (re-initizliation)
function resetAugmentation(aug: Augmentation): void {
  aug.addToFactions(aug.factions);
  const name = aug.name;
  if (augmentationExists(name)) {
    delete Augmentations[name];
  }
  AddToAugmentations(aug);
}

function applyAugmentation(aug: IPlayerOwnedAugmentation, reapply = false): void {
  Augmentations[aug.name].owned = true;

  const augObj = Augmentations[aug.name];

  // Apply multipliers
  for (const mult of Object.keys(augObj.mults)) {
    const v = Player.getMult(mult) * augObj.mults[mult];
    Player.setMult(mult, v);
  }

  // Special logic for NeuroFlux Governor
  if (aug.name === AugmentationNames.NeuroFluxGovernor) {
    if (!reapply) {
      Augmentations[aug.name].level = aug.level;
      for (let i = 0; i < Player.augmentations.length; ++i) {
        if (Player.augmentations[i].name == AugmentationNames.NeuroFluxGovernor) {
          Player.augmentations[i].level = aug.level;
          return;
          // break;
        }
      }
    }
  }

  // Push onto Player's Augmentation list
  if (!reapply) {
    const ownedAug = new PlayerOwnedAugmentation(aug.name);
    Player.augmentations.push(ownedAug);
  }
}

function installAugmentations(): boolean {
  if (Player.queuedAugmentations.length == 0) {
    dialogBoxCreate("You have not purchased any Augmentations to install!");
    return false;
  }
  let augmentationList = "";
  let nfgIndex = -1;
  for (let i = Player.queuedAugmentations.length - 1; i >= 0; i--) {
    if (Player.queuedAugmentations[i].name === AugmentationNames.NeuroFluxGovernor) {
      nfgIndex = i;
      break;
    }
  }
  for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
    const ownedAug = Player.queuedAugmentations[i];
    const aug = Augmentations[ownedAug.name];
    if (aug == null) {
      console.error(`Invalid augmentation: ${ownedAug.name}`);
      continue;
    }

    applyAugmentation(Player.queuedAugmentations[i]);
    if (ownedAug.name === AugmentationNames.NeuroFluxGovernor && i !== nfgIndex) continue;

    let level = "";
    if (ownedAug.name === AugmentationNames.NeuroFluxGovernor) {
      level = ` - ${ownedAug.level}`;
    }
    augmentationList += aug.name + level + "<br>";
  }
  Player.queuedAugmentations = [];
  dialogBoxCreate(
    "You slowly drift to sleep as scientists put you under in order " +
      "to install the following Augmentations:<br>" +
      augmentationList +
      "<br>You wake up in your home...you feel different...",
  );
  prestigeAugmentation();
  return true;
}

function augmentationExists(name: string): boolean {
  return Augmentations.hasOwnProperty(name);
}

export function isRepeatableAug(aug: Augmentation): boolean {
  const augName = aug instanceof Augmentation ? aug.name : aug;
  return augName === AugmentationNames.NeuroFluxGovernor;
}

export { installAugmentations, initAugmentations, applyAugmentation, augmentationExists };
