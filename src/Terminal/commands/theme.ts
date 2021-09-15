import { ITerminal } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";
import { FconfSettings } from "../../Fconf/FconfSettings";

export function theme(
  terminal: ITerminal,
  engine: IEngine,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 1 && args.length !== 3) {
    terminal.error("Incorrect number of arguments.");
    terminal.error(
      "Usage: theme [default|muted|solarized] | #[background color hex] #[text color hex] #[highlight color hex]",
    );
  } else if (args.length === 1) {
    const themeName = args[0];
    if (themeName == "default") {
      document.body.style.setProperty("--my-highlight-color", "#ffffff");
      document.body.style.setProperty("--my-font-color", "#66ff33");
      document.body.style.setProperty("--my-background-color", "#000000");
      document.body.style.setProperty("--my-prompt-color", "#f92672");
    } else if (themeName == "muted") {
      document.body.style.setProperty("--my-highlight-color", "#ffffff");
      document.body.style.setProperty("--my-font-color", "#66ff33");
      document.body.style.setProperty("--my-background-color", "#252527");
    } else if (themeName == "solarized") {
      document.body.style.setProperty("--my-highlight-color", "#6c71c4");
      document.body.style.setProperty("--my-font-color", "#839496");
      document.body.style.setProperty("--my-background-color", "#002b36");
    } else {
      return terminal.error("Theme not found");
    }
    FconfSettings.THEME_HIGHLIGHT_COLOR = document.body.style.getPropertyValue("--my-highlight-color");
    FconfSettings.THEME_FONT_COLOR = document.body.style.getPropertyValue("--my-font-color");
    FconfSettings.THEME_BACKGROUND_COLOR = document.body.style.getPropertyValue("--my-background-color");
    FconfSettings.THEME_PROMPT_COLOR = document.body.style.getPropertyValue("--my-prompt-color");
  } else {
    const inputBackgroundHex = args[0] + "";
    const inputTextHex = args[1] + "";
    const inputHighlightHex = args[2] + "";
    if (
      /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputBackgroundHex) &&
      /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputTextHex) &&
      /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(inputHighlightHex)
    ) {
      document.body.style.setProperty("--my-highlight-color", inputHighlightHex);
      document.body.style.setProperty("--my-font-color", inputTextHex);
      document.body.style.setProperty("--my-background-color", inputBackgroundHex);
      FconfSettings.THEME_HIGHLIGHT_COLOR = document.body.style.getPropertyValue("--my-highlight-color");
      FconfSettings.THEME_FONT_COLOR = document.body.style.getPropertyValue("--my-font-color");
      FconfSettings.THEME_BACKGROUND_COLOR = document.body.style.getPropertyValue("--my-background-color");
    } else {
      return terminal.error("Invalid Hex Input for theme");
    }
  }
}
