import { Player } from "@player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Work, WorkType } from "./Work";

export const isSleeveSupportWork = (w: Work | null): w is SleeveSupportWork =>
  w !== null && w.type === WorkType.SUPPORT;

export class SleeveSupportWork extends Work {
  constructor() {
    super(WorkType.SUPPORT);
    Player.bladeburner?.sleeveSupport(true);
  }

  process() {
    return;
  }

  finish(): void {
    Player.bladeburner?.sleeveSupport(false);
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveSupportWork", this);
  }

  /** Initializes a BladeburnerWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveSupportWork {
    return Generic_fromJSON(SleeveSupportWork, value.data);
  }
}

Reviver.constructors.SleeveSupportWork = SleeveSupportWork;
