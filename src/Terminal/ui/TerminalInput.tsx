import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import TextField from "@mui/material/TextField";
import Popper from "@mui/material/Popper";

import { KEY } from "../../utils/helpers/keyCodes";
import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { determineAllPossibilitiesForTabCompletion } from "../determineAllPossibilitiesForTabCompletion";
import { tabCompletion } from "../tabCompletion";
import { Settings } from "../../Settings/Settings";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textfield: {
      margin: theme.spacing(0),
    },
    input: {
      backgroundColor: theme.colors.backgroundprimary,
    },
    nopadding: {
      padding: theme.spacing(0),
    },
    preformatted: {
      whiteSpace: "pre-wrap",
      margin: theme.spacing(0),
    },
    list: {
      padding: theme.spacing(0),
      height: "100%",
    },
  }),
);

interface IProps {
  terminal: ITerminal;
  router: IRouter;
  player: IPlayer;
}
// Save command in case we de-load this screen.
let command = "";

export function TerminalInput({ terminal, router, player }: IProps): React.ReactElement {
  const terminalInput = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState(command);
  const [postUpdateValue, setPostUpdateValue] = useState<{ postUpdate: () => void } | null>();
  const [possibilities, setPossibilities] = useState<string[]>([]);
  const classes = useStyles();

  // If we have no data in the current terminal history, let's initialize it from the player save
  if (terminal.commandHistory.length === 0 && player.terminalCommandHistory.length > 0) {
    terminal.commandHistory = player.terminalCommandHistory;
    terminal.commandHistoryIndex = terminal.commandHistory.length;
  }

  // Need to run after state updates, for example if we need to move cursor
  // *after* we modify input
  useEffect(() => {
    if (postUpdateValue?.postUpdate) {
      postUpdateValue.postUpdate();
      setPostUpdateValue(null);
    }
  }, [postUpdateValue]);

  function saveValue(newValue: string, postUpdate?: () => void): void {
    command = newValue;
    setValue(newValue);

    if (postUpdate) {
      setPostUpdateValue({ postUpdate });
    }
  }

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>): void {
    saveValue(event.target.value);
    setPossibilities([]);
  }

  function modifyInput(mod: string): void {
    const ref = terminalInput.current;
    if (!ref) return;
    const inputLength = value.length;
    const start = ref.selectionStart;
    if (start === null) return;
    const inputText = ref.value;

    switch (mod.toLowerCase()) {
      case "backspace":
        if (start > 0 && start <= inputLength + 1) {
          saveValue(inputText.substr(0, start - 1) + inputText.substr(start));
        }
        break;
      case "deletewordbefore": // Delete rest of word before the cursor
        for (let delStart = start - 1; delStart > -2; --delStart) {
          if ((inputText.charAt(delStart) === KEY.SPACE || delStart === -1) && delStart !== start - 1) {
            saveValue(inputText.substr(0, delStart + 1) + inputText.substr(start), () => {
              // Move cursor to correct location
              // foo bar |baz bum --> foo |baz bum
              const ref = terminalInput.current;
              ref?.setSelectionRange(delStart + 1, delStart + 1);
            });
            return;
          }
        }
        break;
      case "deletewordafter": // Delete rest of word after the cursor, including trailing space
        for (let delStart = start + 1; delStart <= value.length + 1; ++delStart) {
          if (inputText.charAt(delStart) === KEY.SPACE || delStart === value.length + 1) {
            saveValue(inputText.substr(0, start) + inputText.substr(delStart + 1), () => {
              // Move cursor to correct location
              // foo bar |baz bum --> foo bar |bum
              const ref = terminalInput.current;
              ref?.setSelectionRange(start, start);
            });
            return;
          }
        }
        break;
      case "clearafter": // Deletes everything after cursor
        saveValue(inputText.substr(0, start));
        break;
      case "clearbefore": // Deletes everything before cursor
        saveValue(inputText.substr(start), () => moveTextCursor("home"));
        break;
    }
  }

  function moveTextCursor(loc: string): void {
    const ref = terminalInput.current;
    if (!ref) return;
    const inputLength = value.length;
    const start = ref.selectionStart;
    if (start === null) return;

    switch (loc.toLowerCase()) {
      case "home":
        ref.setSelectionRange(0, 0);
        break;
      case "end":
        ref.setSelectionRange(inputLength, inputLength);
        break;
      case "prevchar":
        if (start > 0) {
          ref.setSelectionRange(start - 1, start - 1);
        }
        break;
      case "prevword":
        for (let i = start - 2; i >= 0; --i) {
          if (ref.value.charAt(i) === KEY.SPACE) {
            ref.setSelectionRange(i + 1, i + 1);
            return;
          }
        }
        ref.setSelectionRange(0, 0);
        break;
      case "nextchar":
        ref.setSelectionRange(start + 1, start + 1);
        break;
      case "nextword":
        for (let i = start + 1; i <= inputLength; ++i) {
          if (ref.value.charAt(i) === KEY.SPACE) {
            ref.setSelectionRange(i, i);
            return;
          }
        }
        ref.setSelectionRange(inputLength, inputLength);
        break;
      default:
        console.warn("Invalid loc argument in Terminal.moveTextCursor()");
        break;
    }
  }

  // Catch all key inputs and redirect them to the terminal.
  useEffect(() => {
    function keyDown(this: Document, event: KeyboardEvent): void {
      if (terminal.contractOpen) return;
      if (terminal.action !== null && event.key === KEY.C && event.ctrlKey) {
        terminal.finishAction(router, player, true);
        return;
      }
      const ref = terminalInput.current;
      if (event.ctrlKey || event.metaKey) return;
      if (event.key === KEY.C && (event.ctrlKey || event.metaKey)) return; // trying to copy

      if (ref) ref.focus();
    }
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  });

  async function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): Promise<void> {
    // Run command.
    if (event.key === KEY.ENTER && value !== "") {
      event.preventDefault();
      terminal.print(`[${player.getCurrentServer().hostname} ~${terminal.cwd()}]> ${value}`);
      terminal.executeCommands(router, player, value);
      saveValue("");
      return;
    }

    // Autocomplete
    if (event.key === KEY.TAB && value !== "") {
      event.preventDefault();

      let copy = value;
      const semiColonIndex = copy.lastIndexOf(";");
      if (semiColonIndex !== -1) {
        copy = copy.slice(semiColonIndex + 1);
      }

      copy = copy.trim();
      copy = copy.replace(/\s\s+/g, " ");

      const commandArray = copy.split(" ");
      let index = commandArray.length - 2;
      if (index < -1) {
        index = 0;
      }
      const allPos = await determineAllPossibilitiesForTabCompletion(player, copy, index, terminal.cwd());
      if (allPos.length == 0) {
        return;
      }

      let arg = "";
      let command = "";
      if (commandArray.length == 0) {
        return;
      }
      if (commandArray.length == 1) {
        command = commandArray[0];
      } else if (commandArray.length == 2) {
        command = commandArray[0];
        arg = commandArray[1];
      } else if (commandArray.length == 3) {
        command = commandArray[0] + " " + commandArray[1];
        arg = commandArray[2];
      } else {
        arg = commandArray.pop() + "";
        command = commandArray.join(" ");
      }

      let newValue = tabCompletion(command, arg, allPos, value);
      if (typeof newValue === "string" && newValue !== "") {
        if (!newValue.endsWith(" ") && !newValue.endsWith("/") && allPos.length === 1) newValue += " ";
        saveValue(newValue);
      }
      if (Array.isArray(newValue)) {
        setPossibilities(newValue);
      }
    }

    // Clear screen.
    if (event.key === KEY.L && event.ctrlKey) {
      event.preventDefault();
      terminal.clear();
    }

    // Select previous command.
    if (event.key === KEY.UP_ARROW || (Settings.EnableBashHotkeys && event.key === KEY.P && event.ctrlKey)) {
      if (Settings.EnableBashHotkeys) {
        event.preventDefault();
      }
      const i = terminal.commandHistoryIndex;
      const len = terminal.commandHistory.length;

      if (len == 0) {
        return;
      }
      if (i < 0 || i > len) {
        terminal.commandHistoryIndex = len;
      }

      if (i != 0) {
        --terminal.commandHistoryIndex;
      }
      const prevCommand = terminal.commandHistory[terminal.commandHistoryIndex];
      saveValue(prevCommand);
      const ref = terminalInput.current;
      if (ref) {
        setTimeout(function () {
          ref.selectionStart = ref.selectionEnd = 10000;
        }, 10);
      }
    }

    // Select next command
    if (event.key === KEY.DOWN_ARROW || (Settings.EnableBashHotkeys && event.key === KEY.M && event.ctrlKey)) {
      if (Settings.EnableBashHotkeys) {
        event.preventDefault();
      }
      const i = terminal.commandHistoryIndex;
      const len = terminal.commandHistory.length;

      if (len == 0) {
        return;
      }
      if (i < 0 || i > len) {
        terminal.commandHistoryIndex = len;
      }

      // Latest command, put nothing
      if (i == len || i == len - 1) {
        terminal.commandHistoryIndex = len;
        saveValue("");
      } else {
        ++terminal.commandHistoryIndex;
        const prevCommand = terminal.commandHistory[terminal.commandHistoryIndex];
        saveValue(prevCommand);
      }
    }

    // Extra Bash Emulation Hotkeys, must be enabled through options
    if (Settings.EnableBashHotkeys) {
      if (event.key === KEY.A && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("home");
      }

      if (event.key === KEY.E && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("end");
      }

      if (event.key === KEY.B && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("prevchar");
      }

      if (event.key === KEY.B && event.altKey) {
        event.preventDefault();
        moveTextCursor("prevword");
      }

      if (event.key === KEY.F && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("nextchar");
      }

      if (event.key === KEY.F && event.altKey) {
        event.preventDefault();
        moveTextCursor("nextword");
      }

      if ((event.key === KEY.H || event.key === KEY.D) && event.ctrlKey) {
        modifyInput("backspace");
        event.preventDefault();
      }

      if (event.key === KEY.W && event.ctrlKey) {
        event.preventDefault();
        modifyInput("deletewordbefore");
      }

      if (event.key === KEY.D && event.altKey) {
        event.preventDefault();
        modifyInput("deletewordafter");
      }

      if (event.key === KEY.U && event.ctrlKey) {
        event.preventDefault();
        modifyInput("clearbefore");
      }

      if (event.key === KEY.K && event.ctrlKey) {
        event.preventDefault();
        modifyInput("clearafter");
      }
    }
  }

  return (
    <>
      <TextField
        fullWidth
        color={terminal.action === null ? "primary" : "secondary"}
        autoFocus
        disabled={terminal.action !== null}
        autoComplete="off"
        value={value}
        classes={{ root: classes.textfield }}
        onChange={handleValueChange}
        inputRef={terminalInput}
        InputProps={{
          // for players to hook in
          id: "terminal-input",
          className: classes.input,
          startAdornment: (
            <Typography color={terminal.action === null ? "primary" : "secondary"} flexShrink={0}>
              [{player.getCurrentServer().hostname}&nbsp;~{terminal.cwd()}]&gt;&nbsp;
            </Typography>
          ),
          spellCheck: false,
          onBlur: ()=>setPossibilities([]),
          onKeyDown: onKeyDown,
        }}
      ></TextField>
      <Popper open={possibilities.length > 0} anchorEl={terminalInput.current} placement={"top-end"}>
        <Typography classes={{ root: classes.preformatted }} color={"primary"} paragraph={false}>
          Possible autocomplete candidate:
        </Typography>
        <Typography classes={{ root: classes.preformatted }} color={"primary"} paragraph={false}>
          {possibilities.join(" ")}
        </Typography>
      </Popper>
    </>
  );
}
