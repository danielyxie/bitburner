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
  const [command, setCommand] = useState("");
  const setRerender = useState(false)[1];

  function handleCommandChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setCommand(event.target.value);
  }

  const [consoleHistoryIndex, setConsoleHistoryIndex] = useState(props.bladeburner.consoleHistory.length);

  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => {
      clearInterval(id);
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
      setCommand(prevCommand);
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
        setCommand(prevCommand);
      }
    }
  }

  return (
    <Paper>
      <Box sx={{
        height: '60vh',
        paddingBottom: '8px',
        display: 'flex',
        alignItems: 'stretch',
      }}>
        <Box>
          <Logs entries={[...props.bladeburner.consoleLogs]} />
        </Box>
      </Box>
      <TextField
        classes={{ root: classes.textfield }}
        autoFocus
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
    </Paper>
  );
}

interface ILogProps {
  entries: string[];
}

function Logs({entries}: ILogProps): React.ReactElement {
  const scrollHook = useRef<HTMLUListElement>(null);

  // TODO: Text gets shifted up as new entries appear, if the user scrolled up it should attempt to keep the text focused
  function scrollToBottom(): void {
    if (!scrollHook.current) return;
    scrollHook.current.scrollTop = scrollHook.current.scrollHeight;
  }

  useEffect(() => {
    scrollToBottom();
  }, [entries]);

  return (
    <List sx={{ height: "100%", overflow: "auto", p: 1 }} ref={scrollHook}>
      {entries && entries.map((log: any, i: number) => (
        <Line key={i} content={log} />
      ))}
    </List>
  );
}
