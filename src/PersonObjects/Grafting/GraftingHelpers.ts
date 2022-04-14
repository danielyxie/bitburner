import { StaticAugmentations } from "../../Augmentation/StaticAugmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { IPlayer } from "../IPlayer";

export const getGraftingAvailableAugs = (player: IPlayer): string[] => {
  const augs: string[] = [];

  for (const [augName, aug] of Object.entries(StaticAugmentations)) {
    if (augName === AugmentationNames.NeuroFluxGovernor || augName === AugmentationNames.TheRedPill || aug.isSpecial)
      continue;
    augs.push(augName);
  }

  return augs.filter((augmentation: string) => !player.hasAugmentation(augmentation));
};
