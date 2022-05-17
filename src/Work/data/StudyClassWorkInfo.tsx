import { merge } from "lodash";
import React from "react";
import { CONSTANTS } from "../../Constants";
import { calculateClassEarnings } from "../../PersonObjects/formulas/work";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Money } from "../../ui/React/Money";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { StudyClassWorkInfo } from "../WorkInfo";
import { WorkManager } from "../WorkManager";
import { ClassType } from "../WorkType";

export const baseStudyClassWorkInfo: StudyClassWorkInfo = {
  className: ClassType.None,

  start: function (workManager: WorkManager, { costMult, expMult, className }): void {
    // Other setup
    workManager.info.studyClass.className = className;

    // Setup cost and exp mults
    workManager.costMult = costMult;
    workManager.expMult = expMult;

    // Calculate and initialize rates
    const earnings = calculateClassEarnings(workManager.player);
    merge(workManager.rates, earnings);
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    // Update time worked
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    // Update rates
    const earnings = calculateClassEarnings(workManager.player);
    merge(workManager.rates, earnings);

    // Process earnings
    workManager.processWorkEarnings(numCycles);
    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    const gains = workManager.gains,
      className = workManager.info.studyClass.className,
      player = workManager.player;

    // Gain INT exp based on time studied
    player.gainIntelligenceExp(CONSTANTS.IntelligenceClassBaseExpGain * Math.round(workManager.timeWorked / 1000));

    // We should not be able to gain any money whilst studying
    if (gains.money > 0) throw new Error("Somehow gained money while studying. This is a bug!");

    // Update skill levels
    player.updateSkillLevels();

    if (!options?.singularity) {
      // If initiated via UI, show a UI popup when done
      dialogBoxCreate(
        <>
          After {className} for {convertTimeMsToTimeElapsedString(workManager.timeWorked)}, <br />
          you spent a total of <Money money={-gains.money} />. <br />
          <br />
          You earned a total of: <br />
          {numeralWrapper.formatExp(gains.hackExp)} hacking exp <br />
          {numeralWrapper.formatExp(gains.strExp)} strength exp <br />
          {numeralWrapper.formatExp(gains.defExp)} defense exp <br />
          {numeralWrapper.formatExp(gains.dexExp)} dexterity exp <br />
          {numeralWrapper.formatExp(gains.agiExp)} agility exp <br />
          {numeralWrapper.formatExp(gains.chaExp)} charisma exp
          <br />
        </>,
      );
      return "";
    } else {
      // If initiated via API, return a text summary
      const res =
        "After " +
        className +
        " for " +
        convertTimeMsToTimeElapsedString(workManager.timeWorked) +
        ", " +
        "you spent a total of " +
        numeralWrapper.formatMoney(gains.money * -1) +
        ". " +
        "You earned a total of: " +
        numeralWrapper.formatExp(gains.hackExp) +
        " hacking exp, " +
        numeralWrapper.formatExp(gains.strExp) +
        " strength exp, " +
        numeralWrapper.formatExp(gains.defExp) +
        " defense exp, " +
        numeralWrapper.formatExp(gains.dexExp) +
        " dexterity exp, " +
        numeralWrapper.formatExp(gains.agiExp) +
        " agility exp, and " +
        numeralWrapper.formatExp(gains.chaExp) +
        " charisma exp";
      return res;
    }
  },
};
