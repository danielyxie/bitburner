import { FactionNames } from '../../Faction/data/FactionNames';
export const PowerMultiplier: {
  [key: string]: number | undefined;
} = {
  [FactionNames.SlumSnakes]: 1,
  [FactionNames.Tetrads]: 2,
  [FactionNames.TheSyndicate]: 2,
  [FactionNames.TheDarkArmy]: 2,
  [FactionNames.SpeakersForTheDead]: 5,
  [FactionNames.NiteSec]: 2,
  [FactionNames.TheBlackHand]: 5,
};
