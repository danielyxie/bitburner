import { Milestone } from "./Milestone";
import { IMap } from "../types";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Factions } from "../Faction/Factions";
import { Faction } from "../Faction/Faction";
import { GetServerByHostname } from "../Server/ServerHelpers";

function allFactionAugs(p: IPlayer, f: Faction): boolean {
    const factionAugs = f.augmentations.slice().filter((aug)=> "NeuroFlux Governor" !== aug);
    for(const factionAug of factionAugs) {
        if(!p.augmentations.some(aug => {return aug.name == factionAug})) return false;
    }
    return true;
}

export const Milestones: Milestone[] = [
    new Milestone("Gain root access on CSEC",
        (p: IPlayer) => {
            const server = GetServerByHostname("CSEC");
            if(!server || !server.hasOwnProperty('hasAdminRights')) return false;
            return (server as any).hasAdminRights;
        }
    ),
    new Milestone("Install the backdoor on CSEC",
        (p: IPlayer) => {
            const server = GetServerByHostname("CSEC");
            if(!server || !server.hasOwnProperty('backdoorInstalled')) return false;
            return (server as any).backdoorInstalled;
        }
    ),
    new Milestone("Join the faction hinted at in j1.msg",
        (p: IPlayer) => {
            return p.factions.includes("CyberSec");
        }
    ),
    new Milestone("Install all the Augmentation from CSEC",
        (p: IPlayer) => {
            return allFactionAugs(p, Factions["CyberSec"]);
        }
    ),
    new Milestone("Join the faction hinted at in j2.msg",
        (p: IPlayer) => {
            return p.factions.includes("NiteSec");
        }
    ),
    new Milestone("Install all the Augmentation from NiteSec",
        (p: IPlayer) => {
            return allFactionAugs(p, Factions["NiteSec"]);
        }
    ),
    new Milestone("Join the faction hinted at in j3.msg",
        (p: IPlayer) => {
            return p.factions.includes("The Black Hand");
        }
    ),
    new Milestone("Install all the Augmentation from The Black Hand",
        (p: IPlayer) => {
            return allFactionAugs(p, Factions["The Black Hand"]);
        }
    ),
    new Milestone("Join the faction hinted at in j4.msg",
        (p: IPlayer) => {
            return p.factions.includes("BitRunners");
        }
    ),
    new Milestone("Install all the Augmentation from BitRunners",
        (p: IPlayer) => {
            return allFactionAugs(p, Factions["BitRunners"]);
        }
    ),
    new Milestone("Join the final faction",
        (p: IPlayer) => {
            return p.factions.includes("Daedalus");
        }
    ),
    new Milestone("Install the special Augmentation from Daedalus",
        (p: IPlayer) => {
            return p.augmentations.some(aug => aug.name == "The Red Pill")
        }
    ),
    new Milestone("Install the final backdoor and free yourself.", () => {
            return false;
        }
    ),
];