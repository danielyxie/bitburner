import { IPlayer } from "../../IPlayer";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { Work, WorkType } from "./Work";
import { CONSTANTS } from "../../../Constants";

export const isSleeveBladeburnerGeneralWork = (w: Work | null): w is SleeveBladeburnerGeneralWork =>
  w !== null && w.type === WorkType.BLADEBURNER_GENERAL;

export class SleeveBladeburnerGeneralWork extends Work {
  cyclesWorked = 0;
  action: string;

  constructor(action?: string) {
    super(WorkType.BLADEBURNER_GENERAL);
    this.action = action ?? "Field analysis";
  }

  cyclesNeeded(player: IPlayer, sleeve: Sleeve): number {
    const ret = player.bladeburner?.getActionTimeNetscriptFn(sleeve, "General", this.action);
    if (!ret || typeof ret === "string") throw new Error(`Error querying ${this.action} time`);
    return ret / CONSTANTS._idleSpeed;
  }

  process(player: IPlayer, sleeve: Sleeve, cycles: number): number {
    if (!player.bladeburner) throw new Error("sleeve doing blade work without being a member");
    this.cyclesWorked += cycles;
    while (this.cyclesWorked > this.cyclesNeeded(player, sleeve)) {
      const actionIdent = player.bladeburner.getActionIdFromTypeAndName("General", this.action);
      if (!actionIdent) throw new Error(`Error getting ${this.action} action`);
      player.bladeburner.completeAction(player, sleeve, actionIdent, false);
      this.cyclesWorked -= this.cyclesNeeded(player, sleeve);
    }
    return 0;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      action: this.action,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveBladeburnerGeneralWork", this);
  }

  /**
   * Initiatizes a BladeburnerWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveBladeburnerGeneralWork {
    return Generic_fromJSON(SleeveBladeburnerGeneralWork, value.data);
  }
}

Reviver.constructors.SleeveBladeburnerGeneralWork = SleeveBladeburnerGeneralWork;
