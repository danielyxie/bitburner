import { merge } from "lodash";
import React from "react";
import { Companies } from "../../Company/Companies";
import { CONSTANTS } from "../../Constants";
import { influenceStockThroughCompanyWork } from "../../StockMarket/PlayerInfluencing";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { CompanyWorkInfo } from "../WorkInfo";
import { WorkManager, WorkRates } from "../WorkManager";

export const baseCompanyWorkInfo: CompanyWorkInfo = {
  companyName: "",

  start: function (workManager: WorkManager, { company }): void {
    workManager.timeToCompletion = CONSTANTS.MillisecondsPer8Hours;

    workManager.info.company.companyName = company;

    // Update rates
    merge(workManager.rates, {
      hackExp: workManager.player.getWorkHackExpGain(),
      strExp: workManager.player.getWorkStrExpGain(),
      defExp: workManager.player.getWorkDefExpGain(),
      dexExp: workManager.player.getWorkDexExpGain(),
      agiExp: workManager.player.getWorkAgiExpGain(),
      chaExp: workManager.player.getWorkChaExpGain(),
      rep: workManager.player.getWorkRepGain(),
      money: workManager.player.getWorkMoneyGain(),
    } as WorkRates);
  },

  process: function (workManager: WorkManager, numCycles: number): boolean {
    // If worked a shift
    let overMax = false;
    if (workManager.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer8Hours) {
      overMax = true;
      numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - workManager.timeWorked) / CONSTANTS._idleSpeed);
    }
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    // Update rates
    merge(workManager.rates, {
      rep: workManager.player.getWorkRepGain(),
      money: workManager.player.getWorkMoneyGain(),
    } as WorkRates);

    // Process earnings
    workManager.processWorkEarnings(numCycles);

    // Influence stocks
    const company = Companies[workManager.info.company.companyName];
    influenceStockThroughCompanyWork(company, workManager.rates.rep, numCycles);

    // Maybe finish through manager
    if (overMax || workManager.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
      workManager.finish({ cancelled: false });
      return true;
    }
    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    // If the job was finished with less than a full shift, apply penalty
    if (options.cancelled) {
      workManager.gains.rep *= workManager.player.cancelationPenalty();
    }
    const penaltyString = workManager.player.cancelationPenalty() === 0.5 ? "half" : "three-quarters";

    const company = Companies[workManager.info.company.companyName];
    // Update player's rep with the company
    company.playerReputation += workManager.gains.rep;

    // Upadte skill levels
    workManager.player.updateSkillLevels();

    // Show summary if not done through Singularity
    if (!options?.singularity) {
      let content = (
        <>
          You worked for {convertTimeMsToTimeElapsedString(workManager.timeWorked)}
          <br />
          <br />
          You earned a total of:
          <br />
          <Money money={workManager.gains.money} />
          <br />
          <Reputation reputation={workManager.gains.rep} /> reputation for the company
          <br />
          {numeralWrapper.formatExp(workManager.gains.hackExp)} hacking exp
          <br />
          {numeralWrapper.formatExp(workManager.gains.strExp)} strength exp
          <br />
          {numeralWrapper.formatExp(workManager.gains.defExp)} defense exp
          <br />
          {numeralWrapper.formatExp(workManager.gains.dexExp)} dexterity exp
          <br />
          {numeralWrapper.formatExp(workManager.gains.agiExp)} agility exp
          <br />
          {numeralWrapper.formatExp(workManager.gains.chaExp)} charisma exp
          <br />
        </>
      );

      // Append info about penalty
      if (options.cancelled) {
        content = (
          <>
            You worked a short shift of {convertTimeMsToTimeElapsedString(workManager.timeWorked)} <br />
            <br />
            Since you cancelled your work early, you only gained {penaltyString} of the reputation you earned. <br />
            <br />
            {content}
          </>
        );
      } else {
        content = (
          <>
            You worked a full shift of 8 hours! <br />
            <br />
            {content}
          </>
        );
      }
      dialogBoxCreate(content);
      return "";
    } else {
      // Otherwise show summary through Singularity
      const res =
        "You worked a short shift of " +
        convertTimeMsToTimeElapsedString(workManager.timeWorked) +
        " and " +
        "earned a total of " +
        "$" +
        numeralWrapper.formatMoney(workManager.gains.money) +
        ", " +
        numeralWrapper.formatReputation(workManager.gains.rep) +
        " reputation, " +
        numeralWrapper.formatExp(workManager.gains.hackExp) +
        " hacking exp, " +
        numeralWrapper.formatExp(workManager.gains.strExp) +
        " strength exp, " +
        numeralWrapper.formatExp(workManager.gains.defExp) +
        " defense exp, " +
        numeralWrapper.formatExp(workManager.gains.dexExp) +
        " dexterity exp, " +
        numeralWrapper.formatExp(workManager.gains.agiExp) +
        " agility exp, and " +
        numeralWrapper.formatExp(workManager.gains.chaExp) +
        " charisma exp";
      return res;
    }
  },
};
