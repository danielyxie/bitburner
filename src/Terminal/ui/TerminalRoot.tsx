import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Link as MuiLink } from "@mui/material";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Box from "@mui/material/Box";
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
  const scrollHook = useRef<HTMLDivElement>(null);
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

  function doScroll(): void {
    const hook = scrollHook.current;
    if (hook !== null) {
      setTimeout(() => hook.scrollIntoView(true), 50);
    }
  }

  doScroll();

  useEffect(() => {
    setTimeout(doScroll, 50);
  }, []);

  const classes = useStyles();
  return (
    <>
      <Box width="100%" minHeight="100vh" px={1} display={"flex"} alignItems={"flex-end"}>
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
        <div ref={scrollHook}></div>
      </Box>
      <Box position="sticky" bottom={0} width="100%" px={1}>
        <TerminalInput player={player} engine={engine} terminal={terminal} />
      </Box>
    </>
  );
}
