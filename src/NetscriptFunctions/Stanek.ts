import { Player as player } from "../Player";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";
import { FragmentType } from "../CotMG/FragmentType";

import { Stanek as IStanek } from "../ScriptEditor/NetscriptDefinitions";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { NetscriptContext, InternalAPI } from "../Netscript/APIWrapper";
import { applyAugmentation } from "../Augmentation/AugmentationHelpers";
import { FactionNames } from "../Faction/data/FactionNames";
import { joinFaction } from "../Faction/FactionHelpers";
import { Factions } from "../Faction/Factions";
import { helpers } from "../Netscript/NetscriptHelpers";

export function NetscriptStanek(): InternalAPI<IStanek> {
  function checkStanekAPIAccess(ctx: NetscriptContext): void {
    if (!player.hasAugmentation(AugmentationNames.StaneksGift1, true)) {
      throw helpers.makeRuntimeErrorMsg(ctx, "Stanek's Gift is not installed");
    }
  }

  return {
    giftWidth: (ctx) => () => {
      checkStanekAPIAccess(ctx);
      return staneksGift.width();
    },
    giftHeight: (ctx) => () => {
      checkStanekAPIAccess(ctx);
      return staneksGift.height();
    },
    chargeFragment: (ctx) => (_rootX, _rootY) => {
      //Get the fragment object using the given coordinates
      const rootX = helpers.number(ctx, "rootX", _rootX);
      const rootY = helpers.number(ctx, "rootY", _rootY);
      checkStanekAPIAccess(ctx);
      const fragment = staneksGift.findFragment(rootX, rootY);
      //Check whether the selected fragment can ge charged
      if (!fragment) throw helpers.makeRuntimeErrorMsg(ctx, `No fragment with root (${rootX}, ${rootY}).`);
      if (fragment.fragment().type == FragmentType.Booster) {
        throw helpers.makeRuntimeErrorMsg(
          ctx,
          `The fragment with root (${rootX}, ${rootY}) is a Booster Fragment and thus cannot be charged.`,
        );
      }
      //Charge the fragment
      const time = staneksGift.inBonus() ? 200 : 1000;
      return helpers.netscriptDelay(ctx, time).then(function () {
        staneksGift.charge(fragment, ctx.workerScript.scriptRef.threads);
        helpers.log(ctx, () => `Charged fragment with ${ctx.workerScript.scriptRef.threads} threads.`);
        return Promise.resolve();
      });
    },
    fragmentDefinitions: (ctx) => () => {
      checkStanekAPIAccess(ctx);
      helpers.log(ctx, () => `Returned ${Fragments.length} fragments`);
      return Fragments.map((f) => f.copy());
    },
    activeFragments: (ctx) => () => {
      checkStanekAPIAccess(ctx);
      helpers.log(ctx, () => `Returned ${staneksGift.fragments.length} fragments`);
      return staneksGift.fragments.map((af) => {
        return { ...af.copy(), ...af.fragment().copy() };
      });
    },
    clearGift: (ctx) => () => {
      checkStanekAPIAccess(ctx);
      helpers.log(ctx, () => `Cleared Stanek's Gift.`);
      staneksGift.clear();
    },
    canPlaceFragment: (ctx) => (_rootX, _rootY, _rotation, _fragmentId) => {
      const rootX = helpers.number(ctx, "rootX", _rootX);
      const rootY = helpers.number(ctx, "rootY", _rootY);
      const rotation = helpers.number(ctx, "rotation", _rotation);
      const fragmentId = helpers.number(ctx, "fragmentId", _fragmentId);
      checkStanekAPIAccess(ctx);
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid fragment id: ${fragmentId}`);
      const can = staneksGift.canPlace(rootX, rootY, rotation, fragment);
      return can;
    },
    placeFragment: (ctx) => (_rootX, _rootY, _rotation, _fragmentId) => {
      const rootX = helpers.number(ctx, "rootX", _rootX);
      const rootY = helpers.number(ctx, "rootY", _rootY);
      const rotation = helpers.number(ctx, "rotation", _rotation);
      const fragmentId = helpers.number(ctx, "fragmentId", _fragmentId);
      checkStanekAPIAccess(ctx);
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helpers.makeRuntimeErrorMsg(ctx, `Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(rootX, rootY, rotation, fragment);
    },
    getFragment: (ctx) => (_rootX, _rootY) => {
      const rootX = helpers.number(ctx, "rootX", _rootX);
      const rootY = helpers.number(ctx, "rootY", _rootY);
      checkStanekAPIAccess(ctx);
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    removeFragment: (ctx) => (_rootX, _rootY) => {
      const rootX = helpers.number(ctx, "rootX", _rootX);
      const rootY = helpers.number(ctx, "rootY", _rootY);
      checkStanekAPIAccess(ctx);
      return staneksGift.delete(rootX, rootY);
    },
    acceptGift: (ctx) => () => {
      //Check if the player is eligible to join the church
      if (
        player.canAccessCotMG() &&
        player.augmentations.filter((a) => a.name !== AugmentationNames.NeuroFluxGovernor).length == 0 &&
        player.queuedAugmentations.filter((a) => a.name !== AugmentationNames.NeuroFluxGovernor).length == 0
      ) {
        //Attempt to join CotMG
        joinFaction(Factions[FactionNames.ChurchOfTheMachineGod]);
        //Attempt to install the first Stanek aug
        if (
          !player.hasAugmentation(AugmentationNames.StaneksGift1) &&
          !player.queuedAugmentations.some((a) => a.name === AugmentationNames.StaneksGift1)
        ) {
          applyAugmentation({ name: AugmentationNames.StaneksGift1, level: 1 });
          helpers.log(
            ctx,
            () => `'${FactionNames.ChurchOfTheMachineGod}' joined and '${AugmentationNames.StaneksGift1}' installed.`,
          );
        }
      }
      //Return true iff the player is in CotMG and has the first Stanek aug installed
      return (
        Factions[FactionNames.ChurchOfTheMachineGod].isMember &&
        player.hasAugmentation(AugmentationNames.StaneksGift1, true)
      );
    },
  };
}
