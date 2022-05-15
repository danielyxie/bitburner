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
import { WorkType } from "../WorkType";

export const baseCompanyWorkInfo: CompanyWorkInfo = {
  companyName: "",
  start: function (workManager: WorkManager, company: string): void {
    workManager.workType = WorkType.Company;
    workManager.timeToCompletion = CONSTANTS.MillisecondsPer8Hours;

    workManager.info.company.companyName = company;

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
    let overMax = false;
    if (workManager.timeWorked + CONSTANTS._idleSpeed * numCycles >= CONSTANTS.MillisecondsPer8Hours) {
      overMax = true;
      numCycles = Math.round((CONSTANTS.MillisecondsPer8Hours - workManager.timeWorked) / CONSTANTS._idleSpeed);
    }
    workManager.timeWorked += CONSTANTS._idleSpeed * numCycles;

    merge(workManager.rates, {
      rep: workManager.player.getWorkRepGain(),
      money: workManager.player.getWorkMoneyGain(),
    } as WorkRates);

    workManager.processWorkEarnings(numCycles);

    const company = Companies[workManager.info.company.companyName];
    influenceStockThroughCompanyWork(company, workManager.rates.rep, numCycles);

    if (overMax || workManager.timeWorked >= CONSTANTS.MillisecondsPer8Hours) {
      this.finish(workManager, { cancelled: true });
      return true;
    }
    return false;
  },

  finish: function (
    workManager: WorkManager,
    options: { singularity?: boolean | undefined; cancelled: boolean },
  ): string {
    if (options.cancelled) {
      workManager.gains.rep *= workManager.player.cancelationPenalty();
    }
    const penaltyString = workManager.player.cancelationPenalty() === 0.5 ? "half" : "three-quarters";

    const company = Companies[workManager.info.company.companyName];
    company.playerReputation += workManager.gains.rep;

    workManager.player.updateSkillLevels();

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

      workManager.reset();
      return "";
    } else {
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

      workManager.reset();
      return res;
    }
  },
};
