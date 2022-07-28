import { IPlayer } from "../../IPlayer";
import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { Sleeve } from "../Sleeve";
import { Work, WorkType } from "./Work";
import { CrimeType } from "../../../utils/WorkType";
import { Crimes } from "../../../Crime/Crimes";
import { Crime } from "../../../Crime/Crime";
import { applyWorkStats, newWorkStats, scaleWorkStats, WorkStats } from "../../../Work/WorkStats";
import { CONSTANTS } from "../../../Constants";

export const isSleeveCrimeWork = (w: Work | null): w is SleeveCrimeWork => w !== null && w.type === WorkType.CRIME;

export class SleeveCrimeWork extends Work {
  crimeType: CrimeType;
  cyclesWorked = 0;
  constructor(crimeType?: CrimeType) {
    super(WorkType.CRIME);
    this.crimeType = crimeType ?? CrimeType.SHOPLIFT;
  }

  getCrime(): Crime {
    const crime = Object.values(Crimes).find((crime) => crime.type === this.crimeType);
    if (!crime) throw new Error("crime should not be undefined");
    return crime;
  }

  getExp(): WorkStats {
    const crime = this.getCrime();
    return newWorkStats({
      money: crime.money,
      hackExp: crime.hacking_exp,
      strExp: crime.strength_exp,
      defExp: crime.defense_exp,
      dexExp: crime.dexterity_exp,
      agiExp: crime.agility_exp,
      chaExp: crime.charisma_exp,
      intExp: crime.intelligence_exp,
    });
  }

  process(player: IPlayer, sleeve: Sleeve, cycles: number): number {
    this.cyclesWorked += cycles;

    const crime = this.getCrime();
    const gains = this.getExp();
    if (this.cyclesWorked >= crime.time / CONSTANTS._idleSpeed) {
      if (Math.random() < crime.successRate(sleeve)) {
        applyWorkStats(player, sleeve, gains, 1, "sleeves");

        player.karma -= crime.karma * sleeve.syncBonus();
      } else {
        applyWorkStats(player, sleeve, scaleWorkStats(gains, 0.25), 1, "sleeves");
      }
      this.cyclesWorked -= crime.time / CONSTANTS._idleSpeed;
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
    return Generic_toJSON("SleeveCrimeWork", this);
  }

  /**
   * Initiatizes a RecoveryWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): SleeveCrimeWork {
    return Generic_fromJSON(SleeveCrimeWork, value.data);
  }
}

Reviver.constructors.SleeveCrimeWork = SleeveCrimeWork;
