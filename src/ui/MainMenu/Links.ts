// Get references to the Main Menu link DOM elements
// Does NOT include collapsible headers for the links
import { clearEventListeners } from "../../../utils/uiHelpers/clearEventListeners";

interface IMainMenuLinks {
  [key: string]: HTMLElement | undefined;
  Terminal: HTMLElement;
  ScriptEditor: HTMLElement;
  ActiveScripts: HTMLElement;
  CreateProgram: HTMLElement;
  Stats: HTMLElement;
  Factions: HTMLElement;
  Augmentations: HTMLElement;
  HacknetNodes: HTMLElement;
  Sleeves: HTMLElement;
  City: HTMLElement;
  Travel: HTMLElement;
  Job: HTMLElement;
  StockMarket: HTMLElement;
  Bladeburner: HTMLElement;
  Corporation: HTMLElement;
  Gang: HTMLElement;
  Milestones: HTMLElement;
  Tutorial: HTMLElement;
  Options: HTMLElement;
  DevMenu: HTMLElement;
}

const emptyElement: HTMLElement = ((): HTMLElement => {
  const elem = document.createElement("div");
  if (elem === null) throw new Error("unable to create empty div element");
  return elem;
})();

export const MainMenuLinks: IMainMenuLinks = {
  Terminal: emptyElement,
  ScriptEditor: emptyElement,
  ActiveScripts: emptyElement,
  CreateProgram: emptyElement,
  Stats: emptyElement,
  Factions: emptyElement,
  Augmentations: emptyElement,
  HacknetNodes: emptyElement,
  Sleeves: emptyElement,
  City: emptyElement,
  Travel: emptyElement,
  Job: emptyElement,
  StockMarket: emptyElement,
  Bladeburner: emptyElement,
  Corporation: emptyElement,
  Gang: emptyElement,
  Milestones: emptyElement,
  Tutorial: emptyElement,
  Options: emptyElement,
  DevMenu: emptyElement,
};

export function initializeMainMenuLinks(): boolean {
  try {
    function safeGetLink(id: string): HTMLElement {
      const elem: HTMLElement | null = clearEventListeners(id);
      if (elem == null) {
        throw new Error(`clearEventListeners() failed for element with id: ${id}`);
      }

      return elem;
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
    MainMenuLinks.Milestones = safeGetLink("milestones-menu-link");
    MainMenuLinks.Tutorial = safeGetLink("tutorial-menu-link");
    const op: HTMLElement | null = document.getElementById("options-menu-link");
    if (op === null) throw new Error(`Could not find element with id: "options-menu-link"`);
    MainMenuLinks.Options = op; // This click listener is already set, so don't clear it
    MainMenuLinks.DevMenu = safeGetLink("dev-menu-link");

    return true;
  } catch (e) {
    console.error(`Failed to initialize Main Menu Links: ${e}`);
    return false;
  }
}
