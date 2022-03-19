import { Augmentation } from "../../Augmentation/Augmentation";
import { CONSTANTS } from "../../Constants";

export interface IConstructorParams {
  augmentation: Augmentation;
  readonly cost: number;
  readonly time: number;
}

export class CraftableAugmentation {
  // The augmentation that this craftable corresponds to
  augmentation: Augmentation;

  constructor(augmentation: Augmentation) {
    this.augmentation = augmentation;
  }

  get cost(): number {
    return this.augmentation.startingCost * CONSTANTS.AugmentationCraftingCostMult;
  }

  get time(): number {
    // CONSTANTS.AugmentationCraftingTimeMult
    return 15000;
  }
}
