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
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { TerminalInput } from "./TerminalInput";
import { TerminalEvents, TerminalClearEvents } from "../TerminalEvents";

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
      overflowWrap: "anywhere",
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

export function TerminalRoot({ terminal, router, player }: IProps): React.ReactElement {
  const scrollHook = useRef<HTMLDivElement>(null);
  const setRerender = useState(0)[1];
  const [key, setKey] = useState(0);
  function rerender(): void {
    setRerender((old) => old + 1);
  }

  function clear(): void {
    setKey((key) => key + 1);
  }

  useEffect(() => TerminalEvents.subscribe(rerender), []);
  useEffect(() => TerminalClearEvents.subscribe(clear), []);

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
      <Box width="100%" minHeight="100vh" display={"flex"} alignItems={"flex-end"}>
        <List key={key} id="terminal" classes={{ root: classes.list }}>
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
                  <Typography>{item.dashes}&gt;&nbsp;</Typography><MuiLink
                    classes={{ root: classes.preformatted }}
                    color={"secondary"}
                    paragraph={false}
                    onClick={() => terminal.connectToServer(player, item.hostname)}
                  >
                    {item.hostname}
                  </MuiLink>
                </ListItem>
              );
          })}

          {terminal.action !== null && (
            <ListItem classes={{ root: classes.nopadding }}>
              <ActionTimer terminal={terminal} />{" "}
            </ListItem>
          )}
        </List>
        <div ref={scrollHook}></div>
      </Box>
      <Box position="sticky" bottom={0} width="100%" px={0}>
        <TerminalInput player={player} router={router} terminal={terminal} />
      </Box>
    </>
  );
}
