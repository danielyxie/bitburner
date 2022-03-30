import { FactionNames } from '../Faction/data/FactionNames';
import { Reviver } from "../utils/JSONReviver";

interface GangTerritory {
  power: number;
  territory: number;
}

export let AllGangs: {
  [key: string]: GangTerritory;
} = {
  [FactionNames.SlumSnakes]: {
    power: 1,
    territory: 1 / 7,
  },
  [FactionNames.Tetrads]: {
    power: 1,
    territory: 1 / 7,
  },
  [FactionNames.TheSyndicate]: {
    power: 1,
    territory: 1 / 7,
  },
  [FactionNames.TheDarkArmy]: {
    power: 1,
    territory: 1 / 7,
  },
  [FactionNames.SpeakersForTheDead]: {
    power: 1,
    territory: 1 / 7,
  },
  [FactionNames.NiteSec]: {
    power: 1,
    territory: 1 / 7,
  },
  [FactionNames.TheBlackHand]: {
    power: 1,
    territory: 1 / 7,
  },
};

export function resetGangs(): void {
  AllGangs = {
    [FactionNames.SlumSnakes]: {
      power: 1,
      territory: 1 / 7,
    },
    [FactionNames.Tetrads]: {
      power: 1,
      territory: 1 / 7,
    },
    [FactionNames.TheSyndicate]: {
      power: 1,
      territory: 1 / 7,
    },
    [FactionNames.TheDarkArmy]: {
      power: 1,
      territory: 1 / 7,
    },
    [FactionNames.SpeakersForTheDead]: {
      power: 1,
      territory: 1 / 7,
    },
    [FactionNames.NiteSec]: {
      power: 1,
      territory: 1 / 7,
    },
    [FactionNames.TheBlackHand]: {
      power: 1,
      territory: 1 / 7,
    },
  };
}

export function loadAllGangs(saveString: string): void {
  AllGangs = JSON.parse(saveString, Reviver);
}
