import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { Crime } from "src/Crime/Crime";
import { newWorkStats, scaleWorkStats, WorkStats } from "../WorkStats";
import { Player } from "../../Player";

export const calculateCrimeWorkStats = (crime: Crime): WorkStats => {
  const gains = scaleWorkStats(
    newWorkStats({
      money: crime.money * Player.mults.crime_money,
      hackExp: crime.hacking_exp * 2 * Player.mults.hacking_exp,
      strExp: crime.strength_exp * 2 * Player.mults.strength_exp,
      defExp: crime.defense_exp * 2 * Player.mults.defense_exp,
      dexExp: crime.dexterity_exp * 2 * Player.mults.dexterity_exp,
      agiExp: crime.agility_exp * 2 * Player.mults.agility_exp,
      chaExp: crime.charisma_exp * 2 * Player.mults.charisma_exp,
      intExp: crime.intelligence_exp * 2,
    }),
    BitNodeMultipliers.CrimeExpGain,
    false,
  );
  gains.money *= BitNodeMultipliers.CrimeMoney;
  return gains;
};
