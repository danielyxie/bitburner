// Implement the collapsible main menu headers
import { IPlayer } from "../../PersonObjects/IPlayer";
import { MainMenuLinks } from "./Links";

interface IMainMenuHeaders {
    Hacking: HTMLElement | null;
    Character: HTMLElement | null;
    World: HTMLElement | null;
    Help: HTMLElement | null;
}

export const MainMenuHeaders: IMainMenuHeaders = {
    Hacking: null,
    Character: null,
    World: null,
    Help: null,
};

// Implements collapsible toggle feature when a header is clicked
function toggleHeader(open: boolean, elems: HTMLElement[], links: HTMLElement[]) {
    for (let i = 0; i < elems.length; ++i) {
        if (open) {
            elems[i].style.opacity = "1";
            elems[i].style.maxHeight = elems[i].scrollHeight + "px";
        } else {
            elems[i].style.opacity = "0";
            elems[i].style.maxHeight = null;
        }
    }

    for (let i = 0; i < links.length; ++i) {
        if (open) {
            links[i].style.opacity = "1";
            links[i].style.maxHeight = links[i].scrollHeight + "px";
            links[i].style.pointerEvents = "auto";
        } else {
            links[i].style.opacity = "0";
            links[i].style.maxHeight = null;
            links[i].style.pointerEvents = "none";
        }
    }
}

export function initializeMainMenuHeaders(p: IPlayer, dev: boolean= false): boolean {
    function safeGetElement(id: string): HTMLElement {
        const elem: HTMLElement | null = document.getElementById(id);
        if (elem == null) {
            throw new Error(`Failed to find element with id ${id} in initializeMainMenuHeaders()`);
        }

        return elem;
    }

    try {
        // Get references to the DOM elements
        MainMenuHeaders.Hacking = safeGetElement("hacking-menu-header");
        MainMenuHeaders.Character = safeGetElement("character-menu-header");
        MainMenuHeaders.World = safeGetElement("world-menu-header");
        MainMenuHeaders.Help = safeGetElement("help-menu-header");

        // Set click handlers to turn the headers into collapsibles
        MainMenuHeaders.Hacking.onclick = function() {
            const terminal: HTMLElement         = safeGetElement("terminal-tab");
            const createScript: HTMLElement     = safeGetElement("create-script-tab");
            const activeScripts: HTMLElement    = safeGetElement("active-scripts-tab");
            const createProgram: HTMLElement    = safeGetElement("create-program-tab");
            const createProgramNot: HTMLElement = safeGetElement("create-program-notification");

            createProgram.style.display = p.firstProgramAvailable ? "list-item" : "none";

            this.classList.toggle("opened");

            const elems: HTMLElement[] = [terminal, createScript, activeScripts, createProgram];
            const links: HTMLElement[] = [MainMenuLinks.Terminal!, MainMenuLinks.ScriptEditor!, MainMenuLinks.ActiveScripts!, MainMenuLinks.CreateProgram!];
            if (terminal.style.maxHeight) {
                toggleHeader(false, elems, links);
                createProgramNot.style.display = "none";
            } else {
                toggleHeader(true, elems, links);
                createProgramNot.style.display = "block";
            }
        };

        MainMenuHeaders.Character.onclick = function() {
            const stats: HTMLElement            = safeGetElement("stats-tab");
            const factions: HTMLElement         = safeGetElement("factions-tab");
            const augmentations: HTMLElement    = safeGetElement("augmentations-tab");
            const hacknetnodes: HTMLElement     = safeGetElement("hacknet-nodes-tab");
            const sleeves: HTMLElement          = safeGetElement("sleeves-tab");

            sleeves.style.display = p.sleeves.length > 0 ? "list-item" : "none";

            this.classList.toggle("opened");

            const elems: HTMLElement[] = [stats, factions, augmentations, hacknetnodes, sleeves];
            const links: HTMLElement[] = [MainMenuLinks.Stats!, MainMenuLinks.Factions!, MainMenuLinks.Augmentations!, MainMenuLinks.HacknetNodes!, MainMenuLinks.Sleeves!];
            if (stats.style.maxHeight) {
                toggleHeader(false, elems, links);
            } else {
                toggleHeader(true, elems, links);
            }
        };

        MainMenuHeaders.World.onclick = function() {
            const city: HTMLElement         = safeGetElement("city-tab");
            const travel: HTMLElement       = safeGetElement("travel-tab");
            const job: HTMLElement          = safeGetElement("job-tab");
            const stockmarket: HTMLElement  = safeGetElement("stock-market-tab");
            const bladeburner: HTMLElement  = safeGetElement("bladeburner-tab");
            const corporation: HTMLElement  = safeGetElement("corporation-tab");
            const gang: HTMLElement         = safeGetElement("gang-tab");

            // Determine whether certain links should show up
            job.style.display           = p.companyName !== ""                 ? "list-item" : "none";
            stockmarket.style.display   = p.hasWseAccount                      ? "list-item" : "none";
            bladeburner.style.display   = p.inBladeburner()                    ? "list-item" : "none";
            corporation.style.display   = p.hasCorporation()                   ? "list-item" : "none";
            gang.style.display          = p.inGang()                           ? "list-item" : "none";

            this.classList.toggle("opened");

            const elems: HTMLElement[] = [city, travel, job, stockmarket, bladeburner, corporation, gang];
            const links: HTMLElement[] = [MainMenuLinks.City!, MainMenuLinks.Travel!, MainMenuLinks.Job!, MainMenuLinks.StockMarket!, MainMenuLinks.Bladeburner!, MainMenuLinks.Corporation!, MainMenuLinks.Gang!];
            if (city.style.maxHeight) {
                toggleHeader(false, elems, links);
            } else {
                toggleHeader(true, elems, links);
            }
        };

        MainMenuHeaders.Help.onclick = function() {
            const tutorial: HTMLElement = safeGetElement("tutorial-tab");
            const options: HTMLElement  = safeGetElement("options-tab");

            this.classList.toggle("opened");

            const elems: HTMLElement[] = [tutorial, options];
            const links: HTMLElement[] = [MainMenuLinks.Tutorial!, MainMenuLinks.Options!];

            if (dev) {
                elems.push(safeGetElement("dev-tab"));
                links.push(safeGetElement("dev-menu-link"));
            }

            if (tutorial.style.maxHeight) {
                toggleHeader(false, elems, links);
            } else {
                toggleHeader(true, elems, links);
            }
        };

        return true;
    } catch (e) {
        console.error(`Failed to initialize Main Menu Headers: ${e}`);
        return false;
    }
}
