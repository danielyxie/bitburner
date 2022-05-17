import { Factions } from "../../Faction/Factions";
import { LocationName } from "../../Locations/data/LocationNames";
import { Locations } from "../../Locations/Locations";
import { GetServer } from "../../Server/AllServers";
import { serverMetadata } from "../../Server/data/servers";
import { Server } from "../../Server/Server";
import { IRouter } from "../../ui/Router";
import { WorkType } from "../../Work/WorkType";
import { IPlayer } from "../IPlayer";

export function process(this: IPlayer, router: IRouter, numCycles = 1): void {
  // Working
  if (this.isWorking) {
    const workType = this.workManager.workType;
    const done = this.workManager.process(numCycles);

    if (done) {
      switch (workType) {
        case WorkType.Faction:
          router.toFaction(Factions[this.workManager.info.faction.factionName]);
          break;
        case WorkType.CreateProgram:
          router.toCreateProgram();
          break;
        case WorkType.StudyClass:
          router.toCity();
          break;
        case WorkType.Crime:
          router.toLocation(Locations[LocationName.Slums]);
          break;
        case WorkType.CompanyPartTime:
          router.toCity();
          break;
        case WorkType.GraftAugmentation:
          router.toGrafting();
          break;
        case WorkType.Company:
          router.toCity();
          break;
      }
    }
  }
}

export function cancelationPenalty(this: IPlayer): number {
  const data = serverMetadata.find((s) => s.specialName === this.companyName);
  if (!data) return 0.5; // Does not have special server.
  const server = GetServer(data.hostname);
  if (server instanceof Server) {
    if (server && server.backdoorInstalled) return 0.75;
  }

  return 0.5;
}

export function startFocusing(this: IPlayer): void {
  this.focus = true;
}

export function stopFocusing(this: IPlayer): void {
  this.focus = false;
}

export function getCompanyName(this: IPlayer): string {
  const workType = this.workManager.workType;
  return workType === WorkType.Company
    ? this.workManager.info.company.companyName
    : workType === WorkType.CompanyPartTime
    ? this.workManager.info.companyPartTime.companyName
    : "";
}

//Cancels the player's current "work" assignment and gives the proper rewards
//Used only for Singularity functions, so no popups are created
export function singularityStopWork(this: IPlayer): string {
  if (!this.isWorking) {
    return "";
  }
  const res = this.workManager.finish({ singularity: true, cancelled: true });
  if (!res) {
    console.error(`Unrecognized work type (${this.workType})`);
    return "";
  }
  return res;
}
