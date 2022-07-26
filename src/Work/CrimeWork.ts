import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { Crime } from "../Crime/Crime";
import { CONSTANTS } from "../Constants";
import { determineCrimeSuccess } from "../Crime/CrimeHelpers";
import { Crimes } from "../Crime/Crimes";
import { IPlayer } from "../PersonObjects/IPlayer";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { CrimeType } from "../utils/WorkType";
import { Work, WorkType } from "./Work";
import { newWorkStats, scaleWorkStats, WorkStats } from "./WorkStats";

interface CrimeWorkParams {
  crimeType: CrimeType;
  singularity: boolean;
}

export const isCrimeWork = (w: Work | null): w is CrimeWork => w !== null && w.type === WorkType.CRIME;

export class CrimeWork extends Work {
  crimeType: CrimeType;
  unitCompleted: number;

  constructor(params?: CrimeWorkParams) {
    super(WorkType.CRIME, params?.singularity ?? true);
    this.crimeType = params?.crimeType ?? CrimeType.Shoplift;
    this.unitCompleted = 0;
  }

  getCrime(): Crime {
    const crime = Object.values(Crimes).find((c) => c.type === this.crimeType);
    if (!crime) throw new Error("CrimeWork object constructed with invalid crime type");
    return crime;
  }

  process(player: IPlayer, cycles = 1): boolean {
    this.cyclesWorked += cycles;
    const time = Object.values(Crimes).find((c) => c.type === this.crimeType)?.time ?? 0;
    this.unitCompleted += CONSTANTS._idleSpeed * cycles;
    while (this.unitCompleted >= time) {
      this.commit(player);
      this.unitCompleted -= time;
    }
    return false;
  }

  earnings(): WorkStats {
    const crime = this.getCrime();
    return newWorkStats({
      money: crime.money,
      hackExp: crime.hacking_exp * 2,
      strExp: crime.strength_exp * 2,
      defExp: crime.defense_exp * 2,
      dexExp: crime.dexterity_exp * 2,
      agiExp: crime.agility_exp * 2,
      chaExp: crime.charisma_exp * 2,
      intExp: crime.intelligence_exp * 2,
    });
  }

  commit(player: IPlayer): void {
    const crime = this.getCrime();
    if (crime == null) {
      dialogBoxCreate(
        `ERR: Unrecognized crime type (${this.crimeType}). This is probably a bug please contact the developer`,
      );
      return;
    }
    const focusPenalty = player.focusPenalty();
    // exp times 2 because were trying to maintain the same numbers as before the conversion
    // Technically the definition of Crimes should have the success numbers and failure should divide by 4
    let gains = scaleWorkStats(this.earnings(), focusPenalty);
    let karma = crime.karma;
    const success = determineCrimeSuccess(player, crime.type);
    if (success) {
      player.gainMoney(gains.money, "crime");
      player.numPeopleKilled += crime.kills;
      player.gainIntelligenceExp(gains.intExp);
    } else {
      gains = scaleWorkStats(gains, 0.25);
      karma /= 4;
    }
    player.gainHackingExp(gains.hackExp);
    player.gainStrengthExp(gains.strExp);
    player.gainDefenseExp(gains.defExp);
    player.gainDexterityExp(gains.dexExp);
    player.gainAgilityExp(gains.agiExp);
    player.gainCharismaExp(gains.chaExp);
    player.karma -= karma * focusPenalty;
  }

  finish(player: IPlayer, cancelled: boolean): void {
    if (cancelled) return;
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("CrimeWork", this);
  }

  /**
   * Initiatizes a CrimeWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): CrimeWork {
    return Generic_fromJSON(CrimeWork, value.data);
  }
}

Reviver.constructors.CrimeWork = CrimeWork;
