import { Generic_fromJSON, Generic_toJSON, IReviverValue, Reviver } from "../../../utils/JSONReviver";
import { applySleeveGains, Work, WorkType } from "./Work";
import { ClassType } from "../../../Work/ClassWork";
import { LocationName } from "../../../utils/enums";
import { calculateClassEarnings } from "../../../Work/Formulas";
import { Sleeve } from "../Sleeve";
import { scaleWorkStats, WorkStats } from "../../../Work/WorkStats";
import { GymType, UniversityClassType } from "../../../utils/enums";
import { checkEnum } from "../../../utils/helpers/enum";

export const isSleeveClassWork = (w: Work | null): w is SleeveClassWork => w !== null && w.type === WorkType.CLASS;

interface ClassWorkParams {
  classType: ClassType;
  location: LocationName;
}

export class SleeveClassWork extends Work {
  classType: ClassType;
  location: LocationName;

  constructor(params?: ClassWorkParams) {
    super(WorkType.CLASS);
    this.classType = params?.classType ?? UniversityClassType.computerScience;
    this.location = params?.location ?? LocationName.Sector12RothmanUniversity;
  }

  calculateRates(sleeve: Sleeve): WorkStats {
    return scaleWorkStats(calculateClassEarnings(sleeve, this.classType, this.location), sleeve.shockBonus(), false);
  }

  isGym(): boolean {
    return checkEnum(GymType, this.classType);
  }

  process(sleeve: Sleeve, cycles: number) {
    const rate = this.calculateRates(sleeve);
    applySleeveGains(sleeve, rate, cycles);
  }

  APICopy() {
    return {
      type: WorkType.CLASS as "CLASS",
      classType: this.classType,
      location: this.location,
    };
  }
  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("SleeveClassWork", this);
  }

  /** Initializes a ClassWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): SleeveClassWork {
    return Generic_fromJSON(SleeveClassWork, value.data);
  }
}

Reviver.constructors.SleeveClassWork = SleeveClassWork;
