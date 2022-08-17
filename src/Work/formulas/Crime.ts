import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Crime } from "src/Crime/Crime";
import { newWorkStats, scaleWorkStats, WorkStats } from "../WorkStats";

export const calculateCrimeWorkStats = (crime: Crime): WorkStats => {
  const gains = scaleWorkStats(
    newWorkStats({
      money: crime.money,
      hackExp: crime.hacking_exp * 2,
      strExp: crime.strength_exp * 2,
      defExp: crime.defense_exp * 2,
      dexExp: crime.dexterity_exp * 2,
      agiExp: crime.agility_exp * 2,
      chaExp: crime.charisma_exp * 2,
      intExp: crime.intelligence_exp * 2,
    }),
    BitNodeMultipliers.CrimeExpGain,
    false,
  );
  gains.money *= BitNodeMultipliers.CrimeMoney;
  return gains;
};
