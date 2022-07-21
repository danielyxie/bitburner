import { CompanyPositions } from "../../Company/CompanyPositions";
import { Company } from "../../Company/Company";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { WorkStats } from "../WorkStats";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";

export const calculateCompanyWorkStats = (player: IPlayer, company: Company): WorkStats => {
  const companyPositionName = player.jobs[company.name];
  const companyPosition = CompanyPositions[companyPositionName];

  let focusBonus = 1;
  if (!player.hasAugmentation(AugmentationNames.NeuroreceptorManager)) {
    focusBonus = player.focus ? 1 : CONSTANTS.BaseFocusBonus;
  }

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
    player.hacking,
    player.strength,
    player.defense,
    player.dexterity,
    player.agility,
    player.charisma,
  );

  jobPerformance += player.intelligence / CONSTANTS.MaxSkillLevel;

  return {
    money:
      focusBonus *
      companyPosition.baseSalary *
      company.salaryMultiplier *
      player.mults.work_money *
      BitNodeMultipliers.CompanyWorkMoney *
      bn11Mult,
    reputation: focusBonus * jobPerformance * player.mults.company_rep * favorMult,
    hackExp:
      focusBonus *
      companyPosition.hackingExpGain *
      company.expMultiplier *
      player.mults.hacking_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    strExp:
      focusBonus *
      companyPosition.strengthExpGain *
      company.expMultiplier *
      player.mults.strength_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    defExp:
      focusBonus *
      companyPosition.defenseExpGain *
      company.expMultiplier *
      player.mults.defense_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    dexExp:
      focusBonus *
      companyPosition.dexterityExpGain *
      company.expMultiplier *
      player.mults.dexterity_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    agiExp:
      focusBonus *
      companyPosition.agilityExpGain *
      company.expMultiplier *
      player.mults.agility_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    chaExp:
      focusBonus *
      companyPosition.charismaExpGain *
      company.expMultiplier *
      player.mults.charisma_exp *
      BitNodeMultipliers.CompanyWorkExpGain,
    intExp: 0,
  };
};
