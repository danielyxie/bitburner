import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Companies } from "../../Company/Companies";
import { Company } from "../../Company/Company";
import { CompanyPosition } from "../../Company/CompanyPosition";
import { CompanyPositions } from "../../Company/CompanyPositions";
import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";

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

export function getWorkMoneyGain(player: IPlayer): number {
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
}

export function getWorkHackExp(player: IPlayer): number {
  const jobData = getJobData(player, "hack exp");
  if (!jobData) return 0;

  return (
    jobData.position.hackingExpGain *
    jobData.company.expMultiplier *
    player.hacking_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

export function getWorkStrExp(player: IPlayer): number {
  const jobData = getJobData(player, "str exp");
  if (!jobData) return 0;

  return (
    jobData.position.strengthExpGain *
    jobData.company.expMultiplier *
    player.strength_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

export function getWorkDefExp(player: IPlayer): number {
  const jobData = getJobData(player, "def exp");
  if (!jobData) return 0;

  return (
    jobData.position.defenseExpGain *
    jobData.company.expMultiplier *
    player.defense_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

export function getWorkDexExp(player: IPlayer): number {
  const jobData = getJobData(player, "dex exp");
  if (!jobData) return 0;

  return (
    jobData.position.dexterityExpGain *
    jobData.company.expMultiplier *
    player.dexterity_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

export function getWorkAgiExp(player: IPlayer): number {
  const jobData = getJobData(player, "agi exp");
  if (!jobData) return 0;

  return (
    jobData.position.agilityExpGain *
    jobData.company.expMultiplier *
    player.agility_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

export function getWorkChaExp(player: IPlayer): number {
  const jobData = getJobData(player, "cha exp");
  if (!jobData) return 0;

  return (
    jobData.position.charismaExpGain *
    jobData.company.expMultiplier *
    player.charisma_exp_mult *
    BitNodeMultipliers.CompanyWorkExpGain
  );
}

export function getWorkRepGain(player: IPlayer): number {
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
}
