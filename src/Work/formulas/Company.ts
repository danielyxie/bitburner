import { CompanyPositions } from "../../Company/CompanyPositions";
import { Company } from "../../Company/Company";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { WorkStats } from "../WorkStats";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { IPerson } from "src/PersonObjects/IPerson";

export const calculateCompanyWorkStats = (player: IPlayer, worker: IPerson, company: Company): WorkStats => {
  const companyPositionName = player.jobs[company.name];
  const companyPosition = CompanyPositions[companyPositionName];

  // If player has SF-11, calculate salary multiplier from favor
  let favorMult = 1 + company.favor / 100;
  if (isNaN(favorMult)) {
    favorMult = 1;
  }

  let bn11Mult = 1;
  if (player.sourceFileLvl(11) > 0) {
    bn11Mult = favorMult;
  }

  let jobPerformance = companyPosition.calculateJobPerformance(
    worker.skills.hacking,
    worker.skills.strength,
    worker.skills.defense,
    worker.skills.dexterity,
    worker.skills.agility,
    worker.skills.charisma,
  );

  jobPerformance += worker.skills.intelligence / CONSTANTS.MaxSkillLevel;

  return {
    money:
      companyPosition.baseSalary *
      company.salaryMultiplier *
      worker.mults.work_money *
      BitNodeMultipliers.CompanyWorkMoney *
      bn11Mult,
    reputation: jobPerformance * worker.mults.company_rep * favorMult,
    hackExp:
      companyPosition.hackingExpGain *
      company.expMultiplier *
      worker.mults.hacking_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    strExp:
      companyPosition.strengthExpGain *
      company.expMultiplier *
      worker.mults.strength_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    defExp:
      companyPosition.defenseExpGain *
      company.expMultiplier *
      worker.mults.defense_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    dexExp:
      companyPosition.dexterityExpGain *
      company.expMultiplier *
      worker.mults.dexterity_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    agiExp:
      companyPosition.agilityExpGain *
      company.expMultiplier *
      worker.mults.agility_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    chaExp:
      companyPosition.charismaExpGain *
      company.expMultiplier *
      worker.mults.charisma_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    intExp: 0,
  };
};
