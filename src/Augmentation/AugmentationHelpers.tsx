import { Augmentation } from "./Augmentation";
import { StaticAugmentations } from "./StaticAugmentations";
import { PlayerOwnedAugmentation, IPlayerOwnedAugmentation } from "./PlayerOwnedAugmentation";
import { AugmentationNames } from "./data/AugmentationNames";

import { CONSTANTS } from "../Constants";
import { Factions, factionExists } from "../Faction/Factions";
import { Player } from "../Player";
import { prestigeAugmentation } from "../Prestige";

import { dialogBoxCreate } from "../ui/React/DialogBox";
import { clearObject } from "../utils/helpers/clearObject";

import { FactionNames } from "../Faction/data/FactionNames";
import {
  initBladeburnerAugmentations,
  initChurchOfTheMachineGodAugmentations,
  initGeneralAugmentations,
  initInfiltratorsAugmentations,
  initNeuroFluxGovernor,
  initUnstableCircadianModulator,
} from "./data/AugmentationCreator";
import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Router } from "../ui/GameRoot";

export function AddToStaticAugmentations(aug: Augmentation): void {
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
  StaticAugmentations[name] = aug;
}

function createAugmentations(): void {
  [
    initNeuroFluxGovernor(),
    initUnstableCircadianModulator(),
    ...initGeneralAugmentations(),
    ...initInfiltratorsAugmentations(),
    ...(factionExists(FactionNames.Bladeburners) ? initBladeburnerAugmentations() : []),
    ...(factionExists(FactionNames.ChurchOfTheMachineGod) ? initChurchOfTheMachineGodAugmentations() : []),
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
  clearObject(StaticAugmentations);
  createAugmentations();
  updateAugmentationCosts();
  Player.reapplyAllAugmentations();
}

function getBaseAugmentationPriceMultiplier(): number {
  return CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][Player.sourceFileLvl(11)];
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

  for (let i = 0; i < Player.queuedAugmentations.length; ++i) {
    neuroFluxGovernorAugmentation.baseCost *= getBaseAugmentationPriceMultiplier();
  }
}

function updateInfiltratorCosts(infiltratorAugmentation: Augmentation): void {
  const infiltratorAugmentationNames = initInfiltratorsAugmentations().map((augmentation) => augmentation.name);
  const infiltratorMultiplier =
    infiltratorAugmentationNames.filter((augmentationName) => Player.hasAugmentation(augmentationName)).length + 1;
  infiltratorAugmentation.baseCost = Math.pow(infiltratorAugmentation.startingCost * 1000, infiltratorMultiplier);
  if (infiltratorAugmentationNames.find((augmentationName) => augmentationName === infiltratorAugmentation.name)) {
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
        augmentationToUpdate.baseCost =
          augmentationToUpdate.startingCost *
          getGenericAugmentationPriceMultiplier() *
          BitNodeMultipliers.AugmentationMoneyCost;
      }
    }
  }
}

//Resets an Augmentation during (re-initizliation)
function resetAugmentation(aug: Augmentation): void {
  aug.addToFactions(aug.factions);
  const name = aug.name;
  if (augmentationExists(name)) {
    delete StaticAugmentations[name];
  }
  AddToStaticAugmentations(aug);
}

function applyAugmentation(aug: IPlayerOwnedAugmentation, reapply = false): void {
  const staticAugmentation = StaticAugmentations[aug.name];

  // Apply multipliers
  for (const mult of Object.keys(staticAugmentation.mults)) {
    const v = Player.getMult(mult) * staticAugmentation.mults[mult];
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

  // Special logic for Congruity Implant
  if (aug.name === AugmentationNames.CongruityImplant && !reapply) {
    Player.entropy = 0;
    Player.applyEntropy(Player.entropy);
  }

  // Push onto Player's Augmentation list
  if (!reapply) {
    const ownedAug = new PlayerOwnedAugmentation(aug.name);
    Player.augmentations.push(ownedAug);
  }
}

function installAugmentations(force?: boolean): boolean {
  if (Player.queuedAugmentations.length == 0 && !force) {
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
    const aug = StaticAugmentations[ownedAug.name];
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
  if (!force) {
    dialogBoxCreate(
      "You slowly drift to sleep as scientists put you under in order " +
        "to install the following Augmentations:<br>" +
        augmentationList +
        "<br>You wake up in your home...you feel different...",
    );
  }
  prestigeAugmentation();
  Router.toTerminal();
  return true;
}

function augmentationExists(name: string): boolean {
  return StaticAugmentations.hasOwnProperty(name);
}

export function isRepeatableAug(aug: Augmentation): boolean {
  const augName = aug instanceof Augmentation ? aug.name : aug;
  return augName === AugmentationNames.NeuroFluxGovernor;
}

export { installAugmentations, initAugmentations, applyAugmentation, augmentationExists };
