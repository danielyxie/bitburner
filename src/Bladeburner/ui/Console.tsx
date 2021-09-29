import React, { useState, useRef, useEffect } from "react";
import { IBladeburner } from "../IBladeburner";

import { IPlayer } from "../../PersonObjects/IPlayer";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

interface ILineProps {
  content: any;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textfield: {
      margin: theme.spacing(0),
      width: "100%",
    },
    input: {
      backgroundColor: "#000",
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

function Line(props: ILineProps): React.ReactElement {
  return (
    <ListItem sx={{ p: 0 }}>
      <Typography>{props.content}</Typography>
    </ListItem>
  );
}

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function Console(props: IProps): React.ReactElement {
  const classes = useStyles();
  const scrollHook = useRef<HTMLDivElement>(null);
  const [command, setCommand] = useState("");
  const setRerender = useState(false)[1];

  function handleCommandChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setCommand(event.target.value);
  }

  const [consoleHistoryIndex, setConsoleHistoryIndex] = useState(props.bladeburner.consoleHistory.length);

  // TODO: Figure out how to actually make the scrolling work correctly.
  function scrollToBottom(): void {
    if (!scrollHook.current) return;
    scrollHook.current.scrollTop = scrollHook.current.scrollHeight;
  }

  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    const id2 = setInterval(scrollToBottom, 100);
    return () => {
      clearInterval(id);
      clearInterval(id2);
    };
  }, []);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) {
      event.preventDefault();
      if (command.length > 0) {
        props.bladeburner.postToConsole("> " + command);
        props.bladeburner.executeConsoleCommands(props.player, command);
        setConsoleHistoryIndex(props.bladeburner.consoleHistory.length);
        setCommand("");
      }
    }

    const consoleHistory = props.bladeburner.consoleHistory;

    if (event.keyCode === 38) {
      // up
      let i = consoleHistoryIndex;
      const len = consoleHistory.length;
      if (len === 0) {
        return;
      }
      if (i < 0 || i > len) {
        setConsoleHistoryIndex(len);
      }

      if (i !== 0) {
        i = i - 1;
      }
      setConsoleHistoryIndex(i);
      const prevCommand = consoleHistory[i];
      event.currentTarget.value = prevCommand;
    }

    if (event.keyCode === 40) {
      const i = consoleHistoryIndex;
      const len = consoleHistory.length;

      if (len == 0) {
        return;
      }
      if (i < 0 || i > len) {
        setConsoleHistoryIndex(len);
      }

      // Latest command, put nothing
      if (i == len || i == len - 1) {
        setConsoleHistoryIndex(len);
        event.currentTarget.value = "";
      } else {
        setConsoleHistoryIndex(consoleHistoryIndex + 1);
        const prevCommand = consoleHistory[consoleHistoryIndex + 1];
        event.currentTarget.value = prevCommand;
      }
    }
  }

  return (
    <Box height={"60vh"} display={"flex"} alignItems={"stretch"} component={Paper}>
      <Box>
        <List sx={{ height: "100%", overflow: "auto" }}>
          {props.bladeburner.consoleLogs.map((log: any, i: number) => (
            <Line key={i} content={log} />
          ))}
          <TextField
            classes={{ root: classes.textfield }}
            autoFocus
            variant="standard"
            tabIndex={1}
            type="text"
            value={command}
            onChange={handleCommandChange}
            onKeyDown={handleKeyDown}
            InputProps={{
              // for players to hook in
              className: classes.input,
              startAdornment: (
                <>
                  <Typography>&gt;&nbsp;</Typography>
                </>
              ),
              spellCheck: false,
            }}
          />
        </List>
        <div ref={scrollHook}></div>
      </Box>
    </Box>
  );
}
