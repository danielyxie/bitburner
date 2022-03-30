import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { netscriptDelay } from "../NetscriptEvaluator";
import { getRamCost } from "../Netscript/RamCostGenerator";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";

import {
  Stanek as IStanek,
  Fragment as IFragment,
  ActiveFragment as IActiveFragment,
} from "../ScriptEditor/NetscriptDefinitions";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";

export function NetscriptStanek(player: IPlayer, workerScript: WorkerScript, helper: INetscriptHelper): IStanek {
  function checkStanekAPIAccess(func: string): void {
    if (!player.hasAugmentation(AugmentationNames.StaneksGift1, true)) {
      helper.makeRuntimeErrorMsg(func, "Requires Stanek's Gift installed.");
    }
  }

  return {
    giftWidth: function (): number {
      helper.updateDynamicRam("giftWidth", getRamCost(player, "stanek", "giftWidth"));
      checkStanekAPIAccess("giftWidth");
      return staneksGift.width();
    },
    giftHeight: function (): number {
      helper.updateDynamicRam("giftHeight", getRamCost(player, "stanek", "giftHeight"));
      checkStanekAPIAccess("giftHeight");
      return staneksGift.height();
    },
    chargeFragment: function (_rootX: unknown, _rootY: unknown): Promise<void> {
      const rootX = helper.number("stanek.chargeFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.chargeFragment", "rootY", _rootY);

      helper.updateDynamicRam("chargeFragment", getRamCost(player, "stanek", "chargeFragment"));
      checkStanekAPIAccess("chargeFragment");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (!fragment)
        throw helper.makeRuntimeErrorMsg("stanek.chargeFragment", `No fragment with root (${rootX}, ${rootY}).`);
      const time = staneksGift.inBonus() ? 200 : 1000;
      return netscriptDelay(time, workerScript).then(function () {
        const charge = staneksGift.charge(player, fragment, workerScript.scriptRef.threads);
        workerScript.log("stanek.chargeFragment", () => `Charged fragment for ${charge} charge.`);
        return Promise.resolve();
      });
    },
    fragmentDefinitions: function (): IFragment[] {
      helper.updateDynamicRam("fragmentDefinitions", getRamCost(player, "stanek", "fragmentDefinitions"));
      checkStanekAPIAccess("fragmentDefinitions");
      workerScript.log("stanek.fragmentDefinitions", () => `Returned ${Fragments.length} fragments`);
      return Fragments.map((f) => f.copy());
    },
    activeFragments: function (): IActiveFragment[] {
      helper.updateDynamicRam("activeFragments", getRamCost(player, "stanek", "activeFragments"));
      checkStanekAPIAccess("activeFragments");
      workerScript.log("stanek.activeFragments", () => `Returned ${staneksGift.fragments.length} fragments`);
      return staneksGift.fragments.map((af) => {
        return { ...af.copy(), ...af.fragment().copy() };
      });
    },
    clearGift: function (): void {
      helper.updateDynamicRam("clearGift", getRamCost(player, "stanek", "clearGift"));
      checkStanekAPIAccess("clearGift");
      workerScript.log("stanek.clearGift", () => `Cleared Stanek's Gift.`);
      staneksGift.clear();
    },
    canPlaceFragment: function (_rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
      const rootX = helper.number("stanek.canPlaceFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.canPlaceFragment", "rootY", _rootY);
      const rotation = helper.number("stanek.canPlaceFragment", "rotation", _rotation);
      const fragmentId = helper.number("stanek.canPlaceFragment", "fragmentId", _fragmentId);
      helper.updateDynamicRam("canPlaceFragment", getRamCost(player, "stanek", "canPlaceFragment"));
      checkStanekAPIAccess("canPlaceFragment");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.canPlaceFragment", `Invalid fragment id: ${fragmentId}`);
      const can = staneksGift.canPlace(rootX, rootY, rotation, fragment);
      return can;
    },
    placeFragment: function (_rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
      const rootX = helper.number("stanek.placeFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.placeFragment", "rootY", _rootY);
      const rotation = helper.number("stanek.placeFragment", "rotation", _rotation);
      const fragmentId = helper.number("stanek.placeFragment", "fragmentId", _fragmentId);
      helper.updateDynamicRam("placeFragment", getRamCost(player, "stanek", "placeFragment"));
      checkStanekAPIAccess("placeFragment");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.placeFragment", `Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(rootX, rootY, rotation, fragment);
    },
    getFragment: function (_rootX: unknown, _rootY: unknown): IActiveFragment | undefined {
      const rootX = helper.number("stanek.getFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.getFragment", "rootY", _rootY);
      helper.updateDynamicRam("getFragment", getRamCost(player, "stanek", "getFragment"));
      checkStanekAPIAccess("getFragment");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    removeFragment: function (_rootX: unknown, _rootY: unknown): boolean {
      const rootX = helper.number("stanek.removeFragment", "rootX", _rootX);
      const rootY = helper.number("stanek.removeFragment", "rootY", _rootY);
      helper.updateDynamicRam("removeFragment", getRamCost(player, "stanek", "removeFragment"));
      checkStanekAPIAccess("removeFragment");
      return staneksGift.delete(rootX, rootY);
    },
  };
}
