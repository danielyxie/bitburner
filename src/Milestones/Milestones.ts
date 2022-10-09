import { Milestone } from "./Milestone";
import { Player } from "@player";
import { Factions } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { GetServer } from "../Server/AllServers";
import { FactionNames } from "../Faction/data/FactionNames";
import { Server } from "../Server/Server";

function allFactionAugs(f: Faction): boolean {
  const factionAugs = f.augmentations.slice().filter((aug) => aug !== "NeuroFlux Governor");
  for (const factionAug of factionAugs) {
    if (
      !Player.augmentations.some((aug) => {
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
      return server instanceof Server && server.hasAdminRights;
    },
  },
  {
    title: "Install the backdoor on CSEC",
    fulfilled: (): boolean => {
      const server = GetServer("CSEC");
      if (!server || !server.hasOwnProperty("backdoorInstalled")) return false;
      return server instanceof Server && server.backdoorInstalled;
    },
  },
  {
    title: "Join the faction hinted at in csec-test.msg",
    fulfilled: (): boolean => {
      return Player.factions.includes(FactionNames.CyberSec);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.CyberSec}`,
    fulfilled: (): boolean => {
      return allFactionAugs(Factions[FactionNames.CyberSec]);
    },
  },
  {
    title: "Join the faction hinted at in nitesec-test.msg",
    fulfilled: (): boolean => {
      return Player.factions.includes(FactionNames.NiteSec);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.NiteSec}`,
    fulfilled: (): boolean => {
      return allFactionAugs(Factions[FactionNames.NiteSec]);
    },
  },
  {
    title: "Join the faction hinted at in j3.msg",
    fulfilled: (): boolean => {
      return Player.factions.includes(FactionNames.TheBlackHand);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.TheBlackHand}`,
    fulfilled: (): boolean => {
      return allFactionAugs(Factions[FactionNames.TheBlackHand]);
    },
  },
  {
    title: "Join the faction hinted at in 19dfj3l1nd.msg",
    fulfilled: (): boolean => {
      return Player.factions.includes(FactionNames.BitRunners);
    },
  },
  {
    title: `Install all the Augmentations from ${FactionNames.BitRunners}`,
    fulfilled: (): boolean => {
      return allFactionAugs(Factions[FactionNames.BitRunners]);
    },
  },
  {
    title: "Complete fl1ght.exe",
    fulfilled: (): boolean => {
      // technically wrong but whatever
      return Player.factions.includes(FactionNames.Daedalus);
    },
  },
  {
    title: `Install the special Augmentation from ${FactionNames.Daedalus}`,
    fulfilled: (): boolean => {
      return Player.augmentations.some((aug) => aug.name == "The Red Pill");
    },
  },
  {
    title: "Install the final backdoor and free yourself.",
    fulfilled: (): boolean => {
      return false;
    },
  },
];
