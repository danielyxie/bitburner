import {parse, Node}                            from "../utils/acorn";
import {dialogBoxCreate}                        from "../utils/DialogBox";

var FconfSettings = {
    ENABLE_BASH_HOTKEYS:        false,
    ENABLE_TIMESTAMPS:          false,
    MAIN_MENU_STYLE:            "default",
    THEME_BACKGROUND_COLOR:     "#000000",
    THEME_FONT_COLOR:           "#66ff33",
    THEME_HIGHLIGHT_COLOR:      "#ffffff",
    THEME_PROMPT_COLOR:         "#f92672",
    WRAP_INPUT:                 false,
}

var FconfComments = {
    ENABLE_BASH_HOTKEYS: "Improved Bash emulation mode. Setting this to 1 enables several\n" +
                         "new Terminal shortcuts and features that more closely resemble\n" +
                         "a real Bash-style shell. Note that when this mode is enabled,\n"  +
                         "the default browser shortcuts are overriden by the new Bash\n" +
                         "shortcuts.\n\n" +
                         "To see a full list of the Terminal shortcuts that this enables, see:\n" +
                         "http://bitburner.readthedocs.io/en/latest/shortcuts.html",
    ENABLE_TIMESTAMPS: "Terminal commands and log entries will be timestamped. The timestamp\n" +
                       "will have the format: M/D h:m",
    MAIN_MENU_STYLE: "Customize the main navigation menu on the left-hand side. Current options:\n\n" +
                     "default, classic",
    THEME_BACKGROUND_COLOR: "Sets the background color for not only the Terminal, but also for\n" +
                            "most of the game's UI.\n\n" +
                            "The color must be specified as a pound sign (#) followed by a \n" +
                            "3-digit or 6-digit hex color code (e.g. #123456). Default color: #000000",
    THEME_FONT_COLOR: "Sets the font color for not only the Terminal, but also for\n" +
                      "most of the game's UI.\n\n" +
                      "The color must be specified as a pound sign (#) followed by a \n" +
                      "3-digit or 6-digit hex color code (e.g. #123456). Default color: #66ff33",
    THEME_HIGHLIGHT_COLOR: "Sets the highlight color for not only the Terminal, but also for \n" +
                           "most of the game's UI.\n\n" +
                           "The color must be specified as a pound sign (#) followed by a \n" +
                           "3-digit or 6-digit hex color code (e.g. #123456). Default color: #ffffff",
    THEME_PROMPT_COLOR: "Sets the prompt color in the Terminal\n\n" +
                        "The color must be specified as a pound sign (#) followed by a \n" +
                        "3-digit or 6-digit hex color code (e.g. #123456). Default color: #f92672",
    WRAP_INPUT: "Wrap Terminal Input. If this is enabled, then when a Terminal command is\n" +
                "too long and overflows, then it will wrap to the next line instead of\n" +
                "side-scrolling\n\n" +
                "Note that after you enable/disable this, you'll have to run a command\n" +
                "before its effect takes place.",
}

const MainMenuStyleOptions = ["default", "classic"];

//Parse Fconf settings from the config text
//Throws an exception if parsing fails
function parseFconfSettings(config) {
    var ast = parse(config, {sourceType:"module"});
    var queue = [];
    queue.push(ast);
    while (queue.length != 0) {
        var exp = queue.shift();
        switch (exp.type) {
            case "BlockStatement":
            case "Program":
                for (var i = 0; i < exp.body.length; ++i) {
                    if (exp.body[i] instanceof Node) {
                        queue.push(exp.body[i]);
                    }
                }
                break;
            case "AssignmentExpression":
                var setting, value;
                if (exp.left != null && exp.left.name != null) {
                    setting = exp.left.name;
                } else {
                    break;
                }
                if (exp.right != null && exp.right.raw != null) {
                    value = exp.right.raw;
                } else {
                    break;
                }
                parseFconfSetting(setting, value);
                break;
            default:
                break;
        }

        for (var prop in exp) {
            if (exp.hasOwnProperty(prop)) {
                if (exp[prop] instanceof Node) {
                    queue.push(exp[prop]);
                }
            }
        }
    }

    setTheme();
    setMainMenuStyle();
}

function parseFconfSetting(setting, value) {
    setting = String(setting);
    value = String(value);
    if (setting == null || value == null || FconfSettings[setting] == null) {
        console.log("WARNING: Invalid .fconf setting: " + setting);
        return;
    }

    function sanitizeString(value) {
        value = value.toLowerCase();
        if (value.startsWith('"')) { value = value.slice(1); }
        if (value.endsWith('"')) { value = value.slice(0, -1); }
        return value;
    }

    switch(setting) {
        case "ENABLE_BASH_HOTKEYS":
        case "ENABLE_TIMESTAMPS":
        case "WRAP_INPUT":
            // Need to convert entered value to boolean/strings accordingly
            var value = value.toLowerCase();
            if (value === "1" || value === "true" || value === "y") {
                value = true;
            } else {
                value = false;
            }
            FconfSettings[setting] = value;
            break;
        case "MAIN_MENU_STYLE":
            var value = sanitizeString(value);
            if (MainMenuStyleOptions.includes(value)) {
                FconfSettings[setting] = value;
            } else {
                dialogBoxCreate(`Invalid option specified for ${setting}. Options: ${MainMenuStyleOptions.toString()}`);
            }
            break;
        case "THEME_BACKGROUND_COLOR":
        case "THEME_FONT_COLOR":
        case "THEME_HIGHLIGHT_COLOR":
        case "THEME_PROMPT_COLOR":
            var value = sanitizeString(value);
            if ((/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(value))) {
                FconfSettings[setting] = value;
            } else {
                dialogBoxCreate(`Invalid color specified for ${setting}. Must be a hex color code preceded by a pound (#)`);
            }
            break;
        default:
            break;
    }
}

//Create the .fconf file text from the settings
function createFconf() {
    var res = "";
    for (var setting in FconfSettings) {
        if (FconfSettings.hasOwnProperty(setting)) {
            //Setting comments (description)
            var comment = FconfComments[setting];
            if (comment == null) {continue;}
            var comment = comment.split("\n");
            for (var i = 0; i < comment.length; ++i) {
                res += ("//" + comment[i] + "\n");
            }

            var value = 0;
            if (FconfSettings[setting] === true) {
                value = "1";
            } else if (FconfSettings[setting] === false) {
                value = "0";
            } else {
                value = '"' + String(FconfSettings[setting]) + '"';
            }
            res += (`${setting} = ${value}\n\n`);
        }
    }
    return res;
}

function loadFconf(saveString) {
    let tempFconfSettings = JSON.parse(saveString);
    for (var setting in tempFconfSettings) {
        if (tempFconfSettings.hasOwnProperty(setting)) {
            FconfSettings[setting] = tempFconfSettings[setting];
        }
    }

    // Initialize themes/styles after loading
    setTheme();
    setMainMenuStyle();
}

function setTheme() {
    if (FconfSettings.THEME_HIGHLIGHT_COLOR == null ||
        FconfSettings.THEME_FONT_COLOR == null ||
        FconfSettings.THEME_BACKGROUND_COLOR == null ||
        FconfSettings.THEME_PROMPT_COLOR == null) {
        console.log("ERROR: Cannot find Theme Settings");
        return;
    }
    if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(FconfSettings.THEME_HIGHLIGHT_COLOR) &&
        /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(FconfSettings.THEME_FONT_COLOR) &&
        /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(FconfSettings.THEME_BACKGROUND_COLOR) &&
        /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(FconfSettings.THEME_PROMPT_COLOR)) {
        document.body.style.setProperty('--my-highlight-color', FconfSettings.THEME_HIGHLIGHT_COLOR);
        document.body.style.setProperty('--my-font-color', FconfSettings.THEME_FONT_COLOR);
        document.body.style.setProperty('--my-background-color', FconfSettings.THEME_BACKGROUND_COLOR);
        document.body.style.setProperty('--my-prompt-color', FconfSettings.THEME_PROMPT_COLOR);
    }
}

function setMainMenuStyle() {
    const mainMenu          = document.getElementById("mainmenu");
    const hackingMenuHdr    = document.getElementById("hacking-menu-header");
    const characterMenuHdr  = document.getElementById("character-menu-header");
    const worldMenuHdr      = document.getElementById("world-menu-header");
    const helpMenuHdr       = document.getElementById("help-menu-header");

    function removeAllAccordionHeaderClasses() {
        hackingMenuHdr.classList.remove("mainmenu-accordion-header", "mainmenu-accordion-header-classic");
        characterMenuHdr.classList.remove("mainmenu-accordion-header", "mainmenu-accordion-header-classic");
        worldMenuHdr.classList.remove("mainmenu-accordion-header", "mainmenu-accordion-header-classic");
        helpMenuHdr.classList.remove("mainmenu-accordion-header", "mainmenu-accordion-header-classic");
    }

    function addClassToAllAccordionHeaders(clsName) {
        hackingMenuHdr.classList.add(clsName);
        characterMenuHdr.classList.add(clsName);
        worldMenuHdr.classList.add(clsName);
        helpMenuHdr.classList.add(clsName);
    }

    if (FconfSettings["MAIN_MENU_STYLE"] === "default") {
        removeAllAccordionHeaderClasses();
        mainMenu.classList.remove("classic");
        addClassToAllAccordionHeaders("mainmenu-accordion-header");

    } else if (FconfSettings["MAIN_MENU_STYLE"] === "classic") {
        removeAllAccordionHeaderClasses();
        mainMenu.classList.add("classic");
        addClassToAllAccordionHeaders("mainmenu-accordion-header-classic");
    } else {
        return;
    }

    // Click each header twice to reset lol
    hackingMenuHdr.click(); hackingMenuHdr.click();
    characterMenuHdr.click(); characterMenuHdr.click();
    worldMenuHdr.click(); worldMenuHdr.click();
    helpMenuHdr.click(); helpMenuHdr.click();
}

export {FconfSettings, createFconf, parseFconfSettings, loadFconf}
