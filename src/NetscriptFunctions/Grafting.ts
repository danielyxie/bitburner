import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { StaticAugmentations } from "../Augmentation/StaticAugmentations";
import { hasAugmentationPrereqs } from "../Faction/FactionHelpers";
import { CityName } from "../Locations/data/CityNames";
import { GraftableAugmentation } from "../PersonObjects/Grafting/GraftableAugmentation";
import { getGraftingAvailableAugs, calculateGraftingTimeWithBonus } from "../PersonObjects/Grafting/GraftingHelpers";
import { Player as player } from "../Player";
import { Grafting as IGrafting } from "../ScriptEditor/NetscriptDefinitions";
import { Router } from "../ui/GameRoot";
import { GraftingWork } from "../Work/GraftingWork";
import { helpers } from "../Netscript/NetscriptHelpers";

export function NetscriptGrafting(): InternalAPI<IGrafting> {
  const checkGraftingAPIAccess = (ctx: NetscriptContext): void => {
    if (!player.canAccessGrafting()) {
      throw helpers.makeRuntimeErrorMsg(
        ctx,
        "You do not currently have access to the Grafting API. This is either because you are not in BitNode 10 or because you do not have Source-File 10",
      );
    }
  };

  return {
    getAugmentationGraftPrice:
      (ctx: NetscriptContext) =>
      (_augName: unknown): number => {
        const augName = helpers.string(ctx, "augName", _augName);
        checkGraftingAPIAccess(ctx);
        if (!getGraftingAvailableAugs().includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid aug: ${augName}`);
        }
        const graftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
        return graftableAug.cost;
      },

    getAugmentationGraftTime:
      (ctx: NetscriptContext) =>
      (_augName: string): number => {
        const augName = helpers.string(ctx, "augName", _augName);
        checkGraftingAPIAccess(ctx);
        if (!getGraftingAvailableAugs().includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
          throw helpers.makeRuntimeErrorMsg(ctx, `Invalid aug: ${augName}`);
        }
        const graftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
        return calculateGraftingTimeWithBonus(graftableAug);
      },

    getGraftableAugmentations: (ctx: NetscriptContext) => (): string[] => {
      checkGraftingAPIAccess(ctx);
      const graftableAugs = getGraftingAvailableAugs();
      return graftableAugs;
    },

    graftAugmentation:
      (ctx: NetscriptContext) =>
      (_augName: string, _focus: unknown = true): boolean => {
        const augName = helpers.string(ctx, "augName", _augName);
        const focus = !!_focus;
        checkGraftingAPIAccess(ctx);
        if (player.city !== CityName.NewTokyo) {
          throw helpers.makeRuntimeErrorMsg(ctx, "You must be in New Tokyo to begin grafting an Augmentation.");
        }
        if (!getGraftingAvailableAugs().includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
          helpers.log(ctx, () => `Invalid aug: ${augName}`);
          return false;
        }

        const wasFocusing = player.focus;

        const craftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
        if (player.money < craftableAug.cost) {
          helpers.log(ctx, () => `You don't have enough money to craft ${augName}`);
          return false;
        }

        if (!hasAugmentationPrereqs(craftableAug.augmentation)) {
          helpers.log(ctx, () => `You don't have the pre-requisites for ${augName}`);
          return false;
        }

        player.startWork(
          new GraftingWork({
            singularity: true,
            augmentation: augName,
          }),
        );

        if (focus) {
          player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          player.stopFocusing();
          Router.toTerminal();
        }

        helpers.log(ctx, () => `Began grafting Augmentation ${augName}.`);
        return true;
      },
  };
}
