import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { netscriptDelay } from "../NetscriptEvaluator";
import { getRamCost } from "../Netscript/RamCostGenerator";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";

export interface INetscriptStanek {
  charge(worldX: number, worldY: number): any;
  fragmentDefinitions(): any;
  placedFragments(): any;
  clear(): void;
  canPlace(worldX: number, worldY: number, fragmentId: number): boolean;
  place(worldX: number, worldY: number, fragmentId: number): boolean;
  fragmentAt(worldX: number, worldY: number): any;
  deleteAt(worldX: number, worldY: number): boolean;
}

export function NetscriptStanek(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): INetscriptStanek {
  return {
    charge: function (worldX: any, worldY: any): any {
      helper.updateDynamicRam("charge", getRamCost("stanek", "charge"));
      //checkStanekAPIAccess("charge");
      const fragment = staneksGift.fragmentAt(worldX, worldY);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.charge", `No fragment at (${worldX}, ${worldY})`);
      const time = staneksGift.inBonus() ? 200 : 1000;
      return netscriptDelay(time, workerScript).then(function () {
        if (workerScript.env.stopFlag) {
          return Promise.reject(workerScript);
        }
        const ram = workerScript.scriptRef.ramUsage * workerScript.scriptRef.threads;
        return Promise.resolve(staneksGift.charge(worldX, worldY, ram));
      });
    },
    fragmentDefinitions: function () {
      helper.updateDynamicRam("fragmentDefinitions", getRamCost("stanek", "fragmentDefinitions"));
      //checkStanekAPIAccess("fragmentDefinitions");
      return Fragments.map((f) => f.copy());
    },
    placedFragments: function () {
      helper.updateDynamicRam("placedFragments", getRamCost("stanek", "placedFragments"));
      //checkStanekAPIAccess("placedFragments");
      return staneksGift.fragments.map((af) => {
        return { ...af.copy(), ...af.fragment().copy() };
      });
    },
    clear: function () {
      helper.updateDynamicRam("clear", getRamCost("stanek", "clear"));
      //checkStanekAPIAccess("clear");
      staneksGift.clear();
    },
    canPlace: function (worldX: any, worldY: any, fragmentId: any): any {
      helper.updateDynamicRam("canPlace", getRamCost("stanek", "canPlace"));
      //checkStanekAPIAccess("canPlace");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.canPlace", `Invalid fragment id: ${fragmentId}`);
      return staneksGift.canPlace(worldX, worldY, fragment);
    },
    place: function (worldX: any, worldY: any, fragmentId: any): any {
      helper.updateDynamicRam("place", getRamCost("stanek", "place"));
      //checkStanekAPIAccess("place");
      const fragment = FragmentById(fragmentId);
      if (!fragment) throw helper.makeRuntimeErrorMsg("stanek.place", `Invalid fragment id: ${fragmentId}`);
      return staneksGift.place(worldX, worldY, fragment);
    },
    fragmentAt: function (worldX: any, worldY: any): any {
      helper.updateDynamicRam("fragmentAt", getRamCost("stanek", "fragmentAt"));
      //checkStanekAPIAccess("fragmentAt");
      const fragment = staneksGift.fragmentAt(worldX, worldY);
      if (fragment !== null) return fragment.copy();
      return null;
    },
    deleteAt: function (worldX: any, worldY: any): any {
      helper.updateDynamicRam("deleteAt", getRamCost("stanek", "deleteAt"));
      //checkStanekAPIAccess("deleteAt");
      return staneksGift.deleteAt(worldX, worldY);
    },
  };
}
