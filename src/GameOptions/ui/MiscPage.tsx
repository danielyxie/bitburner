import React from "react";
import { Settings } from "../../Settings/Settings";
import { OptionSwitch } from "../../ui/React/OptionSwitch";
import { GameOptionsPage } from "./GameOptionsPage";

export const MiscPage = (): React.ReactElement => {
  return (
    <GameOptionsPage title="Misc">
      <OptionSwitch
        checked={Settings.DisableHotkeys}
        onChange={(newValue) => (Settings.DisableHotkeys = newValue)}
        text="Disable hotkeys"
        tooltip={
          <>
            If this is set, then most hotkeys (keyboard shortcuts) in the game are disabled. This includes Terminal
            commands, hotkeys to navigate between different parts of the game, and the "Save and Close (Ctrl + b)"
            hotkey in the Text Editor.
          </>
        }
      />
      <br />
      <OptionSwitch
        checked={Settings.EnableBashHotkeys}
        onChange={(newValue) => (Settings.EnableBashHotkeys = newValue)}
        text="Enable bash hotkeys"
        tooltip={
          <>
            Improved Bash emulation mode. Setting this to 1 enables several new Terminal shortcuts and features that
            more closely resemble a real Bash-style shell. Note that when this mode is enabled, the default browser
            shortcuts are overriden by the new Bash shortcuts.
          </>
        }
      />
    </GameOptionsPage>
  );
};
