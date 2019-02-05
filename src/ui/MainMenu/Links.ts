// Get references to the Main Menu link DOM elements
// Does NOT include collapsible headers for the links
import { clearEventListeners } from "../../../utils/uiHelpers/clearEventListeners";

interface IMainMenuLinks {
    Terminal:       HTMLElement | null;
    ScriptEditor:   HTMLElement | null;
    ActiveScripts:  HTMLElement | null;
    CreateProgram:  HTMLElement | null;
    Stats:          HTMLElement | null;
    Factions:       HTMLElement | null;
    Augmentations:  HTMLElement | null;
    HacknetNodes:   HTMLElement | null;
    Sleeves:        HTMLElement | null;
    City:           HTMLElement | null;
    Travel:         HTMLElement | null;
    Job:            HTMLElement | null;
    StockMarket:    HTMLElement | null;
    Bladeburner:    HTMLElement | null;
    Corporation:    HTMLElement | null;
    Gang:           HTMLElement | null;
    Tutorial:       HTMLElement | null;
    Options:        HTMLElement | null;
    DevMenu:        HTMLElement | null;
}

export const MainMenuLinks: IMainMenuLinks = {
    Terminal: null,
    ScriptEditor: null,
    ActiveScripts: null,
    CreateProgram: null,
    Stats: null,
    Factions: null,
    Augmentations: null,
    HacknetNodes: null,
    Sleeves: null,
    City: null,
    Travel: null,
    Job: null,
    StockMarket: null,
    Bladeburner: null,
    Corporation: null,
    Gang: null,
    Tutorial: null,
    Options: null,
    DevMenu: null,
}

export function initializeMainMenuLinks(): boolean {
    try {
        function safeGetLink(id: string): HTMLElement {
            const elem: HTMLElement | null = clearEventListeners(id);
            if (elem == null) {
                throw new Error(`clearEventListeners() failed for element with id: ${id}`);
            }

            return elem!;
        }

        MainMenuLinks.Terminal = safeGetLink("terminal-menu-link");
        MainMenuLinks.ScriptEditor = safeGetLink("create-script-menu-link");
        MainMenuLinks.ActiveScripts = safeGetLink("active-scripts-menu-link");
        MainMenuLinks.CreateProgram = safeGetLink("create-program-menu-link");
        MainMenuLinks.Stats = safeGetLink("stats-menu-link");
        MainMenuLinks.Factions = safeGetLink("factions-menu-link");
        MainMenuLinks.Augmentations = safeGetLink("augmentations-menu-link");
        MainMenuLinks.HacknetNodes = safeGetLink("hacknet-nodes-menu-link");
        MainMenuLinks.Sleeves = safeGetLink("sleeves-menu-link");
        MainMenuLinks.City = safeGetLink("city-menu-link");
        MainMenuLinks.Travel = safeGetLink("travel-menu-link");
        MainMenuLinks.Job = safeGetLink("job-menu-link");
        MainMenuLinks.StockMarket = safeGetLink("stock-market-menu-link");
        MainMenuLinks.Bladeburner = safeGetLink("bladeburner-menu-link");
        MainMenuLinks.Corporation = safeGetLink("corporation-menu-link");
        MainMenuLinks.Gang = safeGetLink("gang-menu-link");
        MainMenuLinks.Tutorial = safeGetLink("tutorial-menu-link");
        MainMenuLinks.Options = document.getElementById("options-menu-link"); // This click listener is already set, so don't clear it
        MainMenuLinks.DevMenu = safeGetLink("dev-menu-link");

        return true;
    } catch(e) {
        console.error(`Failed to initialize Main Menu Links: ${e}`);
        return false;
    }
}
