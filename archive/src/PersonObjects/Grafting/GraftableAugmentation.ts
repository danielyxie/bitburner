import { sum } from "lodash";

import { Augmentation } from "../../Augmentation/Augmentation";
import { CONSTANTS } from "../../Constants";

export interface IConstructorParams {
  augmentation: Augmentation;
  readonly cost: number;
  readonly time: number;
}

export class GraftableAugmentation {
  // The augmentation that this craftable corresponds to
  augmentation: Augmentation;

  constructor(augmentation: Augmentation) {
    this.augmentation = augmentation;
  }

  get cost(): number {
    return this.augmentation.baseCost * CONSTANTS.AugmentationGraftingCostMult;
  }

  get time(): number {
    // Time = 1 hour * log_2(sum(aug multipliers) || 1) + 30 minutes
    const antiLog = Math.max(sum(Object.values(this.augmentation.mults).filter((x) => x !== 1)), 1);

    const mult = Math.log2(antiLog);
    return (CONSTANTS.AugmentationGraftingTimeBase * mult + CONSTANTS.MillisecondsPerHalfHour) / 2;
  }
}
