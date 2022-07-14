import { Locations } from "../../Locations/Locations";
import { Location } from "../../Locations/Location";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Class, Classes, ClassWork } from "../ClassWork";
import { WorkStats } from "../WorkStats";
import { Server } from "../../Server/Server";
import { GetServer } from "../../Server/AllServers";
import { serverMetadata } from "../../Server/data/servers";

const gameCPS = 1000 / CONSTANTS._idleSpeed; // 5 cycles per second

export function calculateCost(classs: Class, location: Location): number {
  const serverMeta = serverMetadata.find((s) => s.specialName === location.name);
  const server = GetServer(serverMeta ? serverMeta.hostname : "");
  const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
  return classs.earnings.money * location.costMult * discount;
}

export function calculateClassEarnings(player: IPlayer, work: ClassWork): WorkStats {
  //Find cost and exp gain per game cycle
  const hashManager = player.hashManager;
  const classs = Classes[work.classType];
  const location = Locations[work.location];

  const hashMult = work.isGym() ? hashManager.getTrainingMult() : hashManager.getStudyMult();

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
    hackExp: hackExp * player.mults.hacking_exp * BitNodeMultipliers.ClassGymExpGain,
    strExp: strExp * player.mults.strength_exp * BitNodeMultipliers.ClassGymExpGain,
    defExp: defExp * player.mults.defense_exp * BitNodeMultipliers.ClassGymExpGain,
    dexExp: dexExp * player.mults.dexterity_exp * BitNodeMultipliers.ClassGymExpGain,
    agiExp: agiExp * player.mults.agility_exp * BitNodeMultipliers.ClassGymExpGain,
    chaExp: chaExp * player.mults.charisma_exp * BitNodeMultipliers.ClassGymExpGain,
    intExp: 0,
  };
}
