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
import { CompanyPartTimeWorkInfo } from "../WorkInfo";
import { WorkManager, WorkRates } from "../WorkManager";
import { WorkType } from "../WorkType";

export const baseCompanyPartTimeWorkInfo: CompanyPartTimeWorkInfo = {
  companyName: "",

  start: function (workManager: WorkManager, { company }): void {
    workManager.workType = WorkType.Company;
    workManager.timeToCompletion = CONSTANTS.MillisecondsPer8Hours;

    // Update the manager's company name
    workManager.info.company.companyName = company;

    // Update the manager rates
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
    // Check if the player has worked a full shift
    let overMax = false;
    if (workManager.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer8Hours) {
      overMax = true;
      numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - workManager.timeWorked) / CONSTANTS._idleSpeed);
    }

    // Add the calculated time to the manager's time worked
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    // Update the manager's rates every tick
    merge(workManager.rates, {
      rep: workManager.player.getWorkRepGain(),
      money: workManager.player.getWorkMoneyGain(),
    } as WorkRates);

    // Update the player's exp and money earnings
    workManager.processWorkEarnings(numCycles);

    // Influence the stock market
    const company = Companies[workManager.info.company.companyName];
    influenceStockThroughCompanyWork(company, workManager.rates.rep, numCycles);

    // If player has worked a full shift, end the work through the manager
    if (overMax || workManager.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
      workManager.finish({ cancelled: true });
      return true;
    }
    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    const company = Companies[workManager.info.company.companyName];
    // Update the player's rep with the company
    company.playerReputation += workManager.gains.rep;

    // Update player skill levels
    workManager.player.updateSkillLevels();

    // If the job wasn't run via Singularity, show a summary alert
    if (!options?.singularity) {
      const content = (
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
      dialogBoxCreate(content);
      return "";
    } else {
      // Otherwise, return a summary through the script
      const res =
        "You worked for " +
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
