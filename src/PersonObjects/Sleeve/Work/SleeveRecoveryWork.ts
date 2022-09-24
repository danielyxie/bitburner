import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { Work, WorkType } from "./Work";

export const isSleeveRecoveryWork = (w: Work | null): w is SleeveRecoveryWork =>
  w !== null && w.type === WorkType.RECOVERY;

export class SleeveRecoveryWork extends Work {
  constructor() {
    super(WorkType.RECOVERY);
  }

  process(sleeve: Sleeve, cycles: number): number {
    sleeve.shock = Math.min(100, sleeve.shock + 0.0002 * cycles);
    if (sleeve.shock >= 100) sleeve.stopWork();
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
    return Generic_toJSON("SleeveRecoveryWork", this);
  }

  /**
   * Initializes a RecoveryWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveRecoveryWork {
    return Generic_fromJSON(SleeveRecoveryWork, value.data);
  }
}

Reviver.constructors.SleeveRecoveryWork = SleeveRecoveryWork;
