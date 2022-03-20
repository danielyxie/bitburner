import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { netscriptDelay } from "../NetscriptEvaluator";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";

import {
  Fragment as IFragment,
  ActiveFragment as IActiveFragment,
} from "../ScriptEditor/NetscriptDefinitions";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { NetscriptContext, InternalNetscriptAPI } from "src/Netscript/APIWrapper";

export function NetscriptStanek(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): InternalNetscriptAPI {
  function checkStanekAPIAccess(func: string): void {
    if (!player.hasAugmentation(AugmentationNames.StaneksGift1, true)) {
      helper.makeRuntimeErrorMsg(func, "Requires Stanek's Gift installed.");
    }
  }

  return {
    giftWidth: function (ctx: NetscriptContext): number {
      ctx.updateDynamicRam();
      checkStanekAPIAccess("giftWidth");
      return staneksGift.width();
    },
    giftHeight: function (ctx: NetscriptContext): number {
      ctx.updateDynamicRam();
      checkStanekAPIAccess("giftHeight");
      return staneksGift.height();
    },
    chargeFragment: function (ctx: NetscriptContext, _rootX: unknown, _rootY: unknown): Promise<void> {
      ctx.updateDynamicRam();
      const rootX = helper.number("stanek.chargeFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.chargeFragment", "rootY", _rootY);
      checkStanekAPIAccess("chargeFragment");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (!fragment) throw ctx.makeRuntimeErrorMsg(`No fragment with root (${rootX}, ${rootY}).`);
      const time = staneksGift.inBonus() ? 200 : 1000;
      return netscriptDelay(time, workerScript).then(function () {
        const charge = staneksGift.charge(player, fragment, workerScript.scriptRef.threads);
        ctx.log(() => `Charged fragment for ${charge} charge.`);
        return Promise.resolve();
      });
    },
    fragmentDefinitions: function (ctx: NetscriptContext): IFragment[] {
      ctx.updateDynamicRam();
      checkStanekAPIAccess("fragmentDefinitions");
      ctx.log(() => `Returned ${Fragments.length} fragments`);
      return Fragments.map((f) => f.copy());
    },
    activeFragments: function (ctx: NetscriptContext): IActiveFragment[] {
      ctx.updateDynamicRam();
      checkStanekAPIAccess("activeFragments");
      ctx.log(() => `Returned ${staneksGift.fragments.length} fragments`);
      return staneksGift.fragments.map((af) => {
        return { ...af.copy(), ...af.fragment().copy() };
      });
    },
    clearGift: function (ctx: NetscriptContext): void {
      ctx.updateDynamicRam();
      checkStanekAPIAccess("clearGift");
      ctx.log(() => `Cleared Stanek's Gift.`);
      staneksGift.clear();
    },
    canPlaceFragment: function (ctx: NetscriptContext, _rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
      ctx.updateDynamicRam();
      const rootX = helper.number("stanek.canPlaceFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.canPlaceFragment", "rootY", _rootY);
      const rotation = helper.number("stanek.canPlaceFragment", "rotation", _rotation);
      const fragmentId = helper.number("stanek.canPlaceFragment", "fragmentId", _fragmentId);
      checkStanekAPIAccess("canPlaceFragment");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw ctx.makeRuntimeErrorMsg(`Invalid fragment id: ${fragmentId}`);
      const can = staneksGift.canPlace(rootX, rootY, rotation, fragment);
      return can;
    },
    placeFragment: function (ctx: NetscriptContext, _rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
      ctx.updateDynamicRam();
      const rootX = helper.number("stanek.placeFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.placeFragment", "rootY", _rootY);
      const rotation = helper.number("stanek.placeFragment", "rotation", _rotation);
      const fragmentId = helper.number("stanek.placeFragment", "fragmentId", _fragmentId);
      checkStanekAPIAccess("placeFragment");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw ctx.makeRuntimeErrorMsg(`Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(rootX, rootY, rotation, fragment);
    },
    getFragment: function (ctx: NetscriptContext, _rootX: unknown, _rootY: unknown): IActiveFragment | undefined {
      ctx.updateDynamicRam();
      const rootX = helper.number("stanek.getFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.getFragment", "rootY", _rootY);
      checkStanekAPIAccess("getFragment");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    removeFragment: function (ctx: NetscriptContext, _rootX: unknown, _rootY: unknown): boolean {
      ctx.updateDynamicRam();
      const rootX = helper.number("stanek.removeFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.removeFragment", "rootY", _rootY);
      checkStanekAPIAccess("removeFragment");
      return staneksGift.delete(rootX, rootY);
    },
  };
}
