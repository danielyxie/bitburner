import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { Crime } from "../Crime/Crime";
import { CONSTANTS } from "../Constants";
import { determineCrimeSuccess, findCrime } from "../Crime/CrimeHelpers";
import { Crimes } from "../Crime/Crimes";
import { Player } from "@player";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { CrimeType } from "../utils/enums";
import { Work, WorkType } from "./Work";
import { scaleWorkStats, WorkStats } from "./WorkStats";
import { calculateCrimeWorkStats } from "./Formulas";
import { checkEnum } from "../utils/helpers/enum";

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
    this.crimeType = params?.crimeType ?? CrimeType.shoplift;
    this.unitCompleted = 0;
  }

  getCrime(): Crime {
    if (!checkEnum(CrimeType, this.crimeType)) {
      throw new Error("CrimeWork object constructed with invalid crime type");
    }
    return Crimes[this.crimeType];
  }

  process(cycles = 1): boolean {
    this.cyclesWorked += cycles;
    const time = Object.values(Crimes).find((c) => c.type === this.crimeType)?.time ?? 0;
    this.unitCompleted += CONSTANTS._idleSpeed * cycles;
    while (this.unitCompleted >= time) {
      this.commit();
      this.unitCompleted -= time;
    }
    return false;
  }

  earnings(): WorkStats {
    return calculateCrimeWorkStats(Player, this.getCrime());
  }

  commit(): void {
    const crime = this.getCrime();
    if (crime == null) {
      dialogBoxCreate(
        `ERR: Unrecognized crime type (${this.crimeType}). This is probably a bug please contact the developer`,
      );
      return;
    }
    const focusPenalty = Player.focusPenalty();
    // exp times 2 because were trying to maintain the same numbers as before the conversion
    // Technically the definition of Crimes should have the success numbers and failure should divide by 4
    let gains = scaleWorkStats(this.earnings(), focusPenalty, false);
    let karma = crime.karma;
    const success = determineCrimeSuccess(crime.type);
    if (success) {
      Player.gainMoney(gains.money, "crime");
      Player.numPeopleKilled += crime.kills;
      Player.gainIntelligenceExp(gains.intExp);
    } else {
      gains = scaleWorkStats(gains, 0.25);
      karma /= 4;
    }
    Player.gainHackingExp(gains.hackExp);
    Player.gainStrengthExp(gains.strExp);
    Player.gainDefenseExp(gains.defExp);
    Player.gainDexterityExp(gains.dexExp);
    Player.gainAgilityExp(gains.agiExp);
    Player.gainCharismaExp(gains.chaExp);
    Player.karma -= karma * focusPenalty;
  }

  finish(): void {
    /** nothing to do */
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      cyclesWorked: this.cyclesWorked,
      crimeType: checkEnum(CrimeType, this.crimeType) ? this.crimeType : CrimeType.shoplift,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("CrimeWork", this);
  }

  /** Initializes a CrimeWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): CrimeWork {
    const crimeWork = Generic_fromJSON(CrimeWork, value.data);
    crimeWork.crimeType = findCrime(crimeWork.crimeType)?.type ?? CrimeType.shoplift;
    return crimeWork;
  }
}

Reviver.constructors.CrimeWork = CrimeWork;
