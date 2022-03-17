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
    width: function (): number {
      helper.updateDynamicRam("width", getRamCost(player, "stanek", "width"));
      checkStanekAPIAccess("width");
      return staneksGift.width();
    },
    height: function (): number {
      helper.updateDynamicRam("height", getRamCost(player, "stanek", "height"));
      checkStanekAPIAccess("height");
      return staneksGift.height();
    },
    charge: function (_rootX: unknown, _rootY: unknown): Promise<void> {
      const rootX = helper.number("stanek.charge", "rootX", _rootX);
      const rootY = helper.number("stanek.charge", "rootY", _rootY);

      helper.updateDynamicRam("charge", getRamCost(player, "stanek", "charge"));
      checkStanekAPIAccess("charge");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.charge", `No fragment with root (${rootX}, ${rootY}).`);
      const time = staneksGift.inBonus() ? 200 : 1000;
      return netscriptDelay(time, workerScript).then(function () {
        const charge = staneksGift.charge(player, fragment, workerScript.scriptRef.threads);
        workerScript.log("stanek.charge", () => `Charged fragment for ${charge} charge.`);
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
    clear: function (): void {
      helper.updateDynamicRam("clear", getRamCost(player, "stanek", "clear"));
      checkStanekAPIAccess("clear");
      workerScript.log("stanek.clear", () => `Cleared Stanek's Gift.`);
      staneksGift.clear();
    },
    canPlace: function (_rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
      const rootX = helper.number("stanek.canPlace", "rootX", _rootX);
      const rootY = helper.number("stanek.canPlace", "rootY", _rootY);
      const rotation = helper.number("stanek.canPlace", "rotation", _rotation);
      const fragmentId = helper.number("stanek.canPlace", "fragmentId", _fragmentId);
      helper.updateDynamicRam("canPlace", getRamCost(player, "stanek", "canPlace"));
      checkStanekAPIAccess("canPlace");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.canPlace", `Invalid fragment id: ${fragmentId}`);
      const can = staneksGift.canPlace(rootX, rootY, rotation, fragment);
      return can;
    },
    place: function (_rootX: unknown, _rootY: unknown, _rotation: unknown, _fragmentId: unknown): boolean {
      const rootX = helper.number("stanek.place", "rootX", _rootX);
      const rootY = helper.number("stanek.place", "rootY", _rootY);
      const rotation = helper.number("stanek.place", "rotation", _rotation);
      const fragmentId = helper.number("stanek.place", "fragmentId", _fragmentId);
      helper.updateDynamicRam("place", getRamCost(player, "stanek", "place"));
      checkStanekAPIAccess("place");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.place", `Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(rootX, rootY, rotation, fragment);
    },
    get: function (_rootX: unknown, _rootY: unknown): IActiveFragment | undefined {
      const rootX = helper.number("stanek.get", "rootX", _rootX);
      const rootY = helper.number("stanek.get", "rootY", _rootY);
      helper.updateDynamicRam("get", getRamCost(player, "stanek", "get"));
      checkStanekAPIAccess("get");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    remove: function (_rootX: unknown, _rootY: unknown): boolean {
      const rootX = helper.number("stanek.remove", "rootX", _rootX);
      const rootY = helper.number("stanek.remove", "rootY", _rootY);
      helper.updateDynamicRam("remove", getRamCost(player, "stanek", "remove"));
      checkStanekAPIAccess("remove");
      return staneksGift.delete(rootX, rootY);
    },
  };
}
