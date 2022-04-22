import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { GraftableAugmentation } from "./GraftableAugmentation";
import { IPlayer } from "../IPlayer";

export const getGraftingAvailableAugs = (player: IPlayer): string[] => {
  const augs: string[] = [];

  for (const [augName, aug] of Object.entries(Augmentations)) {
    if (augName === AugmentationNames.NeuroFluxGovernor || augName === AugmentationNames.TheRedPill || aug.isSpecial)
      continue;
    augs.push(augName);
  }

  return augs.filter((augmentation: string) => !player.hasAugmentation(augmentation));
};

export const graftingIntBonus = (player: IPlayer): number => {
  return 1 + (player.getIntelligenceBonus(3) - 1) / 3;
};

export const calculateGraftingTimeWithBonus = (player: IPlayer, aug: GraftableAugmentation): number => {
  const baseTime = aug.time;
  return baseTime / graftingIntBonus(player);
};
