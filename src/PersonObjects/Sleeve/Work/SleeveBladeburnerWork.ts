import { Player } from "@player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { applySleeveGains, Work, WorkType } from "./Work";
import { CONSTANTS } from "../../../Constants";
import { GeneralActions } from "../../../Bladeburner/data/GeneralActions";
import { scaleWorkStats } from "../../../Work/WorkStats";

interface SleeveBladeburnerWorkParams {
  type: string;
  name: string;
}

export const isSleeveBladeburnerWork = (w: Work | null): w is SleeveBladeburnerWork =>
  w !== null && w.type === WorkType.BLADEBURNER;

export class SleeveBladeburnerWork extends Work {
  cyclesWorked = 0;
  actionType: string;
  actionName: string;

  constructor(params?: SleeveBladeburnerWorkParams) {
    super(WorkType.BLADEBURNER);
    this.actionType = params?.type ?? "General";
    this.actionName = params?.name ?? "Field analysis";
  }

  cyclesNeeded(sleeve: Sleeve): number {
    const ret = Player.bladeburner?.getActionTimeNetscriptFn(sleeve, this.actionType, this.actionName);
    if (!ret || typeof ret === "string") throw new Error(`Error querying ${this.actionName} time`);
    return ret / CONSTANTS._idleSpeed;
  }

  process(sleeve: Sleeve, cycles: number) {
    if (!Player.bladeburner) throw new Error("sleeve doing blade work without being a member");
    this.cyclesWorked += cycles;
    const actionIdent = Player.bladeburner.getActionIdFromTypeAndName(this.actionType, this.actionName);
    if (!actionIdent) throw new Error(`Error getting ${this.actionName} action`);
    if (this.actionType === "Contracts") {
      const action = Player.bladeburner.getActionObject(actionIdent);
      if (!action) throw new Error(`Error getting ${this.actionName} action object`);
      if (action.count <= 0) return sleeve.stopWork();
    }

    while (this.cyclesWorked > this.cyclesNeeded(sleeve)) {
      if (this.actionType === "Contracts") {
        const action = Player.bladeburner.getActionObject(actionIdent);
        if (!action) throw new Error(`Error getting ${this.actionName} action object`);
        if (action.count <= 0) return sleeve.stopWork();
      }
      const retValue = Player.bladeburner.completeAction(sleeve, actionIdent, false);
      if (this.actionType === "General") {
        const exp = GeneralActions[this.actionName]?.exp;
        if (!exp) throw new Error(`Somehow there was no exp for action ${this.actionType} ${this.actionName}`);
        applySleeveGains(sleeve, scaleWorkStats(exp, sleeve.shockBonus(), false));
      }

      if (this.actionType === "Contracts") {
        applySleeveGains(sleeve, scaleWorkStats(retValue, sleeve.shockBonus(), false));
      }
      this.cyclesWorked -= this.cyclesNeeded(sleeve);
    }
  }

  APICopy(): Record<string, unknown> {
    return {
      actionType: this.actionType,
      actionName: this.actionName,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveBladeburnerWork", this);
  }

  /** Initializes a BladeburnerWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveBladeburnerWork {
    return Generic_fromJSON(SleeveBladeburnerWork, value.data);
  }
}

Reviver.constructors.SleeveBladeburnerWork = SleeveBladeburnerWork;
