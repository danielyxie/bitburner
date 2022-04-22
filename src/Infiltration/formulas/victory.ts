import { IPlayer } from "../../PersonObjects/IPlayer";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { LocationsMetadata } from "../../Locations/data/LocationsMetadata";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";

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
    (player.hasAugmentation(AugmentationNames.WKSharmonizer) ? 1.5 : 1) *
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
    (player.hasAugmentation(AugmentationNames.WKSharmonizer) ? 1.5 : 1) *
    BitNodeMultipliers.InfiltrationMoney
  );
}

export function calculateInfiltratorsRepReward(player: IPlayer, faction: Faction, difficulty: number): number {
  const maxStartingSecurityLevel = LocationsMetadata.reduce((acc, data): number => {
    const startingSecurityLevel = data.infiltrationData?.startingSecurityLevel || 0;
    return acc > startingSecurityLevel ? acc : startingSecurityLevel;
  }, 0);
  const baseRepGain = (difficulty / maxStartingSecurityLevel) * 5000;

  return baseRepGain * (player.hasAugmentation(AugmentationNames.WKSharmonizer) ? 2 : 1) * (1 + faction.favor / 100);
}
