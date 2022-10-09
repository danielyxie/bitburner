import { Player } from "@player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { Work, WorkType } from "./Work";
import { CONSTANTS } from "../../../Constants";

const infiltrateCycles = 60000 / CONSTANTS._idleSpeed;

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

  process(_sleeve: Sleeve, cycles: number): number {
    if (!Player.bladeburner) throw new Error("sleeve doing blade work without being a member");
    this.cyclesWorked += cycles;
    if (this.cyclesWorked > this.cyclesNeeded()) {
      this.cyclesWorked -= this.cyclesNeeded();
      Player.bladeburner.infiltrateSynthoidCommunities();
    }
    return 0;
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveInfiltrateWork", this);
  }

  /** Initializes a BladeburnerWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveInfiltrateWork {
    return Generic_fromJSON(SleeveInfiltrateWork, value.data);
  }
}

Reviver.constructors.SleeveInfiltrateWork = SleeveInfiltrateWork;
