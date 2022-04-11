import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { netscriptDelay } from "../NetscriptEvaluator";

import { staneksGift } from "../CotMG/Helper";
import { Fragments, FragmentById } from "../CotMG/Fragment";

import {
  Fragment as IFragment,
  ActiveFragment as IActiveFragment,
  Stanek as IStanek,
} from "../ScriptEditor/NetscriptDefinitions";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { NetscriptContext, InternalAPI } from "src/Netscript/APIWrapper";

export function NetscriptStanek(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): InternalAPI<IStanek> {
  function checkStanekAPIAccess(func: string): void {
    if (!player.hasAugmentation(AugmentationNames.StaneksGift1, true)) {
      helper.makeRuntimeErrorMsg(func, "Requires Stanek's Gift installed.");
    }
  }

  return {
    giftWidth: (_ctx: NetscriptContext) =>
      function (): number {
        checkStanekAPIAccess("giftWidth");
        return staneksGift.width();
      },
    giftHeight: (_ctx: NetscriptContext) =>
      function (): number {
        checkStanekAPIAccess("giftHeight");
        return staneksGift.height();
      },
    chargeFragment: (_ctx: NetscriptContext) =>
      function (_rootX: unknown, _rootY: unknown): Promise<void> {
        const rootX = _ctx.helper.number("rootX", _rootX);
        const rootY = _ctx.helper.number("rootY", _rootY);
        checkStanekAPIAccess("chargeFragment");
        const fragment = staneksGift.findFragment(rootX, rootY);
        if (!fragment) throw _ctx.makeRuntimeErrorMsg(`No fragment with root (${rootX}, ${rootY}).`);
        const time = staneksGift.inBonus() ? 200 : 1000;
        return netscriptDelay(time, workerScript).then(function () {
          const charge = staneksGift.charge(player, fragment, workerScript.scriptRef.threads);
          _ctx.log(() => `Charged fragment for ${charge} charge.`);
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
  };
}
