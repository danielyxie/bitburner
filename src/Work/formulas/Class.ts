import { Locations } from "../../Locations/Locations";
import { Location } from "../../Locations/Location";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { Player } from "../../Player";
import { Class, Classes, ClassType } from "../ClassWork";
import { WorkStats } from "../WorkStats";
import { Server } from "../../Server/Server";
import { GetServer } from "../../Server/AllServers";
import { serverMetadata } from "../../Server/data/servers";
import { IPerson } from "../../PersonObjects/IPerson";
import { LocationName } from "../../Locations/data/LocationNames";

const gameCPS = 1000 / CONSTANTS._idleSpeed; // 5 cycles per second

export function calculateCost(classs: Class, location: Location): number {
  const serverMeta = serverMetadata.find((s) => s.specialName === location.name);
  const server = GetServer(serverMeta ? serverMeta.hostname : "");
  const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
  return classs.earnings.money * location.costMult * discount;
}

export function calculateClassEarnings(
  person: IPerson,
  type: ClassType,
  locationName: LocationName,
): WorkStats {
  //Find cost and exp gain per game cycle
  const hashManager = Player.hashManager;
  const classs = Classes[type];
  const location = Locations[locationName];

  const hashMult = [ClassType.GymAgility, ClassType.GymDefense, ClassType.GymStrength, ClassType.GymDexterity].includes(
    type,
  )
    ? hashManager.getTrainingMult()
    : hashManager.getStudyMult();

  const cost = calculateCost(classs, location) / gameCPS;
  const hackExp = ((classs.earnings.hackExp * location.expMult) / gameCPS) * hashMult;
  const strExp = ((classs.earnings.strExp * location.expMult) / gameCPS) * hashMult;
  const defExp = ((classs.earnings.defExp * location.expMult) / gameCPS) * hashMult;
  const dexExp = ((classs.earnings.dexExp * location.expMult) / gameCPS) * hashMult;
  const agiExp = ((classs.earnings.agiExp * location.expMult) / gameCPS) * hashMult;
  const chaExp = ((classs.earnings.chaExp * location.expMult) / gameCPS) * hashMult;
  return {
    money: cost,
    reputation: 0,
    hackExp: hackExp * person.mults.hacking_exp * BitNodeMultipliers.ClassGymExpGain,
    strExp: strExp * person.mults.strength_exp * BitNodeMultipliers.ClassGymExpGain,
    defExp: defExp * person.mults.defense_exp * BitNodeMultipliers.ClassGymExpGain,
    dexExp: dexExp * person.mults.dexterity_exp * BitNodeMultipliers.ClassGymExpGain,
    agiExp: agiExp * person.mults.agility_exp * BitNodeMultipliers.ClassGymExpGain,
    chaExp: chaExp * person.mults.charisma_exp * BitNodeMultipliers.ClassGymExpGain,
    intExp: 0,
  };
}
