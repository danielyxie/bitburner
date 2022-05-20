import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { StaticAugmentations } from "../Augmentation/StaticAugmentations";
import { hasAugmentationPrereqs } from "../Faction/FactionHelpers";
import { CityName } from "../Locations/data/CityNames";
import { GraftableAugmentation } from "../PersonObjects/Grafting/GraftableAugmentation";
import { getGraftingAvailableAugs, calculateGraftingTimeWithBonus } from "../PersonObjects/Grafting/GraftingHelpers";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Grafting as IGrafting } from "../ScriptEditor/NetscriptDefinitions";
import { Router } from "../ui/GameRoot";

export function NetscriptGrafting(player: IPlayer): InternalAPI<IGrafting> {
  const checkGraftingAPIAccess = (ctx: NetscriptContext): void => {
    if (!player.canAccessGrafting()) {
      throw ctx.makeRuntimeErrorMsg(
        "You do not currently have access to the Grafting API. This is either because you are not in BitNode 10 or because you do not have Source-File 10",
      );
    }
  };

  return {
    getAugmentationGraftPrice:
      (ctx: NetscriptContext) =>
      (_augName: unknown): number => {
        const augName = ctx.helper.string("augName", _augName);
        checkGraftingAPIAccess(ctx);
        if (!getGraftingAvailableAugs(player).includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
          throw ctx.makeRuntimeErrorMsg(`Invalid aug: ${augName}`);
        }
        const graftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
        return graftableAug.cost;
      },

    getAugmentationGraftTime:
      (ctx: NetscriptContext) =>
      (_augName: string): number => {
        const augName = ctx.helper.string("augName", _augName);
        checkGraftingAPIAccess(ctx);
        if (!getGraftingAvailableAugs(player).includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
          throw ctx.makeRuntimeErrorMsg(`Invalid aug: ${augName}`);
        }
        const graftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
        return calculateGraftingTimeWithBonus(player, graftableAug);
      },

    getGraftableAugmentations: (ctx: NetscriptContext) => (): string[] => {
      checkGraftingAPIAccess(ctx);
      const graftableAugs = getGraftingAvailableAugs(player);
      return graftableAugs;
    },

    graftAugmentation:
      (ctx: NetscriptContext) =>
      (_augName: string, _focus: unknown = true): boolean => {
        const augName = ctx.helper.string("augName", _augName);
        const focus = ctx.helper.boolean(_focus);
        checkGraftingAPIAccess(ctx);
        if (player.city !== CityName.NewTokyo) {
          throw ctx.makeRuntimeErrorMsg("You must be in New Tokyo to begin grafting an Augmentation.");
        }
        if (!getGraftingAvailableAugs(player).includes(augName) || !StaticAugmentations.hasOwnProperty(augName)) {
          ctx.log(() => `Invalid aug: ${augName}`);
          return false;
        }

        const wasFocusing = player.focus;
        if (player.isWorking) {
          const txt = player.singularityStopWork();
          ctx.log(() => txt);
        }

        const craftableAug = new GraftableAugmentation(StaticAugmentations[augName]);
        if (player.money < craftableAug.cost) {
          ctx.log(() => `You don't have enough money to craft ${augName}`);
          return false;
        }

        if (!hasAugmentationPrereqs(craftableAug.augmentation)) {
          ctx.log(() => `You don't have the pre-requisites for ${augName}`);
          return false;
        }

        player.loseMoney(craftableAug.cost, "augmentations");
        player.startGraftAugmentationWork(augName, craftableAug.time);

        if (focus) {
          player.startFocusing();
          Router.toWork();
        } else if (wasFocusing) {
          player.stopFocusing();
          Router.toTerminal();
        }

        ctx.log(() => `Began grafting Augmentation ${augName}.`);
        return true;
      },
  };
}
