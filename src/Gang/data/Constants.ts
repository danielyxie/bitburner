import { FactionNames } from "../../Faction/data/FactionNames";

export const GangConstants: {
  GangRespectToReputationRatio: number;
  MaximumGangMembers: number;
  CyclesPerTerritoryAndPowerUpdate: number;
  AscensionMultiplierRatio: number;
  Names: string[];
  GangKarmaRequirement: number;
} = {
  // Respect is divided by this to get rep gain
  GangRespectToReputationRatio: 75,
  MaximumGangMembers: 12,
  CyclesPerTerritoryAndPowerUpdate: 100,
  // Portion of upgrade multiplier that is kept after ascending
  AscensionMultiplierRatio: 0.15,
  // Names of possible Gangs
  Names: [
    FactionNames.SlumSnakes,
    FactionNames.Tetrads,
    FactionNames.TheSyndicate,
    FactionNames.TheDarkArmy,
    FactionNames.SpeakersForTheDead,
    FactionNames.NiteSec,
    FactionNames.TheBlackHand,
  ],
  GangKarmaRequirement: -54000,
};
