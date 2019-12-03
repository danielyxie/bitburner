import { BaseServer } from "../BaseServer";
import {registerExecutable, ManualEntry, fetchUsage} from "./sys";
import { FconfSettings } from "../../Fconf/FconfSettings";

export function theme(server:BaseServer, term:any, out:Function, err:Function, args:string[], options:any={}){
    if (args.length !== 1 && args.length !== 3) {
        err("Incorrect number of arguments.");
        err("Usage: theme FCONF_FILE | #[background color hex] #[text color hex] #[highlight color hex]");
    } else if(args.length === 1){
        var themeName = args[0];

        if (themeName == "default"){
            document.body.style.setProperty('--my-highlight-color',"#ffffff");
            document.body.style.setProperty('--my-font-color',"#66ff33");
            document.body.style.setProperty('--my-background-color',"#000000");
            document.body.style.setProperty('--my-prompt-color', "#f92672");
        } else if (themeName == "muted"){
            document.body.style.setProperty('--my-highlight-color',"#ffffff");
            document.body.style.setProperty('--my-font-color',"#66ff33");
            document.body.style.setProperty('--my-background-color',"#252527");
        } else if (themeName == "solarized"){
            document.body.style.setProperty('--my-highlight-color',"#6c71c4");
            document.body.style.setProperty('--my-font-color',"#839496");
            document.body.style.setProperty('--my-background-color',"#002b36");
        } else {
            return err("Theme not found");
        }
        FconfSettings.THEME_HIGHLIGHT_COLOR = document.body.style.getPropertyValue("--my-highlight-color");
        FconfSettings.THEME_FONT_COLOR = document.body.style.getPropertyValue("--my-font-color");
        FconfSettings.THEME_BACKGROUND_COLOR = document.body.style.getPropertyValue("--my-background-color");
        FconfSettings.THEME_PROMPT_COLOR = document.body.style.getPropertyValue("--my-prompt-color");
    } else {
        var inputBackgroundHex = args[0];
        var inputTextHex = args[1];
        var inputHighlightHex = args[2];
        if (/(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputBackgroundHex) &&
        /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputTextHex) &&
        /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputHighlightHex)){
            document.body.style.setProperty('--my-highlight-color',inputHighlightHex);
            document.body.style.setProperty('--my-font-color',inputTextHex);
            document.body.style.setProperty('--my-background-color',inputBackgroundHex);
            FconfSettings.THEME_HIGHLIGHT_COLOR = document.body.style.getPropertyValue("--my-highlight-color");
            FconfSettings.THEME_FONT_COLOR = document.body.style.getPropertyValue("--my-font-color");
            FconfSettings.THEME_BACKGROUND_COLOR = document.body.style.getPropertyValue("--my-background-color");
        } else {
            return err("Invalid Hex Input for theme");
        }
    }
}

const MANUAL = new ManualEntry(
`theme - change the color of the user interface`,
`theme [preset] | [#background #text #highlight]`,
`Change the color of the user interface

This command can be called with a preset theme. Currently,
the supported presets are 'default', 'muted', and 'solarized'.
However, you can also specify your own color scheme using hex
values. To do so, you must specify three hex color values for
the background color, the text color, and the highlight color.
These hex values must be preceded by a pound sign (#) and must
be either 3 or 6 digits. Example:

    theme #ffffff #385 #235012

A color picker such as Google's can be used to get your desired
hex color values

Themes are not saved, so when the game is closed and then re-
opened or reloaded then it will revert back to the default theme.`)

registerExecutable("theme", theme, MANUAL);
