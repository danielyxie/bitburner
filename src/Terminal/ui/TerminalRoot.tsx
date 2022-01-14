import React, { useState, useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Link as MuiLink } from "@mui/material";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Box from "@mui/material/Box";
import { ITerminal, Output, Link, RawOutput } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { TerminalInput } from "./TerminalInput";
import { TerminalEvents, TerminalClearEvents } from "../TerminalEvents";
import { BitFlumeModal } from "../../BitNode/ui/BitFlumeModal";
import { CodingContractModal } from "../../ui/React/CodingContractModal";

import _ from "lodash";

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

    success: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.colors.success,
    },
    error: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.error.main,
    },
    primary: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.primary.main,
    },
    info: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.info.main,
    },
    warning: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.warning.main,
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

  useEffect(() => TerminalEvents.subscribe(_.debounce(async () => rerender(), 25, { maxWait: 50 })), []);
  useEffect(() => TerminalClearEvents.subscribe(_.debounce(async () => clear(), 25, { maxWait: 50 })), []);

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

  function lineClass(s: string): string {
    const lineClassMap : Record<string,string> = {
      "error": classes.error,
      "success": classes.success,
      "info": classes.info,
      "warn": classes.warning,
    };
    return lineClassMap[s]||classes.primary;
  }

  function ansiCodeStyle(code: string|null): Record<string,any> {
    const COLOR_MAP : Record<string|number,any> = {
      0: 'black',
      1: 'red',
      2: 'green',
      3: 'yellow',
      4: 'blue',
      5: 'magenta',
      6: 'cyan',
      7: 'white',
    }
    const ansi2rgb = (code:number):string => {  /* eslint-disable yoda */
      if((0 <= code) && (code < 8)){
        // x8 RGB
        return COLOR_MAP[code]
      }
      if((16 <= code) && (code < 232)){
        // x216 RGB
        const base = code - 16
        const ir = Math.floor( base       / 36)
        const ig = Math.floor((base % 36) /  6)
        const ib = Math.floor((base %  6) /  1)
        const r = ir <= 0 ? 0 : 55 + ir * 40
        const g = ig <= 0 ? 0 : 55 + ig * 40
        const b = ib <= 0 ? 0 : 55 + ib * 40
        return `rgb(${r}, ${g}, ${b})`
      }
      if((232 <= code) && (code < 256)){
        // x32 greyscale
        const base = code - 232
        const grey = base * 10 + 8
        return `rgb(${grey}, ${grey}, ${grey})`
      }
      // shouldn't get here (under normal circumstances), but just in case
      return 'initial'
    }
    type styleKey = "fontWeight" | "textDecoration" | "color" | "backgroundColor"
    const style : {
      fontWeight?: string;
      textDecoration?: string;
      color?: string;
      backgroundColor?: string;
    } = {}

    if(code !== null){ /* eslint-disable yoda */
      const codeParts = code.split(';').map((p) => parseInt(p)).filter((p,i,arr) =>
        // If the sequence is 38;5 (x256 foreground color) or 48;5 (x256 background color),
        //  filter out the 5 so the next codePart after {38,48} is the color code.
        (p!=5) || i==0 || ((arr[i-1] != 38)&&(arr[i-1] != 48))
      )

      let nextStyleKey:styleKey|null = null;
      codeParts.forEach(codePart => {
        if(nextStyleKey !== null){
          style[nextStyleKey] = ansi2rgb(codePart)
          nextStyleKey = null
        }
        // Decorations
        else if(codePart == 1){
          style.fontWeight = 'bold'
        }
        else if(codePart == 4){
          style.textDecoration = 'underline'
        }
        // Forground Color (x8)
        else if((30 <= codePart)&&(codePart < 38)){
          if(COLOR_MAP[codePart%10]){
            style.color = COLOR_MAP[codePart%10]
          }
        }
        // Background Color (x8)
        else if((40 <= codePart)&&(codePart < 48)){
          if(COLOR_MAP[codePart%10]){
            style.backgroundColor = COLOR_MAP[codePart%10]
          }
        }
        // Forground Color (x256)
        else if(codePart == 38){
          nextStyleKey = 'color'
        }
        // Background Color (x256)
        else if(codePart == 48){
          nextStyleKey = 'backgroundColor'
        }
      })
    }
    return style
  }

  function parseOutputText(item: Output): React.ReactElement {
    // Some things, oddly, can cause item.text to not be a string (e.g. expr from the CLI), which
    //  causes .matchAll to throw.  Ensure it's a string immediately
    const parts = []
    if(typeof item.text === 'string'){
      // eslint-disable-next-line no-control-regex
      const ANSI_ESCAPE = new RegExp('\u{001b}\\[(?<code>.*?)m', 'ug');
      const matches = [null, ...item.text.matchAll(ANSI_ESCAPE), null]
      if(matches.length > 2){
        matches.slice(0, -1).forEach((m,i) => {
          const n = matches[i+1]
          if(m&&m.index!==undefined&&m.groups!==undefined){
            const startIndex = m ? m.index + m[0].length : 0
            const stopIndex  = n ? n.index               : item.text.length
            const partText   = item.text.slice(startIndex, stopIndex)
            parts.push({code:m.groups.code, text:partText})
          }
        })
      }
    }
    if(parts.length === 0){
      parts.push({code:null, text:item.text})
    }
    return (
      <Typography classes={{ root: lineClass(item.color) }} paragraph={false}>
        {parts.map((item, index) => {
          return (
            <Typography key={index} paragraph={false} component="span" sx={ansiCodeStyle(item.code)}>{item.text}</Typography>
          )
        })}
      </Typography>
    )
  }

  const classes = useStyles();
  return (
    <>
      <Box width="100%" minHeight="100vh" display={"flex"} alignItems={"flex-end"}>
        <List key={key} id="terminal" classes={{ root: classes.list }}>
          {terminal.outputHistory.map((item, i) => {
            if (item instanceof Output)
              return (
                <ListItem key={i} classes={{ root: classes.nopadding }}>
                  {parseOutputText(item)}
                </ListItem>
              );
            if (item instanceof RawOutput)
              return (
                <ListItem key={i} classes={{ root: classes.nopadding }}>
                  <Typography classes={{ root: classes.preformatted }} paragraph={false}>
                    {item.raw}
                  </Typography>
                </ListItem>
              );
            if (item instanceof Link)
              return (
                <ListItem key={i} classes={{ root: classes.nopadding }}>
                  <Typography>{item.dashes}&gt;&nbsp;</Typography>
                  <MuiLink
                    classes={{ root: classes.preformatted }}
                    color={"secondary"}
                    paragraph={false}
                    onClick={() => terminal.connectToServer(player, item.hostname)}
                  >
                    <Typography>{item.hostname}</Typography>
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
      <BitFlumeModal />
      <CodingContractModal />
    </>
  );
}
