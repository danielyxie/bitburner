import { merge } from "lodash";
import React from "react";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Companies } from "../../Company/Companies";
import { Company } from "../../Company/Company";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { CompanyPositions } from "../../Company/CompanyPositions";
import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { influenceStockThroughCompanyWork } from "../../StockMarket/PlayerInfluencing";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { CompanyWorkInfo } from "../WorkInfo";
import { WorkManager, WorkRates } from "../WorkManager";

interface JobData {
  company: Company;
  position: CompanyPosition;
}

const getJobData = (player: IPlayer, gainType: string): JobData | undefined => {
  const companyName = player.getCompanyName();

  const company = Companies?.[companyName],
    companyPositionName = player.jobs?.[companyName],
    companyPosition = CompanyPositions?.[companyPositionName];

  if (!company || !companyPosition) {
    console.error(
      `Could not find Company object for ${companyName} or ` +
        `CompanyPosition object for ${companyPositionName}.` +
        `Work ${gainType} gain will be 0`,
    );
    return undefined;
  }
  return { company, position: companyPosition };
};

export const baseCompanyWorkInfo: CompanyWorkInfo = {
  companyName: "",
  partTime: false,

  start: function (workManager: WorkManager, { company, partTime }): void {
    workManager.timeToCompletion = CONSTANTS.MillisecondsPer8Hours;

    workManager.info.company.companyName = company;
    workManager.info.company.partTime = partTime;

    // Update rates
    merge(workManager.rates, {
      hackExp: this.getHackExpGain(workManager.player),
      strExp: this.getStrExpGain(workManager.player),
      defExp: this.getDefExpGain(workManager.player),
      dexExp: this.getDexExpGain(workManager.player),
      agiExp: this.getAgiExpGain(workManager.player),
      chaExp: this.getChaExpGain(workManager.player),
      rep: this.getRepGain(workManager.player),
      money: this.getMoneyGain(workManager.player),
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
      rep: this.getRepGain(workManager.player),
      money: this.getMoneyGain(workManager.player),
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
    const info = workManager.info.company;

    // If the job was finished with less than a full shift, apply penalty
    if (options.cancelled && !info.partTime) {
      workManager.gains.rep *= workManager.player.cancelationPenalty();
    }
    const penaltyString = info.partTime
      ? ""
      : workManager.player.cancelationPenalty() === 0.5
      ? "half"
      : "three-quarters";

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

      if (!info.partTime) {
        // Append info about penalty
        if (options.cancelled) {
          content = (
            <>
              You worked a short shift of {convertTimeMsToTimeElapsedString(workManager.timeWorked)} <br />
              <br />
              Since you cancelled your work early, you only gained {penaltyString} of the reputation you earned.
              <br />
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
      }
      dialogBoxCreate(content);
      return "";
    } else {
      // Otherwise show summary through Singularity
      const res =
        "You worked " + info.partTime
          ? "for "
          : "a short shift of " +
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

  getMoneyGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "money");
    if (!jobData) return 0;

    let bn11Mult = 1;
    if (player.sourceFileLvl(11) > 0) {
      bn11Mult = 1 + jobData.company.favor / 100;
    }

    return (
      jobData.position.baseSalary *
      jobData.company.salaryMultiplier *
      player.work_money_mult *
      BitNodeMultipliers.CompanyWorkMoney *
      bn11Mult
    );
  },

  getRepGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "rep");
    if (!jobData) return 0;

    let jobPerformance = jobData.position.calculateJobPerformance(
      player.hacking,
      player.strength,
      player.defense,
      player.dexterity,
      player.agility,
      player.charisma,
    );

    //Intelligence provides a flat bonus to job performance
    jobPerformance += player.intelligence / CONSTANTS.MaxSkillLevel;

    //Update reputation gain rate to account for company favor
    let favorMult = 1 + jobData.company.favor / 100;
    if (isNaN(favorMult)) {
      favorMult = 1;
    }
    return jobPerformance * player.company_rep_mult * favorMult;
  },

  getHackExpGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "hack exp");
    if (!jobData) return 0;

    return (
      jobData.position.hackingExpGain *
      jobData.company.expMultiplier *
      player.hacking_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain
    );
  },

  getStrExpGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "str exp");
    if (!jobData) return 0;

    return (
      jobData.position.strengthExpGain *
      jobData.company.expMultiplier *
      player.strength_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain
    );
  },

  getDefExpGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "def exp");
    if (!jobData) return 0;

    return (
      jobData.position.defenseExpGain *
      jobData.company.expMultiplier *
      player.defense_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain
    );
  },

  getDexExpGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "dex exp");
    if (!jobData) return 0;

    return (
      jobData.position.dexterityExpGain *
      jobData.company.expMultiplier *
      player.dexterity_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain
    );
  },

  getAgiExpGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "agi exp");
    if (!jobData) return 0;

    return (
      jobData.position.agilityExpGain *
      jobData.company.expMultiplier *
      player.agility_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain
    );
  },

  getChaExpGain: function (player: IPlayer): number {
    const jobData = getJobData(player, "cha exp");
    if (!jobData) return 0;

    return (
      jobData.position.charismaExpGain *
      jobData.company.expMultiplier *
      player.charisma_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain
    );
  },
};
