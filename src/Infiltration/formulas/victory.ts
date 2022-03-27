import { IPlayer } from "../../PersonObjects/IPlayer";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { LocationsMetadata } from "../../Locations/data/LocationsMetadata";

export function calculateSellInformationCashReward(
  player: IPlayer,
  reward: number,
  maxLevel: number,
  difficulty: number,
): number {
  const levelBonus = maxLevel * Math.pow(1.01, maxLevel);

  return (
    Math.pow(reward + 1, 2) *
    Math.pow(difficulty, 3) *
    3e3 *
    levelBonus *
    player.infiltration_sell_mult *
    BitNodeMultipliers.InfiltrationMoney
  );
}

export function calculateTradeInformationRepReward(
  player: IPlayer,
  reward: number,
  maxLevel: number,
  difficulty: number,
): number {
  const levelBonus = maxLevel * Math.pow(1.01, maxLevel);

  return (
    Math.pow(reward + 1, 2) *
    Math.pow(difficulty, 3) *
    3e3 *
    levelBonus *
    player.infiltration_sell_mult *
    BitNodeMultipliers.InfiltrationMoney
  );
}

export function calculateInfiltratorsRepReward(player: IPlayer, difficulty: number): number {
  const maxStartingSecurityLevel = LocationsMetadata.reduce((acc, data): number => {
    const startingSecurityLevel = data.infiltrationData?.startingSecurityLevel || 0;
    return acc > startingSecurityLevel ? acc : startingSecurityLevel;
  }, 0);
  const baseRepGain = (difficulty / maxStartingSecurityLevel) * 10;

  return (baseRepGain + player.infiltration_base_rep_increase) * player.infiltration_rep_mult;
}
