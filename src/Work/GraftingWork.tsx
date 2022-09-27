import React from "react";
import { CONSTANTS } from "../Constants";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { GraftableAugmentations } from "../PersonObjects/Grafting/ui/GraftingRoot";
import { Player } from "../Player";
import { Work, WorkType } from "./Work";
import { graftingIntBonus } from "../PersonObjects/Grafting/GraftingHelpers";
import { applyAugmentation } from "../Augmentation/AugmentationHelpers";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { GraftableAugmentation } from "../PersonObjects/Grafting/GraftableAugmentation";
import { StaticAugmentations } from "../Augmentation/StaticAugmentations";

export const isGraftingWork = (w: Work | null): w is GraftingWork => w !== null && w.type === WorkType.GRAFTING;

interface GraftingWorkParams {
  augmentation: string;
  singularity: boolean;
}

export class GraftingWork extends Work {
  augmentation: string;
  unitCompleted: number;

  constructor(params?: GraftingWorkParams) {
    super(WorkType.GRAFTING, params?.singularity ?? true);
    this.unitCompleted = 0;
    this.augmentation = params?.augmentation ?? AugmentationNames.Targeting1;
    const gAugs = GraftableAugmentations();
    if (params) Player.loseMoney(gAugs[this.augmentation].cost, "augmentations");
  }

  unitNeeded(): number {
    return new GraftableAugmentation(StaticAugmentations[this.augmentation]).time;
  }

  process(cycles: number): boolean {
    let focusBonus = 1;
    if (!Player.hasAugmentation(AugmentationNames.NeuroreceptorManager, true)) {
      focusBonus = Player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }

    this.cyclesWorked += cycles;
    this.unitCompleted += CONSTANTS._idleSpeed * cycles * graftingIntBonus() * focusBonus;

    return this.unitCompleted >= this.unitNeeded();
  }

  finish(cancelled: boolean): void {
    const augName = this.augmentation;
    if (!cancelled) {
      applyAugmentation({ name: augName, level: 1 });

      if (!Player.hasAugmentation(AugmentationNames.CongruityImplant, true)) {
        Player.entropy += 1;
        Player.applyEntropy(Player.entropy);
      }

      if (!this.singularity) {
        dialogBoxCreate(
          <>
            You've finished grafting {augName}.<br />
            The augmentation has been applied to your body{" "}
            {Player.hasAugmentation(AugmentationNames.CongruityImplant, true) ? "." : ", but you feel a bit off."}
          </>,
        );
      }
    } else if (cancelled && !this.singularity) {
      dialogBoxCreate(
        <>
          You cancelled the grafting of {augName}.
          <br />
          Your money was not returned to you.
        </>,
      );
    }

    // Intelligence gain
    if (!cancelled) {
      Player.gainIntelligenceExp(
        (CONSTANTS.IntelligenceGraftBaseExpGain * this.cyclesWorked * CONSTANTS._idleSpeed) / 10000,
      );
    }
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      cyclesWorked: this.cyclesWorked,
      augmentation: this.augmentation,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("GraftingWork", this);
  }

  /**
   * Initiatizes a GraftingWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): GraftingWork {
    return Generic_fromJSON(GraftingWork, value.data);
  }
}

Reviver.constructors.GraftingWork = GraftingWork;
