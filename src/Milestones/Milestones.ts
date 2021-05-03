import { Milestone } from "./Milestone";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Factions } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { GetServerByHostname } from "../Server/ServerHelpers";

function allFactionAugs(p: IPlayer, f: Faction): boolean {
    const factionAugs = f.augmentations.slice().filter((aug)=> aug !== "NeuroFlux Governor");
    for(const factionAug of factionAugs) {
        if(!p.augmentations.some(aug => {return aug.name == factionAug})) return false;
    }
    return true;
}

export const Milestones: Milestone[] = [
    {
        title: "Gain root access on CSEC",
        fulfilled: (): boolean => {
            const server = GetServerByHostname("CSEC");
            if(!server || !server.hasOwnProperty('hasAdminRights')) return false;
            return (server as any).hasAdminRights;
        },
    },
    {
        title: "Install the backdoor on CSEC",
        fulfilled: (): boolean => {
            const server = GetServerByHostname("CSEC");
            if(!server || !server.hasOwnProperty('backdoorInstalled')) return false;
            return (server as any).backdoorInstalled;
        },
    },
    {
        title: "Join the faction hinted at in j1.msg",
        fulfilled: (p: IPlayer): boolean => {
            return p.factions.includes("CyberSec");
        },
    },
    {
        title: "Install all the Augmentations from CSEC",
        fulfilled: (p: IPlayer): boolean => {
            return allFactionAugs(p, Factions["CyberSec"]);
        },
    },
    {
        title: "Join the faction hinted at in j2.msg",
        fulfilled: (p: IPlayer): boolean => {
            return p.factions.includes("NiteSec");
        },
    },
    {
        title: "Install all the Augmentations from NiteSec",
        fulfilled: (p: IPlayer): boolean => {
            return allFactionAugs(p, Factions["NiteSec"]);
        },
    },
    {
        title: "Join the faction hinted at in j3.msg",
        fulfilled: (p: IPlayer): boolean => {
            return p.factions.includes("The Black Hand");
        },
    },
    {
        title: "Install all the Augmentations from The Black Hand",
        fulfilled: (p: IPlayer): boolean => {
            return allFactionAugs(p, Factions["The Black Hand"]);
        },
    },
    {
        title: "Join the faction hinted at in j4.msg",
        fulfilled: (p: IPlayer): boolean => {
            return p.factions.includes("BitRunners");
        },
    },
    {
        title: "Install all the Augmentations from BitRunners",
        fulfilled: (p: IPlayer): boolean => {
            return allFactionAugs(p, Factions["BitRunners"]);
        },
    },
    {
        title: "Join the final faction",
        fulfilled: (p: IPlayer): boolean => {
            return p.factions.includes("Daedalus");
        },
    },
    {
        title: "Install the special Augmentation from Daedalus",
        fulfilled: (p: IPlayer): boolean => {
            return p.augmentations.some(aug => aug.name == "The Red Pill")
        },
    },
    {
        title: "Install the final backdoor and free yourself.",
        fulfilled: (): boolean => {
            return false;
        },
    },
];