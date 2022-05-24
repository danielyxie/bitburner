import { Generic_fromJSON, Generic_toJSON, Reviver } from "../../utils/JSONReviver";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../../Constants";
import { Program } from "../../Programs/Program";
import { IPlayer } from "../IPlayer";
import { Work, WorkType } from "./Work";

export class CreateProgramWork extends Work {
  programName = "";
  reqLevel = 0;
  unitNeeded = 0;
  unitWorked = 0;

  constructor(params?: { p: IPlayer; program: Program }) {
    super(WorkType.CreateProgram);
    if (!params) return;

    const p = params.p;
    const program = params.program;
    const create = program.create;
    if (!create) throw new Error("Attempting to create program that cannot be created");
    this.programName = program.name;
    this.reqLevel = create.level;
    this.unitNeeded = create.time;

    //Check for incomplete program
    for (let i = 0; i < p.getHomeComputer().programs.length; ++i) {
      const programFile = p.getHomeComputer().programs[i];
      if (programFile.startsWith(program.name) && programFile.endsWith("%-INC")) {
        const res = programFile.split("-");
        if (res.length != 3) {
          break;
        }
        const percComplete = Number(res[1].slice(0, -1));
        if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {
          break;
        }
        this.unitWorked = (percComplete / 100) * this.unitNeeded;
        p.getHomeComputer().programs.splice(i, 1);
      }
    }
  }

  work(p: IPlayer, cycles: number): boolean {
    super.work(p, cycles);
    let focusBonus = 1;
    if (!p.hasAugmentation(AugmentationNames["NeuroreceptorManager"])) {
      focusBonus = p.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }
    //Higher hacking skill will allow you to create programs faster
    const reqLvl = this.reqLevel;
    let skillMult = (p.hacking / reqLvl) * p.getIntelligenceBonus(3); //This should always be greater than 1;
    skillMult = 1 + (skillMult - 1) / 5; //The divider constant can be adjusted as necessary
    skillMult *= focusBonus;
    //Skill multiplier directly applied to "time worked"
    this.unitWorked += CONSTANTS._idleSpeed * cycles;
    this.unitNeeded += CONSTANTS._idleSpeed * cycles * skillMult;

    if (this.unitWorked >= this.unitNeeded) {
      return true;
    }
    return false;
  }

  finish(p: IPlayer, cancelled: boolean): string {
    if (!cancelled) {
      //Complete case
      p.gainIntelligenceExp((CONSTANTS.IntelligenceProgramBaseExpGain * this.unitWorked) / 1000);

      if (!p.getHomeComputer().programs.includes(this.programName)) {
        p.getHomeComputer().programs.push(this.programName);
      }
    } else if (!p.getHomeComputer().programs.includes(this.programName)) {
      //Incomplete case
      const perc = (Math.floor((this.unitWorked / this.unitNeeded) * 10000) / 100).toString();
      const incompleteName = this.programName + "-" + perc + "%-INC";
      p.getHomeComputer().programs.push(incompleteName);
    }

    return "You've finished creating " + this.programName + "! The new program can be found on your home computer.";
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): any {
    return Generic_toJSON("CreateProgramWork", this);
  }

  /**
   * Initiatizes a CreateProgramWork object from a JSON save state.
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static fromJSON(value: any): CreateProgramWork {
    return Generic_fromJSON(CreateProgramWork, value.data);
  }
}

Reviver.constructors.CreateProgramWork = CreateProgramWork;
