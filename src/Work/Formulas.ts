import { BitNodeMultipliers } from "../BitNode/BitNodeMultipliers";
import { Crime } from "../Crime/Crime";
import { newWorkStats, scaleWorkStats, WorkStats, multWorkStats } from "./WorkStats";
import { Person as IPerson } from "../ScriptEditor/NetscriptDefinitions";
import { CONSTANTS } from "../Constants";
import { FactionWorkType, GymType } from "../utils/enums";
import {
  getFactionFieldWorkRepGain,
  getFactionSecurityWorkRepGain,
  getHackingWorkRepGain,
} from "../PersonObjects/formulas/reputation";
import { Locations } from "../Locations/Locations";
import { Location } from "../Locations/Location";
import { Player } from "@player";
import { Class, Classes, ClassType } from "./ClassWork";
import { Server } from "../Server/Server";
import { GetServer } from "../Server/AllServers";
import { serverMetadata } from "../Server/data/servers";
import { LocationName } from "../Locations/data/LocationNames";
import { Company } from "../Company/Company";
import { CompanyPosition } from "../Company/CompanyPosition";
import { checkEnum } from "../utils/helpers/enum";

const gameCPS = 1000 / CONSTANTS._idleSpeed; // 5 cycles per second
export const FactionWorkStats: Record<FactionWorkType, WorkStats> = {
  [FactionWorkType.hacking]: newWorkStats({ hackExp: 15 }),
  [FactionWorkType.field]: newWorkStats({
    hackExp: 10,
    strExp: 10,
    defExp: 10,
    dexExp: 10,
    agiExp: 10,
    chaExp: 10,
  }),
  [FactionWorkType.security]: newWorkStats({
    hackExp: 5,
    strExp: 15,
    defExp: 15,
    dexExp: 15,
    agiExp: 15,
  }),
};

export function calculateCrimeWorkStats(person: IPerson, crime: Crime): WorkStats {
  const gains = scaleWorkStats(
    multWorkStats(
      //Todo: rework crime and workstats interfaces to use the same naming convention for exp values, then we can just make a workStats directly from a crime.
      newWorkStats({
        money: crime.money,
        hackExp: crime.hacking_exp,
        strExp: crime.strength_exp,
        defExp: crime.defense_exp,
        dexExp: crime.dexterity_exp,
        agiExp: crime.agility_exp,
        chaExp: crime.charisma_exp,
        intExp: crime.intelligence_exp,
      }),
      person.mults,
      person.mults.crime_money * BitNodeMultipliers.CrimeMoney,
    ),
    BitNodeMultipliers.CrimeExpGain,
    false,
  );
  return gains;
}

/** @returns faction rep rate per cycle */
export const calculateFactionRep = (person: IPerson, type: FactionWorkType, favor: number): number => {
  const repFormulas = {
    [FactionWorkType.hacking]: getHackingWorkRepGain,
    [FactionWorkType.field]: getFactionFieldWorkRepGain,
    [FactionWorkType.security]: getFactionSecurityWorkRepGain,
  };
  return repFormulas[type](person, favor);
};

/** @returns per-cycle WorkStats */
export function calculateFactionExp(person: IPerson, type: FactionWorkType): WorkStats {
  return scaleWorkStats(
    multWorkStats(FactionWorkStats[type], person.mults),
    BitNodeMultipliers.FactionWorkExpGain / gameCPS,
  );
}

/** Calculate cost for a class */
export function calculateCost(classs: Class, location: Location): number {
  const serverMeta = serverMetadata.find((s) => s.specialName === location.name);
  const server = GetServer(serverMeta ? serverMeta.hostname : "");
  const discount = (server as Server).backdoorInstalled ? 0.9 : 1;
  return classs.earnings.money * location.costMult * discount;
}

/** @returns per-cycle WorkStats */
export function calculateClassEarnings(person: IPerson, type: ClassType, locationName: LocationName): WorkStats {
  const hashManager = Player.hashManager;
  const classs = Classes[type];
  const location = Locations[locationName];

  const hashMult = checkEnum(GymType, type) ? hashManager.getTrainingMult() : hashManager.getStudyMult();

  const earnings = multWorkStats(
    scaleWorkStats(classs.earnings, (location.expMult / gameCPS) * hashMult, false),
    person.mults,
  );
  earnings.money = calculateCost(classs, location) / gameCPS;
  return earnings;
}

/** @returns per-cycle WorkStats */
export const calculateCompanyWorkStats = (
  worker: IPerson,
  company: Company,
  companyPosition: CompanyPosition,
  favor: number,
): WorkStats => {
  // If player has SF-11, calculate salary multiplier from favor
  const favorMult = isNaN(favor) ? 1 : 1 + favor / 100;
  const bn11Mult = Player.sourceFileLvl(11) > 0 ? favorMult : 1;

  const gains = scaleWorkStats(
    multWorkStats(
      {
        money: companyPosition.baseSalary * company.salaryMultiplier * bn11Mult * BitNodeMultipliers.CompanyWorkMoney,
        hackExp: companyPosition.hackingExpGain,
        strExp: companyPosition.strengthExpGain,
        defExp: companyPosition.defenseExpGain,
        dexExp: companyPosition.dexterityExpGain,
        agiExp: companyPosition.agilityExpGain,
        chaExp: companyPosition.charismaExpGain,
      },
      worker.mults,
      worker.mults.work_money,
    ),
    company.expMultiplier * BitNodeMultipliers.CompanyWorkExpGain,
    false,
  );

  const jobPerformance = companyPosition.calculateJobPerformance(worker);

  gains.reputation = jobPerformance * worker.mults.company_rep * favorMult;

  return gains;
};
