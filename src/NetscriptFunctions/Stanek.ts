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
      return staneksGift.width();
    },
    height: function (): number {
      return staneksGift.height();
    },
    charge: function (arootX: unknown, arootY: unknown): Promise<void> {
      const rootX = helper.number("stanek.charge", "rootX", arootX);
      const rootY = helper.number("stanek.charge", "rootY", arootY);

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
    canPlace: function (arootX: unknown, arootY: unknown, arotation: unknown, afragmentId: unknown): boolean {
      const rootX = helper.number("stanek.canPlace", "rootX", arootX);
      const rootY = helper.number("stanek.canPlace", "rootY", arootY);
      const rotation = helper.number("stanek.canPlace", "rotation", arotation);
      const fragmentId = helper.number("stanek.canPlace", "fragmentId", afragmentId);
      helper.updateDynamicRam("canPlace", getRamCost(player, "stanek", "canPlace"));
      checkStanekAPIAccess("canPlace");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.canPlace", `Invalid fragment id: ${fragmentId}`);
      const can = staneksGift.canPlace(rootX, rootY, rotation, fragment);
      return can;
    },
    place: function (arootX: unknown, arootY: unknown, arotation: unknown, afragmentId: unknown): boolean {
      const rootX = helper.number("stanek.place", "rootX", arootX);
      const rootY = helper.number("stanek.place", "rootY", arootY);
      const rotation = helper.number("stanek.place", "rotation", arotation);
      const fragmentId = helper.number("stanek.place", "fragmentId", afragmentId);
      helper.updateDynamicRam("place", getRamCost(player, "stanek", "place"));
      checkStanekAPIAccess("place");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.place", `Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(rootX, rootY, rotation, fragment);
    },
    get: function (arootX: unknown, arootY: unknown): IActiveFragment | undefined {
      const rootX = helper.number("stanek.get", "rootX", arootX);
      const rootY = helper.number("stanek.get", "rootY", arootY);
      helper.updateDynamicRam("get", getRamCost(player, "stanek", "get"));
      checkStanekAPIAccess("get");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    remove: function (arootX: unknown, arootY: unknown): boolean {
      const rootX = helper.number("stanek.remove", "rootX", arootX);
      const rootY = helper.number("stanek.remove", "rootY", arootY);
      helper.updateDynamicRam("remove", getRamCost(player, "stanek", "remove"));
      checkStanekAPIAccess("remove");
      return staneksGift.delete(rootX, rootY);
    },
  };
}
