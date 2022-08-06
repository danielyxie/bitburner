import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { netscriptDelay } from "../NetscriptEvaluator";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";
import { FragmentType } from "../CotMG/FragmentType";

import {
  Fragment as IFragment,
  ActiveFragment as IActiveFragment,
  Stanek as IStanek,
} from "../ScriptEditor/NetscriptDefinitions";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { NetscriptContext, InternalAPI } from "../Netscript/APIWrapper";
import { applyAugmentation } from "../Augmentation/AugmentationHelpers";
import { FactionNames } from "../Faction/data/FactionNames";
import { joinFaction } from "../Faction/FactionHelpers";
import { Factions } from "../Faction/Factions";

export function NetscriptStanek(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): InternalAPI<IStanek> {
  function checkStanekAPIAccess(func: string): void {
    if (!player.hasAugmentation(AugmentationNames.StaneksGift1, true)) {
      throw helper.makeRuntimeErrorMsg(func, "Stanek's Gift is not installed");
    }
  }

  return {
    giftWidth: () =>
      function (): number {
        checkStanekAPIAccess("giftWidth");
        return staneksGift.width();
      },
    giftHeight: () =>
      function (): number {
        checkStanekAPIAccess("giftHeight");
        return staneksGift.height();
      },
    chargeFragment: (_ctx: NetscriptContext) =>
      function (_rootX: unknown, _rootY: unknown): Promise<void> {
        //Get the fragment object using the given coordinates
        const rootX = _ctx.helper.number("rootX", _rootX);
        const rootY = _ctx.helper.number("rootY", _rootY);
        checkStanekAPIAccess("chargeFragment");
        const fragment = staneksGift.findFragment(rootX, rootY);
        //Check whether the selected fragment can ge charged
        if (!fragment) throw _ctx.makeRuntimeErrorMsg(`No fragment with root (${rootX}, ${rootY}).`);
        if (fragment.fragment().type == FragmentType.Booster) {
          throw _ctx.makeRuntimeErrorMsg(
            `The fragment with root (${rootX}, ${rootY}) is a Booster Fragment and thus cannot be charged.`,
          );
        }
        //Charge the fragment
        const time = staneksGift.inBonus() ? 200 : 1000;
        return netscriptDelay("stanek.charge", time, workerScript).then(function () {
          staneksGift.charge(player, fragment, workerScript.scriptRef.threads);
          _ctx.log(() => `Charged fragment with ${_ctx.workerScript.scriptRef.threads} threads.`);
          return Promise.resolve();
        });
      },
    fragmentDefinitions: (_ctx: NetscriptContext) =>
      function (): IFragment[] {
        checkStanekAPIAccess("fragmentDefinitions");
        _ctx.log(() => `Returned ${Fragments.length} fragments`);
        return Fragments.map((f) => f.copy());
      },
    activeFragments: (_ctx: NetscriptContext) =>
      function (): IActiveFragment[] {
        checkStanekAPIAccess("activeFragments");
        _ctx.log(() => `Returned ${staneksGift.fragments.length} fragments`);
        return staneksGift.fragments.map((af) => {
          return { ...af.copy(), ...af.fragment().copy() };
        });
      },
    clearGift: (_ctx: NetscriptContext) =>
      function (): void {
        checkStanekAPIAccess("clearGift");
        _ctx.log(() => `Cleared Stanek's Gift.`);
        staneksGift.clear();
      },
    canPlaceFragment: (_ctx: NetscriptContext) =>
      function (_rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
        const rootX = _ctx.helper.number("rootX", _rootX);
        const rootY = _ctx.helper.number("rootY", _rootY);
        const rotation = _ctx.helper.number("rotation", _rotation);
        const fragmentId = _ctx.helper.number("fragmentId", _fragmentId);
        checkStanekAPIAccess("canPlaceFragment");
        const fragment = FragmentById(fragmentId);
        if (!fragment) throw _ctx.makeRuntimeErrorMsg(`Invalid fragment id: ${fragmentId}`);
        const can = staneksGift.canPlace(rootX, rootY, rotation, fragment);
        return can;
      },
    placeFragment: (_ctx: NetscriptContext) =>
      function (_rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
        const rootX = _ctx.helper.number("rootX", _rootX);
        const rootY = _ctx.helper.number("rootY", _rootY);
        const rotation = _ctx.helper.number("rotation", _rotation);
        const fragmentId = _ctx.helper.number("fragmentId", _fragmentId);
        checkStanekAPIAccess("placeFragment");
        const fragment = FragmentById(fragmentId);
        if (!fragment) throw _ctx.makeRuntimeErrorMsg(`Invalid fragment id: ${fragmentId}`);
        return staneksGift.place(rootX, rootY, rotation, fragment);
      },
    getFragment: (_ctx: NetscriptContext) =>
      function (_rootX: unknown, _rootY: unknown): IActiveFragment | undefined {
        const rootX = _ctx.helper.number("rootX", _rootX);
        const rootY = _ctx.helper.number("rootY", _rootY);
        checkStanekAPIAccess("getFragment");
        const fragment = staneksGift.findFragment(rootX, rootY);
        if (fragment !== undefined) return fragment.copy();
        return undefined;
      },
    removeFragment: (_ctx: NetscriptContext) =>
      function (_rootX: unknown, _rootY: unknown): boolean {
        const rootX = _ctx.helper.number("rootX", _rootX);
        const rootY = _ctx.helper.number("rootY", _rootY);
        checkStanekAPIAccess("removeFragment");
        return staneksGift.delete(rootX, rootY);
      },
    acceptGift: (_ctx: NetscriptContext) =>
      function (): boolean {
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
            _ctx.log(
              () => `'${FactionNames.ChurchOfTheMachineGod}' joined and '${AugmentationNames.StaneksGift1}' installed.`,
            );
          }
        }
        //Return true iff the player is in CotMG and has the first Stanek aug installed
        return (
          Factions[FactionNames.ChurchOfTheMachineGod].isMember &&
          player.hasAugmentation(AugmentationNames.StaneksGift1)
        );
      },
  };
}
