import { dialogBoxCreate } from "../ui/React/DialogBox";
import { Reviver, Generic_toJSON, Generic_fromJSON, IReviverValue } from "../utils/JSONReviver";
import { AugmentationNames } from "../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../Constants";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Programs } from "../Programs/Programs";
import { Work, WorkType } from "./Work";
import { Program } from "../Programs/Program";

export const isCreateProgramWork = (w: Work | null): w is CreateProgramWork =>
  w !== null && w.type === WorkType.CREATE_PROGRAM;

interface CreateProgramWorkParams {
  programName: string;
  singularity: boolean;
  player: IPlayer;
}

export class CreateProgramWork extends Work {
  programName: string;
  // amount of effective work completed on the program (time boosted by skills).
  unitCompleted: number;

  constructor(params?: CreateProgramWorkParams) {
    super(WorkType.CREATE_PROGRAM, params?.singularity ?? true);
    this.unitCompleted = 0;
    this.programName = params?.programName ?? "";

    if (params?.player) {
      const player = params.player;
      for (let i = 0; i < player.getHomeComputer().programs.length; ++i) {
        const programFile = player.getHomeComputer().programs[i];
        if (programFile.startsWith(this.programName) && programFile.endsWith("%-INC")) {
          const res = programFile.split("-");
          if (res.length != 3) {
            break;
          }
          const percComplete = Number(res[1].slice(0, -1));
          if (isNaN(percComplete) || percComplete < 0 || percComplete >= 100) {
            break;
          }
          this.unitCompleted = (percComplete / 100) * this.unitNeeded();
          player.getHomeComputer().programs.splice(i, 1);
        }
      }
    }
  }

  unitNeeded(): number {
    return this.getProgram().create?.time ?? 0;
  }

  getProgram(): Program {
    const p = Object.values(Programs).find((p) => p.name.toLowerCase() === this.programName.toLowerCase());
    if (!p) throw new Error("Create program work started with invalid program " + this.programName);
    return p;
  }

  process(player: IPlayer, cycles: number): boolean {
    let focusBonus = 1;
    if (!player.hasAugmentation(AugmentationNames.NeuroreceptorManager, true)) {
      focusBonus = player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }
    //Higher hacking skill will allow you to create programs faster
    const reqLvl = this.getProgram().create?.level ?? 0;
    let skillMult = (player.skills.hacking / reqLvl) * player.getIntelligenceBonus(3); //This should always be greater than 1;
    skillMult = 1 + (skillMult - 1) / 5; //The divider constant can be adjusted as necessary
    skillMult *= focusBonus;
    //Skill multiplier directly applied to "time worked"
    this.cyclesWorked += cycles;
    this.unitCompleted += CONSTANTS._idleSpeed * cycles * skillMult;

    if (this.unitCompleted >= this.unitNeeded()) {
      return true;
    }
    return false;
  }
  finish(player: IPlayer, cancelled: boolean): void {
    const programName = this.programName;
    if (!cancelled) {
      //Complete case
      player.gainIntelligenceExp(
        (CONSTANTS.IntelligenceProgramBaseExpGain * this.cyclesWorked * CONSTANTS._idleSpeed) / 1000,
      );
      if (!this.singularity) {
        const lines = [
          `You've finished creating ${programName}!`,
          "The new program can be found on your home computer.",
        ];
        dialogBoxCreate(lines.join("<br>"));
      }

      if (!player.getHomeComputer().programs.includes(programName)) {
        player.getHomeComputer().programs.push(programName);
      }
    } else if (!player.getHomeComputer().programs.includes(programName)) {
      //Incomplete case
      const perc = ((100 * this.unitCompleted) / this.unitNeeded()).toFixed(2);
      const incompleteName = programName + "-" + perc + "%-INC";
      player.getHomeComputer().programs.push(incompleteName);
    }
  }

  APICopy(): Record<string, unknown> {
    return {
      type: this.type,
      cyclesWorked: this.cyclesWorked,
      programName: this.programName,
    };
  }

  /**
   * Serialize the current object to a JSON save state.
   */
  toJSON(): IReviverValue {
    return Generic_toJSON("CreateProgramWork", this);
  }

  /**
   * Initiatizes a CreateProgramWork object from a JSON save state.
   */
  static fromJSON(value: IReviverValue): CreateProgramWork {
    return Generic_fromJSON(CreateProgramWork, value.data);
  }
}

Reviver.constructors.CreateProgramWork = CreateProgramWork;
