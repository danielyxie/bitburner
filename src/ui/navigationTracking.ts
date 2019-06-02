/**
 * The full-screen page the player is currently be on.
 * These pages are mutually exclusive.
 */
export enum Page {
    /**
     * (Default) The terminal is where the player issues all commands, executes scripts, etc.
     */
    Terminal = "Terminal",

    /**
     * Displays most of the statistics about the player.
     */
    CharacterInfo = "CharacterInfo",

    /**
     * The console for editing Netscript files.
     */
    ScriptEditor = "ScriptEditor",

    /**
     * Monitor the scripts currently executing across the servers.
     */
    ActiveScripts = "ActiveScripts",

    /**
     * View, purchase, and upgrade Hacknet nodes.
     */
    HacknetNodes = "HacknetNodes",

    /**
     * The list of programs the player could potentially build.
     */
    CreateProgram = "CreateProgram",

    /**
     * The list of all factions, and invites, available to the player.
     */
    Factions = "Factions",

    /**
     * Information about a specific faction.
     */
    Faction = "Faction",

    /**
     * The list of installed, and yet-to-be installed, augmentations the player has purchased.
     */
    Augmentations = "Augmentations",

    /**
     * A collection of in-game material to learn about the game.
     */
    Tutorial = "Tutorial",

    /**
     * A collection of items to manipulate the state of the game. Useful for development.
     */
    DevMenu = "Dev Menu",

    /**
     * Visiting a location in the world
     */
    Location = "Location",

    /**
     * A blocking page to show the player they are currently doing some action (building a program, working, etc.).
     */
    workInProgress = "WorkInProgress",

    /**
     * A special screen to show the player they've reached a certain point in the game.
     */
    RedPill = "RedPill",

    /**
     * A special screen to show the player they've reached a certain point in the game.
     */
    CinematicText = "CinematicText",

    /**
     * Mini-game to infiltrate a company, gaining experience from successful progress.
     */
    Infiltration = "Infiltration",

    /**
     * View the in-game stock market.
     */
    StockMarket = "StockMarket",

    /**
     * Manage gang actions and members.
     */
    Gang = "Gang",

    /**
     * Perform missions for a Faction.
     */
    Mission = "Mission",

    /**
     * Manage a corporation.
     */
    Corporation = "Corporation",

    /**
     * Manage special Bladeburner activities.
     */
    Bladeburner = "Bladeburner",

    /**
     * Manage your Sleeves
     */
    Sleeves = "Sleeves",

    /**
     * Purchase Resleeves
     */
    Resleeves = "Re-sleeving",
}

/**
 * This class keeps track of player navigation/routing within the game.
 */
class Routing {
    /**
     * Tracking the what page the user is currently on.
     */
    private currentPage: Page | null = null;

    /**
     * Determines if the player is currently on the specified page.
     * @param page The page to compare against the current state.
     */
    isOn(page: Page) {
        return this.currentPage === page;
    }

    /**
     * Routes the player to the appropriate page.
     * @param page The page to navigate to.
     */
    navigateTo(page: Page) {
        this.currentPage = page;
    }
}

/**
 * The routing instance for tracking page navigation.
 */
export const routing: Routing = new Routing();
