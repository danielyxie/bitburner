import { IPlayer } from "../../IPlayer";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { Work, WorkType } from "./Work";
import { CONSTANTS } from "../../../Constants";

const infiltrateCycles = 600000 / CONSTANTS._idleSpeed;

export const isSleeveInfiltrateWork = (w: Work | null): w is SleeveInfiltrateWork =>
  w !== null && w.type === WorkType.INFILTRATE;

export class SleeveInfiltrateWork extends Work {
  cyclesWorked = 0;

  constructor() {
    super(WorkType.INFILTRATE);
  }

  cyclesNeeded(): number {
    return infiltrateCycles;
  }

  process(player: IPlayer, sleeve: Sleeve, cycles: number): number {
    if (!player.bladeburner) throw new Error("sleeve doing blade work without being a member");
    this.cyclesWorked += cycles;
    if (this.cyclesWorked > this.cyclesNeeded()) {
      this.cyclesWorked -= this.cyclesNeeded();
      player.bladeburner.infiltrateSynthoidCommunities(player);
    }
    return 0;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveInfiltrateWork", this);
  }

  /**
   * Initiatizes a BladeburnerWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveInfiltrateWork {
    return Generic_fromJSON(SleeveInfiltrateWork, value.data);
  }
}

Reviver.constructors.SleeveInfiltrateWork = SleeveInfiltrateWork;
