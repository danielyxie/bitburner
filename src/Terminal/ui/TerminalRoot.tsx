import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { Link as MuiLink } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import { ITerminal, Output, Link } from "../ITerminal";
import { IEngine } from "../../IEngine";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { TerminalInput } from "./TerminalInput";

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
  engine: IEngine;
  player: IPlayer;
}

export function TerminalRoot({ terminal, engine, player }: IProps): React.ReactElement {
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

  const classes = useStyles();
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
      {terminal.action !== null && <ActionTimer terminal={terminal} />}
      <TerminalInput player={player} engine={engine} terminal={terminal} />
    </Box>
  );
}
