import React from "react";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { CONSTANTS } from "../Constants";
import { LocationName } from "../Locations/data/LocationNames";
import { numeralWrapper } from "../ui/numeralFormat";
import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Money } from "../ui/React/Money";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { Player } from "../Player";
import { calculateClassEarnings as calculateClassEarningsRate } from "./formulas/Class";
import { Work, WorkType } from "./Work";
import { applyWorkStats, newWorkStats, sumWorkStats, WorkStats } from "./WorkStats";

export enum ClassType {
  StudyComputerScience = "STUDYCOMPUTERSCIENCE",
  DataStructures = "DATASTRUCTURES",
  Networks = "NETWORKS",
  Algorithms = "ALGORITHMS",

  Management = "MANAGEMENT",
  Leadership = "LEADERSHIP",

  GymStrength = "GYMSTRENGTH",
  GymDefense = "GYMDEFENSE",
  GymDexterity = "GYMDEXTERITY",
  GymAgility = "GYMAGILITY",
}

export interface Class {
  youAreCurrently: string;
  type: ClassType;
  earnings: WorkStats;
}

export const Classes: Record<ClassType, Class> = {
  [ClassType.StudyComputerScience]: {
    youAreCurrently: "studying Computer Science",
    type: ClassType.StudyComputerScience,
    earnings: newWorkStats({ hackExp: 0.5, intExp: 0.01 }),
  },
  [ClassType.DataStructures]: {
    youAreCurrently: "taking a Data Structures course",
    type: ClassType.DataStructures,
    earnings: newWorkStats({
      money: -40,
      hackExp: 1,
      intExp: 0.01,
    }),
  },
  [ClassType.Networks]: {
    youAreCurrently: "taking a Networks course",
    type: ClassType.Networks,
    earnings: newWorkStats({
      money: -80,
      hackExp: 2,
      intExp: 0.01,
    }),
  },
  [ClassType.Algorithms]: {
    youAreCurrently: "taking an Algorithms course",
    type: ClassType.Algorithms,
    earnings: newWorkStats({
      money: -320,
      hackExp: 4,
      intExp: 0.01,
    }),
  },
  [ClassType.Management]: {
    youAreCurrently: "taking a Management course",
    type: ClassType.Management,
    earnings: newWorkStats({
      money: -160,
      chaExp: 2,
      intExp: 0.01,
    }),
  },
  [ClassType.Leadership]: {
    youAreCurrently: "taking a Leadership course",
    type: ClassType.Leadership,
    earnings: newWorkStats({
      money: -320,
      chaExp: 4,
      intExp: 0.01,
    }),
  },
  [ClassType.GymStrength]: {
    youAreCurrently: "training your strength at a gym",
    type: ClassType.GymStrength,
    earnings: newWorkStats({
      money: -120,
      strExp: 1,
    }),
  },
  [ClassType.GymDefense]: {
    youAreCurrently: "training your defense at a gym",
    type: ClassType.GymDefense,
    earnings: newWorkStats({
      money: -120,
      defExp: 1,
    }),
  },
  [ClassType.GymDexterity]: {
    youAreCurrently: "training your dexterity at a gym",
    type: ClassType.GymDexterity,
    earnings: newWorkStats({
      money: -120,
      dexExp: 1,
    }),
  },
  [ClassType.GymAgility]: {
    youAreCurrently: "training your agility at a gym",
    type: ClassType.GymAgility,
    earnings: newWorkStats({
      money: -120,
      agiExp: 1,
    }),
  },
};

interface ClassWorkParams {
  classType: ClassType;
  location: LocationName;
  singularity: boolean;
}

export const isClassWork = (w: Work | null): w is ClassWork => w !== null && w.type === WorkType.CLASS;

export class ClassWork extends Work {
  classType: ClassType;
  location: LocationName;
  earnings = newWorkStats();

  constructor(params?: ClassWorkParams) {
    super(WorkType.CLASS, params?.singularity ?? true);
    this.classType = params?.classType ?? ClassType.StudyComputerScience;
    this.location = params?.location ?? LocationName.Sector12RothmanUniversity;
  }

  isGym(): boolean {
    return [ClassType.GymAgility, ClassType.GymDefense, ClassType.GymDexterity, ClassType.GymStrength].includes(
      this.classType,
    );
  }

  getClass(): Class {
    return Classes[this.classType];
  }

  calculateRates(): WorkStats {
    return calculateClassEarningsRate(Player, this.classType, this.location);
  }

  process(cycles: number): boolean {
    this.cyclesWorked += cycles;
    const rate = this.calculateRates();
    const earnings = applyWorkStats(Player, rate, cycles, "class");
    this.earnings = sumWorkStats(this.earnings, earnings);
    return false;
  }

  finish(): void {
    if (!this.singularity) {
      dialogBoxCreate(
        <>
          After {this.getClass().youAreCurrently} for{" "}
          {convertTimeMsToTimeElapsedString(this.cyclesWorked * CONSTANTS._idleSpeed)}, <br />
          you spent a total of <Money money={-this.earnings.money} />. <br />
          <br />
          You earned a total of: <br />
          {numeralWrapper.formatExp(this.earnings.hackExp)} hacking exp <br />
          {numeralWrapper.formatExp(this.earnings.strExp)} strength exp <br />
          {numeralWrapper.formatExp(this.earnings.defExp)} defense exp <br />
          {numeralWrapper.formatExp(this.earnings.dexExp)} dexterity exp <br />
          {numeralWrapper.formatExp(this.earnings.agiExp)} agility exp <br />
          {numeralWrapper.formatExp(this.earnings.chaExp)} charisma exp
          <br />
        </>,
      );
    }
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      cyclesWorked: this.cyclesWorked,
      classType: this.classType,
      location: this.location,
    };
  }

  /** Serialize the current object to a JSON save state. */
  toJSON(): IReviverValue {
    return Generic_toJSON("ClassWork", this);
  }

  /** Initiatizes a ClassWork object from a JSON save state. */
  static fromJSON(value: IReviverValue): ClassWork {
    return Generic_fromJSON(ClassWork, value.data);
  }
}

Reviver.constructors.ClassWork = ClassWork;
