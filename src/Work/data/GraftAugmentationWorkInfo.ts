import { merge } from "lodash";
import { applyAugmentation } from "../../Augmentation/AugmentationHelpers";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../../Constants";
import { graftingIntBonus } from "../../PersonObjects/Grafting/GraftingHelpers";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { GraftAugmentationWorkInfo } from "../WorkInfo";
import { WorkManager } from "../WorkManager";
import { WorkType } from "../WorkType";

export const baseGraftAugmentationWorkInfo: GraftAugmentationWorkInfo = {
  augmentation: "",
  timeWorked: 0,

  start: function (workManager: WorkManager, { augmentation, time }): void {
    workManager.workType = WorkType.GraftAugmentation;
    workManager.timeToCompletion = time;

    merge(workManager.info.graftAugmentation, <GraftAugmentationWorkInfo>{
      augmentation,
      timeWorked: 0,
    });
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    let focusBonus = 1;
    if (!workManager.player.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
      focusBonus = workManager.player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }

    let skillMult = graftingIntBonus(workManager.player);
    skillMult *= focusBonus;

    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;
    workManager.info.graftAugmentation.timeWorked += CONSTANTS._idleSpeed * numCycles * skillMult;

    if (workManager.info.graftAugmentation.timeWorked >= workManager.timeToCompletion) {
      workManager.finish({ cancelled: false });
      return true;
    }
    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    const augName = workManager.info.graftAugmentation.augmentation;
    if (options.cancelled === false && !options?.singularity) {
      applyAugmentation({ name: augName, level: 1 });

      if (!workManager.player.hasAugmentation(AugmentationNames.CongruityImplant)) {
        workManager.player.entropy += 1;
        workManager.player.applyEntropy(workManager.player.entropy);
      }

      dialogBoxCreate(
        `You've finished grafting ${augName}.<br>The augmentation has been applied to your body` +
          (workManager.player.hasAugmentation(AugmentationNames.CongruityImplant) ? "." : ", but you feel a bit off."),
      );
    } else if (!options.cancelled && !options?.singularity) {
      dialogBoxCreate(`You cancelled the grafting of ${augName}.<br>Your money was not returned to you.`);
    }

    if (!options.cancelled) {
      workManager.player.gainIntelligenceExp((CONSTANTS.IntelligenceGraftBaseExpGain * workManager.timeWorked) / 10000);
    }

    return `Grafting of ${augName} has ended.`;
  },
};
