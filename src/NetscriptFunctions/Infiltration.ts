import { INetscriptHelper } from "./INetscriptHelper";
import { IPlayer } from "../PersonObjects/IPlayer";
import { WorkerScript } from "../Netscript/WorkerScript";
import { getRamCost } from "../Netscript/RamCostGenerator";

import {
  Infiltration as IInfiltration,
  InfiltrationLocation,
  InfiltrationReward,
} from "../ScriptEditor/NetscriptDefinitions";
import { Location } from "../Locations/Location";
import { Locations } from "../Locations/Locations";
import { calculateDifficulty, calculateReward } from "../Infiltration/formulas/game";
import {
  calculateInfiltratorsRepReward,
  calculateSellInformationCashReward,
  calculateTradeInformationRepReward,
} from "../Infiltration/formulas/victory";
import { FactionNames } from "../Faction/data/FactionNames";
import { Factions } from "../Faction/Factions";

export function NetscriptInfiltration(
  player: IPlayer,
  workerScript: WorkerScript,
  helper: INetscriptHelper,
): IInfiltration {
  const getLocationsWithInfiltrations = Object.values(Locations).filter(
    (location: Location) => location.infiltrationData,
  );

  const calculateInfiltrationData = (location: Location | undefined): InfiltrationLocation => {
    if (location === undefined)
      throw helper.makeRuntimeErrorMsg(
        `infiltration.calculateReward`,
        "The provided location does not exist or does not provide infiltrations",
      );

    if (location.infiltrationData === undefined)
      throw helper.makeRuntimeErrorMsg(
        `infiltration.calculateReward`,
        "The provided location does not exist or does not provide infiltrations",
      );
    const startingSecurityLevel = location.infiltrationData.startingSecurityLevel;
    const difficulty = calculateDifficulty(player, startingSecurityLevel);
    const reward = calculateReward(player, startingSecurityLevel);
    const maxLevel = location.infiltrationData.maxClearanceLevel;
    return {
      location: location,
      reward: {
        tradeRep: calculateTradeInformationRepReward(player, reward, maxLevel, difficulty),
        sellCash: calculateSellInformationCashReward(player, reward, maxLevel, difficulty),
        infiltratorRep: calculateInfiltratorsRepReward(player, Factions[FactionNames.ShadowsOfAnarchy], difficulty),
      },
      difficulty: difficulty,
    };
  };
  return {
    calculateDifficulty: function (locationName: string): number {
      const location = getLocationsWithInfiltrations.find((infilLocation) => infilLocation.name === locationName);
      helper.updateDynamicRam("calculateDifficulty", getRamCost(player, "infiltration", "calculateDifficulty"));
      return calculateInfiltrationData(location).difficulty;
    },
    calculateRewards: function (locationName: string): InfiltrationReward {
      const location = getLocationsWithInfiltrations.find((infilLocation) => infilLocation.name === locationName);
      helper.updateDynamicRam("calculateReward", getRamCost(player, "infiltration", "calculateReward"));
      return calculateInfiltrationData(location).reward;
    },
    getLocations: function (): Location[] {
      helper.updateDynamicRam("getLocations", getRamCost(player, "infiltration", "getLocations"));
      return getLocationsWithInfiltrations;
    },
    getInfiltrations: function (): InfiltrationLocation[] {
      helper.updateDynamicRam("getInfiltrations", getRamCost(player, "infiltration", "getInfiltrations"));
      return getLocationsWithInfiltrations.map(calculateInfiltrationData);
    },
  };
}
