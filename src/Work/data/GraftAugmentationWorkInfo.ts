import { merge } from "lodash";
import { applyAugmentation } from "../../Augmentation/AugmentationHelpers";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../../Constants";
import { graftingIntBonus } from "../../PersonObjects/Grafting/GraftingHelpers";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { GraftAugmentationWorkInfo } from "../WorkInfo";
import { WorkManager } from "../WorkManager";

export const baseGraftAugmentationWorkInfo: GraftAugmentationWorkInfo = {
  augmentation: "",
  timeWorked: 0,
  throughAPI: false,

  start: function (workManager: WorkManager, { augmentation, time, throughAPI = false }): void {
    workManager.timeToCompletion = time;

    // Update manager data with augmentation name
    merge(workManager.info.graftAugmentation, <GraftAugmentationWorkInfo>{
      augmentation,
      throughAPI,
      timeWorked: 0,
    });
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    // Get focus bonus
    // TODO: Helper function for this
    let focusBonus = 1;
    if (!workManager.player.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
      focusBonus = workManager.player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }

    // Calculate speed bonus
    let skillMult = graftingIntBonus(workManager.player);
    skillMult *= focusBonus;

    // Update actual time worked
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;
    // Update effective time worked
    workManager.info.graftAugmentation.timeWorked += CONSTANTS._idleSpeed * numCycles * skillMult;

    // If grafting is done, finish task through manager
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

    // If not cancelled, grant Augmentation and stuff
    if (options.cancelled === false) {
      // Apply aug
      applyAugmentation({ name: augName, level: 1 });

      // If player doesn't have nickofolas Congruity Implant, apply a level of entropy
      if (!workManager.player.hasAugmentation(AugmentationNames.CongruityImplant)) {
        workManager.player.entropy += 1;
        workManager.player.applyEntropy(workManager.player.entropy);
      }

      // If not done through API, show a popup
      if (!options?.singularity && !this.throughAPI) {
        dialogBoxCreate(
          `You've finished grafting ${augName}.<br>The augmentation has been applied to your body` +
            (workManager.player.hasAugmentation(AugmentationNames.CongruityImplant)
              ? "."
              : ", but you feel a bit off."),
        );
      }
    } else if (options.cancelled && !options?.singularity && !this.throughAPI) {
      // If grafting was cancelled and it wasn't done through API, show a popup
      dialogBoxCreate(`You cancelled the grafting of ${augName}.<br>Your money was not returned to you.`);
    }

    // If grafting wasn't cancelled, gain some INT exp
    if (!options.cancelled) {
      workManager.player.gainIntelligenceExp((CONSTANTS.IntelligenceGraftBaseExpGain * workManager.timeWorked) / 10000);
    }

    return `Grafting of ${augName} has ended.`;
  },
};
