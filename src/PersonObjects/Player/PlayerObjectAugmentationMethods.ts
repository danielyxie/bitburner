/**
 * Augmentation-related methods for the Player class (PlayerObject)
 */
import { IPlayer } from "../IPlayer";

import { Augmentation } from "../../Augmentation/Augmentation";

import { applyEntropy as calculateEntropy } from "../Grafting/EntropyAccumulation";

export function hasAugmentation(this: IPlayer, aug: string | Augmentation, installed = false): boolean {
  const augName: string = aug instanceof Augmentation ? aug.name : aug;

  for (const owned of this.augmentations) {
    if (owned.name === augName) {
      return true;
    }
  }

  if (!installed) {
    for (const owned of this.queuedAugmentations) {
      if (owned.name === augName) {
        return true;
      }
    }
  }

  return false;
}

export function applyEntropy(this: IPlayer, stacks = 1): void {
  // Re-apply all multipliers
  this.reapplyAllAugmentations();
  this.reapplyAllSourceFiles();

  const newMultipliers = calculateEntropy(this, stacks);
  for (const [mult, val] of Object.entries(newMultipliers)) {
    this.setMult(mult, val);
  }
}
