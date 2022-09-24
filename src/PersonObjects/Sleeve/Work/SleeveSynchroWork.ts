import { Player } from "../../../Player";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { Work, WorkType } from "./Work";

export const isSleeveSynchroWork = (w: Work | null): w is SleeveSynchroWork =>
  w !== null && w.type === WorkType.SYNCHRO;

export class SleeveSynchroWork extends Work {
  constructor() {
    super(WorkType.SYNCHRO);
  }

  process(sleeve: Sleeve, cycles: number): number {
    sleeve.sync = Math.min(100, sleeve.sync + Player.getIntelligenceBonus(0.5) * 0.0002 * cycles);
    if (sleeve.sync >= 100) sleeve.stopWork();
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
    return Generic_toJSON("SleeveSynchroWork", this);
  }

  /**
   * Initializes a SynchroWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveSynchroWork {
    return Generic_fromJSON(SleeveSynchroWork, value.data);
  }
}

Reviver.constructors.SleeveSynchroWork = SleeveSynchroWork;
