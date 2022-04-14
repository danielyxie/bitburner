import { FactionNames } from "../Faction/data/FactionNames";
import type { Faction } from "../Faction/Faction";
import { Factions } from "../Faction/Factions";
import type { IPlayer } from "../PersonObjects/IPlayer";
import { GetServer } from "../Server/AllServers";

import type { Milestone } from "./Milestone";

function allFactionAugs(p: IPlayer, f: Faction): boolean {
  const factionAugs = f.augmentations.slice().filter((aug) => aug !== "NeuroFlux Governor");
  for (const factionAug of factionAugs) {
    if (
      !p.augmentations.some((aug) => {
        return aug.name == factionAug;
      })
    )
      return false;
  }
  return true;
}

export const Milestones: Milestone[] = [
  {
    title: "Gain root access on CSEC",
    fulfilled: (): boolean => {
      const server = GetServer("CSEC");
      if (!server || !server.hasOwnProperty("hasAdminRights")) return false;
      return (server as any).hasAdminRights;
    },
  },
  {
    title: "Install the backdoor on CSEC",
    fulfilled: (): boolean => {
      const server = GetServer("CSEC");
      if (!server || !server.hasOwnProperty("backdoorInstalled")) return false;
      return (server as any).backdoorInstalled;
    },
  },
  {
    title: "Join the faction hinted at in csec-test.msg",
    fulfilled: (p: IPlayer): boolean => {
      return p.factions.includes(FactionNames.CyberSec);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.CyberSec}`,
    fulfilled: (p: IPlayer): boolean => {
      return allFactionAugs(p, Factions[FactionNames.CyberSec]);
    },
  },
  {
    title: "Join the faction hinted at in nitesec-test.msg",
    fulfilled: (p: IPlayer): boolean => {
      return p.factions.includes(FactionNames.NiteSec);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.NiteSec}`,
    fulfilled: (p: IPlayer): boolean => {
      return allFactionAugs(p, Factions[FactionNames.NiteSec]);
    },
  },
  {
    title: "Join the faction hinted at in j3.msg",
    fulfilled: (p: IPlayer): boolean => {
      return p.factions.includes(FactionNames.TheBlackHand);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.TheBlackHand}`,
    fulfilled: (p: IPlayer): boolean => {
      return allFactionAugs(p, Factions[FactionNames.TheBlackHand]);
    },
  },
  {
    title: "Join the faction hinted at in 19dfj3l1nd.msg",
    fulfilled: (p: IPlayer): boolean => {
      return p.factions.includes(FactionNames.BitRunners);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.BitRunners}`,
    fulfilled: (p: IPlayer): boolean => {
      return allFactionAugs(p, Factions[FactionNames.BitRunners]);
    },
  },
  {
    title: "Complete fl1ght.exe",
    fulfilled: (p: IPlayer): boolean => {
      // technically wrong but whatever
      return p.factions.includes(FactionNames.Daedalus);
    },
  },
  {
    title: `Install the special Augmentation from ${FactionNames.Daedalus}`,
    fulfilled: (p: IPlayer): boolean => {
      return p.augmentations.some((aug) => aug.name == "The Red Pill");
    },
  },
  {
    title: "Install the final backdoor and free yourself.",
    fulfilled: (): boolean => {
      return false;
    },
  },
];
