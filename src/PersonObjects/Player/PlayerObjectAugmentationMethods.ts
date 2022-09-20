/**
 * Augmentation-related methods for the Player class (PlayerObject)
 */
import { PlayerObject } from "./PlayerObject";

import { Augmentation } from "../../Augmentation/Augmentation";

import { calculateEntropy } from "../Grafting/EntropyAccumulation";

export function hasAugmentation(this: PlayerObject, aug: string | Augmentation, ignoreQueued = false): boolean {
  const augName: string = aug instanceof Augmentation ? aug.name : aug;

  for (const owned of this.augmentations) {
    if (owned.name === augName) {
      return true;
    }
  }

  if (!ignoreQueued) {
    for (const owned of this.queuedAugmentations) {
      if (owned.name === augName) {
        return true;
      }
    }
  }

  return false;
}

export function applyEntropy(this: PlayerObject, stacks = 1): void {
  // Re-apply all multipliers
  this.reapplyAllAugmentations();
  this.reapplyAllSourceFiles();

  this.mults = calculateEntropy(stacks);
}
