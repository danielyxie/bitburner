import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { netscriptDelay } from "../NetscriptEvaluator";
import { getRamCost } from "../Netscript/RamCostGenerator";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";

export interface INetscriptStanek {
  width(): number;
  height(): number;
  charge(rootX: number, rootY: number): any;
  fragmentDefinitions(): any;
  placedFragments(): any;
  clear(): void;
  canPlace(worldX: number, worldY: number, rotation: number, fragmentId: number): boolean;
  place(worldX: number, worldY: number, rotation: number, fragmentId: number): boolean;
  findFragment(rootX: any, rootY: any): any;
  fragmentAt(worldX: number, worldY: number): any;
  deleteAt(worldX: number, worldY: number): boolean;
}

export function NetscriptStanek(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptStanek {
  return {
    width: function (): number {
      return staneksGift.width();
    },
    height: function (): number {
      return staneksGift.height();
    },
    charge: function (rootX: any, rootY: any): any {
      helper.updateDynamicRam("charge", getRamCost("stanek", "charge"));
      //checkStanekAPIAccess("charge");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.charge", `No fragment with root (${rootX}, ${rootY}).`);
      const time = staneksGift.inBonus() ? 200 : 1000;
      return netscriptDelay(time, workerScript).then(function () {
        if (workerScript.env.stopFlag) {
          return Promise.reject(workerScript);
        }
        const ram = workerScript.scriptRef.ramUsage * workerScript.scriptRef.threads;
        const charge = staneksGift.charge(rootX, rootY, ram);
        workerScript.log("stanek.charge", `Charged fragment for ${charge} charge.`);
        return Promise.resolve(charge);
      });
    },
    fragmentDefinitions: function () {
      helper.updateDynamicRam("fragmentDefinitions", getRamCost("stanek", "fragmentDefinitions"));
      //checkStanekAPIAccess("fragmentDefinitions");
      workerScript.log("stanek.fragmentDefinitions", `Returned ${Fragments.length} fragments`);
      return Fragments.map((f) => f.copy());
    },
    placedFragments: function () {
      helper.updateDynamicRam("placedFragments", getRamCost("stanek", "placedFragments"));
      //checkStanekAPIAccess("placedFragments");
      workerScript.log("stanek.placedFragments", `Returned ${staneksGift.fragments.length} fragments`);
      return staneksGift.fragments.map((af) => {
        return { ...af.copy(), ...af.fragment().copy() };
      });
    },
    clear: function () {
      helper.updateDynamicRam("clear", getRamCost("stanek", "clear"));
      //checkStanekAPIAccess("clear");
      workerScript.log("stanek.clear", `Cleared Stanek's Gift.`);
      staneksGift.clear();
    },
    canPlace: function (worldX: any, worldY: any, rotation: any, fragmentId: any): any {
      helper.updateDynamicRam("canPlace", getRamCost("stanek", "canPlace"));
      //checkStanekAPIAccess("canPlace");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.canPlace", `Invalid fragment id: ${fragmentId}`);
      const can = staneksGift.canPlace(worldX, worldY, rotation, fragment);
      return can;
    },
    place: function (worldX: any, worldY: any, rotation: any, fragmentId: any): any {
      helper.updateDynamicRam("place", getRamCost("stanek", "place"));
      //checkStanekAPIAccess("place");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.place", `Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(worldX, worldY, rotation, fragment);
    },
    findFragment: function (rootX: any, rootY: any): any {
      helper.updateDynamicRam("findFragment", getRamCost("stanek", "findFragment"));
      //checkStanekAPIAccess("fragmentAt");
      const fragment = staneksGift.findFragment(rootX, rootY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    fragmentAt: function (worldX: any, worldY: any): any {
      helper.updateDynamicRam("fragmentAt", getRamCost("stanek", "fragmentAt"));
      //checkStanekAPIAccess("fragmentAt");
      const fragment = staneksGift.fragmentAt(worldX, worldY);
      if (fragment !== undefined) return fragment.copy();
      return undefined;
    },
    deleteAt: function (worldX: any, worldY: any): any {
      helper.updateDynamicRam("deleteAt", getRamCost("stanek", "deleteAt"));
      //checkStanekAPIAccess("deleteAt");
      return staneksGift.deleteAt(worldX, worldY);
    },
  };
}
