import React, { useState, useEffect, useRef } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { RunningScript } from "../../Script/RunningScript";
import { killWorkerScript } from "../../Netscript/killWorkerScript";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

let layerCounter = 0;

export const LogBoxEvents = new EventEmitter<[RunningScript]>();

interface Log {
  id: string;
  script: RunningScript;
}

let logs: Log[] = [];

export function LogBoxManager(): React.ReactElement {
  const setRerender = useState(true)[1];
  function rerender(): void {
    setRerender((o) => !o);
  }
  useEffect(
    () =>
      LogBoxEvents.subscribe((script: RunningScript) => {
        const id = script.server + "-" + script.filename + script.args.map((x: any): string => `${x}`).join("-");
        if (logs.find((l) => l.id === id)) return;
        logs.push({
          id: id,
          script: script,
        });
        rerender();
      }),
    [],
  );

  function close(id: string): void {
    logs = logs.filter((l) => l.id !== id);
    rerender();
  }

  return (
    <>
      {logs.map((log) => (
        <LogWindow key={log.id} script={log.script} id={log.id} onClose={() => close(log.id)} />
      ))}
    </>
  );
}

interface IProps {
  script: RunningScript;
  id: string;
  onClose: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    logs: {
      overflowY: "scroll",
      overflowX: "hidden",
      scrollbarWidth: "auto",
      display: "flex",
      flexDirection: "column-reverse",
    },
  }),
);

function LogWindow(props: IProps): React.ReactElement {
  const classes = useStyles();
  const container = useRef<HTMLDivElement>(null);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  function kill(): void {
    killWorkerScript(props.script, props.script.server, true);
    props.onClose();
  }

  function updateLayer(): void {
    const c = container.current;
    if (c === null) return;
    c.style.zIndex = 1500 + layerCounter + "";
    layerCounter++;
    rerender();
  }

  function title(): string {
    const maxLength = 30;
    const t = `${props.script.filename} ${props.script.args.map((x: any): string => `${x}`).join(" ")}`;
    if (t.length <= maxLength) {
      return t;
    }
    return t.slice(0, maxLength - 3) + "...";
  }

  return (
    <Draggable handle=".drag">
      <Paper
        style={{
          display: "flex",
          flexFlow: "column",
          position: "fixed",
          left: "40%",
          top: "30%",
          zIndex: 1400,
        }}
        ref={container}
      >
        <div onMouseDown={updateLayer}>
          <Paper
            style={{
              cursor: "grab",
            }}
          >
            <Box className="drag" display="flex" alignItems="center">
              <Typography color="primary" variant="h6">
                {title()}
              </Typography>

              <Box position="absolute" right={0}>
                <Button onClick={kill}>Kill Script</Button>
                <Button onClick={props.onClose}>Close</Button>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ overflow: "scroll", overflowWrap: "break-word", whiteSpace: "pre-line" }}>
            <ResizableBox
              className={classes.logs}
              height={500}
              width={500}
              handle={
                <span style={{ position: "absolute", right: "-10px", bottom: "-13px", cursor: "nw-resize" }}>
                  <ArrowForwardIosIcon color="primary" style={{ transform: "rotate(45deg)" }} />
                </span>
              }
            >
              <Box>
                {props.script.logs.map(
                  (line: string, i: number): JSX.Element => (
                    <Typography key={i}>
                      {line}
                      <br />
                    </Typography>
                  ),
                )}
              </Box>
            </ResizableBox>
          </Paper>
        </div>
      </Paper>
    </Draggable>
  );
}
