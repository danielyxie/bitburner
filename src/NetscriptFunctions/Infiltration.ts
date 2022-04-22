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
import { InternalAPI, NetscriptContext } from "../Netscript/APIWrapper";
import { checkEnum } from "../utils/helpers/checkEnum";
import { LocationName } from "../Locations/data/LocationNames";

export function NetscriptInfiltration(player: IPlayer): InternalAPI<IInfiltration> {
  const getLocationsWithInfiltrations = Object.values(Locations).filter(
    (location: Location) => location.infiltrationData,
  );

  const calculateInfiltrationData = (ctx: NetscriptContext, locationName: string): InfiltrationLocation => {
    if (!checkEnum(LocationName, locationName)) throw new Error(`Location '${locationName}' does not exists.`);
    const location = Locations[locationName];
    if (location === undefined) throw ctx.makeRuntimeErrorMsg(`Location '${location}' does not exists.`);
    if (location.infiltrationData === undefined)
      throw ctx.makeRuntimeErrorMsg(`Location '${location}' does not provide infiltrations.`);
    const startingSecurityLevel = location.infiltrationData.startingSecurityLevel;
    const difficulty = calculateDifficulty(player, startingSecurityLevel);
    const reward = calculateReward(player, startingSecurityLevel);
    const maxLevel = location.infiltrationData.maxClearanceLevel;
    return {
      location: location,
      reward: {
        tradeRep: calculateTradeInformationRepReward(player, reward, maxLevel, difficulty),
        sellCash: calculateSellInformationCashReward(player, reward, maxLevel, difficulty),
        SoARep: calculateInfiltratorsRepReward(player, Factions[FactionNames.ShadowsOfAnarchy], difficulty),
      },
      difficulty: difficulty,
    };
  };
  return {
    getPossibleLocations: () => (): string[] => {
      return getLocationsWithInfiltrations.map((l) => l + "");
    },
    getInfiltration:
      (ctx: NetscriptContext) =>
      (_location: unknown): InfiltrationLocation => {
        const location = ctx.helper.string("location", _location);
        return calculateInfiltrationData(ctx, location);
      },
  };
}
