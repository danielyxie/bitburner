import { merge } from "lodash";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { CONSTANTS } from "../../Constants";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { CreateProgramWorkInfo } from "../WorkInfo";
import { WorkManager } from "../WorkManager";
import { WorkType } from "../WorkType";

export const baseCreateProgramWorkInfo: CreateProgramWorkInfo = {
  programName: "",
  requiredLevel: 0,
  timeWorked: 0,

  start: function (workManager: WorkManager, program: string, time: number, requiredLevel: number): void {
    let effectiveTimeWorked = 0;

    const playerPrograms = workManager.player.getHomeComputer().programs;
    const partialProgram = playerPrograms.find(
      (programFile) => programFile.startsWith(program) && programFile.endsWith("%-INC"),
    );
    if (partialProgram)
      do {
        const res = partialProgram.split("-");
        if (res.length !== 3) break;

        const percentage = parseInt(res[1].slice(0, -1));
        if (isNaN(percentage) || percentage < 0 || percentage >= 1) break;

        effectiveTimeWorked = (percentage / 100) * time;
        playerPrograms.splice(playerPrograms.indexOf(partialProgram));
      } while (false);

    workManager.workType = WorkType.CreateProgram;
    workManager.timeToCompletion = time;
    workManager.timeWorked = 0;
    merge(workManager.info.createProgram, <CreateProgramWorkInfo>{
      programName: program,
      requiredLevel,
      timeWorked: effectiveTimeWorked,
    });
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    let focusBonus = 1;
    if (!workManager.player.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
      focusBonus = workManager.player.focus ? 1 : CONSTANTS.BaseFocusBonus;
    }

    const reqLevel = workManager.info.createProgram.requiredLevel;
    let skillMult = (workManager.player.hacking / reqLevel) * workManager.player.getIntelligenceBonus(3);
    skillMult = 1 + (skillMult - 1) / 5;
    skillMult *= focusBonus;

    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;
    workManager.info.createProgram.timeWorked += CONSTANTS._idleSpeed * numCycles * skillMult;

    if (workManager.info.createProgram.timeWorked >= workManager.timeToCompletion) {
      this.finish(workManager, { cancelled: false });
      return true;
    }
    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    const programName = workManager.info.createProgram.programName;

    const playerPrograms = workManager.player.getHomeComputer().programs;
    if (!options.cancelled) {
      workManager.player.gainIntelligenceExp(
        (CONSTANTS.IntelligenceProgramBaseExpGain * workManager.timeWorked) / 1000,
      );
      dialogBoxCreate(`You've finished creating ${programName}!<br>The program can be found on your home computer.`);

      if (!playerPrograms.includes(programName)) {
        playerPrograms.push(programName);
      }
    } else if (!playerPrograms.includes(programName)) {
      // Incomplete program
      const percentage = (
        Math.floor((workManager.info.createProgram.timeWorked / workManager.timeToCompletion) * 10000) / 100
      ).toString();
      const partialName = programName + "-" + percentage + "%-INC";
      playerPrograms.push(partialName);
    }

    workManager.reset();
    return "You've finished creating " + programName + "! The new program can be found on your home computer.";
  },
};
