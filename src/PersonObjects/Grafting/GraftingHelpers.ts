import { StaticAugmentations } from "../../Augmentation/StaticAugmentations";
import { GraftableAugmentation } from "./GraftableAugmentation";
import { Player } from "@player";

export const getGraftingAvailableAugs = (): string[] => {
  const augs: string[] = [];

  for (const [augName, aug] of Object.entries(StaticAugmentations)) {
    if (aug.isSpecial) continue;
    augs.push(augName);
  }

  return augs.filter((augmentation: string) => !Player.hasAugmentation(augmentation));
};

export const graftingIntBonus = (): number => {
  return 1 + (Player.getIntelligenceBonus(3) - 1) / 3;
};

export const calculateGraftingTimeWithBonus = (aug: GraftableAugmentation): number => {
  const baseTime = aug.time;
  return baseTime / graftingIntBonus();
};
