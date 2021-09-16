import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link as MuiLink } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";
import { KEY } from "../../../utils/helpers/keyCodes";
import { ITerminal, Output, Link, TTimer } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { determineAllPossibilitiesForTabCompletion } from "../determineAllPossibilitiesForTabCompletion";
import { tabCompletion } from "../tabCompletion";
import { FconfSettings } from "../../Fconf/FconfSettings";
import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";

interface IActionTimerProps {
  terminal: ITerminal;
}

function ActionTimer({ terminal }: IActionTimerProps): React.ReactElement {
  return (
    <Typography color={"primary"} paragraph={false}>
      {terminal.getProgressText()}
    </Typography>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textfield: {
      margin: 0,
      width: "100%",
    },
    input: {
      backgroundColor: "#000",
    },
    nopadding: {
      padding: 0,
    },
    preformatted: {
      whiteSpace: "pre-wrap",
      margin: 0,
    },
    list: {
      padding: 0,
      height: "100%",
      overflowY: "scroll",
    },
  }),
);

interface IProps {
  terminal: ITerminal;
  engine: IEngine;
  player: IPlayer;
}

export function TerminalRoot({ terminal, engine, player }: IProps): React.ReactElement {
  const terminalInput = useRef<HTMLInputElement>(null);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (terminal.pollChanges()) rerender();
    }, 100);
    return () => clearInterval(id);
  }, []);

  const [value, setValue] = useState("");
  const [possibilities, setPossibilities] = useState<string[]>([]);
  const classes = useStyles();

  function handleValueChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setValue(event.target.value);
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
          setValue(inputText.substr(0, start - 1) + inputText.substr(start));
        }
        break;
      case "deletewordbefore": // Delete rest of word before the cursor
        for (var delStart = start - 1; delStart > 0; --delStart) {
          if (inputText.charAt(delStart) === " ") {
            setValue(inputText.substr(0, delStart) + inputText.substr(start));
            return;
          }
        }
        break;
      case "deletewordafter": // Delete rest of word after the cursor
        for (var delStart = start + 1; delStart <= value.length + 1; ++delStart) {
          if (inputText.charAt(delStart) === " ") {
            setValue(inputText.substr(0, start) + inputText.substr(delStart));
            return;
          }
        }
        break;
      case "clearafter": // Deletes everything after cursor
        break;
      case "clearbefore:": // Deleetes everything before cursor
        break;
    }
  }

  function moveTextCursor(loc: string) {
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
          if (ref.value.charAt(i) === " ") {
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
          if (ref.value.charAt(i) === " ") {
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
      const ref = terminalInput.current;
      if (ref) ref.focus();

      // Cancel action
      if (event.keyCode === KEY.C && event.ctrlKey) {
        terminal.finishAction(player, true);
      }
    }
    document.addEventListener("keydown", keyDown);
    return () => document.removeEventListener("keydown", keyDown);
  });

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    // Run command.
    if (event.keyCode === KEY.ENTER && value !== "") {
      event.preventDefault();
      terminal.print(`[${player.getCurrentServer().hostname} ~${terminal.cwd()}]> ${value}`);
      terminal.executeCommands(engine, player, value);
      setValue("");
      return;
    }

    // Autocomplete
    if (event.keyCode === KEY.TAB && value !== "") {
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
      const allPos = determineAllPossibilitiesForTabCompletion(player, copy, index, terminal.cwd());
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

      const newValue = tabCompletion(command, arg, allPos, value);
      if (typeof newValue === "string" && newValue !== "") {
        setValue(newValue);
      }
      if (Array.isArray(newValue)) {
        setPossibilities(newValue);
      }
    }

    // Clear screen.
    if (event.keyCode === KEY.L && event.ctrlKey) {
      event.preventDefault();
      terminal.clear();
      rerender();
    }

    // Select previous command.
    if (
      event.keyCode === KEY.UPARROW ||
      (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.P && event.ctrlKey)
    ) {
      if (FconfSettings.ENABLE_BASH_HOTKEYS) {
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
      setValue(prevCommand);
      const ref = terminalInput.current;
      if (ref) {
        setTimeout(function () {
          ref.selectionStart = ref.selectionEnd = 10000;
        }, 10);
      }
    }

    // Select next command
    if (
      event.keyCode === KEY.DOWNARROW ||
      (FconfSettings.ENABLE_BASH_HOTKEYS && event.keyCode === KEY.M && event.ctrlKey)
    ) {
      if (FconfSettings.ENABLE_BASH_HOTKEYS) {
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
        setValue("");
      } else {
        ++terminal.commandHistoryIndex;
        const prevCommand = terminal.commandHistory[terminal.commandHistoryIndex];
        setValue(prevCommand);
      }
    }

    // Extra Bash Emulation Hotkeys, must be enabled through .fconf
    if (FconfSettings.ENABLE_BASH_HOTKEYS) {
      if (event.keyCode === KEY.A && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("home");
      }

      if (event.keyCode === KEY.E && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("end");
      }

      if (event.keyCode === KEY.B && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("prevchar");
      }

      if (event.keyCode === KEY.B && event.altKey) {
        event.preventDefault();
        moveTextCursor("prevword");
      }

      if (event.keyCode === KEY.F && event.ctrlKey) {
        event.preventDefault();
        moveTextCursor("nextchar");
      }

      if (event.keyCode === KEY.F && event.altKey) {
        event.preventDefault();
        moveTextCursor("nextword");
      }

      if ((event.keyCode === KEY.H || event.keyCode === KEY.D) && event.ctrlKey) {
        modifyInput("backspace");
        event.preventDefault();
      }

      // TODO AFTER THIS:
      // alt + d deletes word after cursor
      // ^w deletes word before cursor
      // ^k clears line after cursor
      // ^u clears line before cursor
    }
  }

  return (
    <Box position="fixed" bottom="0" width="100%" px={1}>
      <List classes={{ root: classes.list }}>
        {terminal.outputHistory.map((item, i) => {
          if (item instanceof Output)
            return (
              <ListItem key={i} classes={{ root: classes.nopadding }}>
                <Typography classes={{ root: classes.preformatted }} color={item.color} paragraph={false}>
                  {item.text}
                </Typography>
              </ListItem>
            );
          if (item instanceof Link)
            return (
              <ListItem key={i} classes={{ root: classes.nopadding }}>
                <MuiLink
                  classes={{ root: classes.preformatted }}
                  color={"secondary"}
                  paragraph={false}
                  onClick={() => terminal.connectToServer(player, item.hostname)}
                >
                  &gt;&nbsp;{item.hostname}
                </MuiLink>
              </ListItem>
            );
        })}
      </List>
      {possibilities.length > 0 && (
        <>
          <Typography classes={{ root: classes.preformatted }} color={"primary"} paragraph={false}>
            Possible autocomplete candidate:
          </Typography>
          <Typography classes={{ root: classes.preformatted }} color={"primary"} paragraph={false}>
            {possibilities.join(" ")}
          </Typography>
        </>
      )}
      {terminal.action !== null && <ActionTimer terminal={terminal} />}
      <TextField
        color={terminal.action === null ? "primary" : "secondary"}
        autoFocus
        disabled={terminal.action !== null}
        autoComplete="off"
        classes={{ root: classes.textfield }}
        value={value}
        onChange={handleValueChange}
        inputRef={terminalInput}
        InputProps={{
          // for players to hook in
          id: "terminal-input",
          className: classes.input,
          startAdornment: (
            <>
              <Typography color={terminal.action === null ? "primary" : "secondary"}>
                [{player.getCurrentServer().hostname}&nbsp;~{terminal.cwd()}]&gt;&nbsp;
              </Typography>
            </>
          ),
          spellCheck: false,
          onKeyDown: onKeyDown,
        }}
      ></TextField>
    </Box>
  );
}
