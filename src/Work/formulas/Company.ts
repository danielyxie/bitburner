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
      player.work_money_mult *
      BitNodeMultipliers.CompanyWorkMoney *
      bn11Mult,
    reputation: focusBonus * jobPerformance * player.company_rep_mult * favorMult,
    hackExp:
      focusBonus *
      companyPosition.hackingExpGain *
      company.expMultiplier *
      player.hacking_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain,
    strExp:
      focusBonus *
      companyPosition.strengthExpGain *
      company.expMultiplier *
      player.strength_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain,
    defExp:
      focusBonus *
      companyPosition.defenseExpGain *
      company.expMultiplier *
      player.defense_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain,
    dexExp:
      focusBonus *
      companyPosition.dexterityExpGain *
      company.expMultiplier *
      player.dexterity_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain,
    agiExp:
      focusBonus *
      companyPosition.agilityExpGain *
      company.expMultiplier *
      player.agility_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain,
    chaExp:
      focusBonus *
      companyPosition.charismaExpGain *
      company.expMultiplier *
      player.charisma_exp_mult *
      BitNodeMultipliers.CompanyWorkExpGain,
    intExp: 0,
  };
};
