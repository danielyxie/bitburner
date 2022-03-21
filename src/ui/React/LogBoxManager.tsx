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
import { workerScripts } from "../../Netscript/WorkerScripts";
import { startWorkerScript } from "../../NetscriptWorker";
import { GetServer } from "../../Server/AllServers";
import { Theme } from "@mui/material";
import { findRunningScript } from "../../Script/ScriptHelpers";
import { Player } from "../../Player";
import { debounce } from "lodash";

let layerCounter = 0;

export const LogBoxEvents = new EventEmitter<[RunningScript]>();
export const LogBoxClearEvents = new EventEmitter<[]>();

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

  useEffect(() =>
    LogBoxClearEvents.subscribe(() => {
      logs = [];
      rerender();
    }),
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      "&.is-minimized + *": {
        border: "none",
        margin: 0,
        "max-height": 0,
        padding: 0,
        "pointer-events": "none",
        visibility: "hidden",
      },
    },
    logs: {
      overflowY: "scroll",
      overflowX: "hidden",
      scrollbarWidth: "auto",
      display: "flex",
      flexDirection: "column-reverse",
    },
    success: {
      color: theme.colors.success,
    },
    error: {
      color: theme.palette.error.main,
    },
    primary: {
      color: theme.palette.primary.main,
    },
    info: {
      color: theme.palette.info.main,
    },
    warning: {
      color: theme.palette.warning.main,
    },
  }),
);

export const logBoxBaseZIndex = 1500;

function LogWindow(props: IProps): React.ReactElement {
  const draggableRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Draggable>(null);
  const [script, setScript] = useState(props.script);
  const classes = useStyles();
  const container = useRef<HTMLDivElement>(null);
  const setRerender = useState(false)[1];
  const [minimized, setMinimized] = useState(false);
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    updateLayer();
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  function kill(): void {
    killWorkerScript(script, script.server, true);
  }

  function run(): void {
    const server = GetServer(script.server);
    if (server === null) return;
    const s = findRunningScript(script.filename, script.args, server);
    if (s === null) {
      startWorkerScript(Player, script, server);
    } else {
      setScript(s);
    }
  }

  function updateLayer(): void {
    const c = container.current;
    if (c === null) return;
    c.style.zIndex = logBoxBaseZIndex + layerCounter + "";
    layerCounter++;
    rerender();
  }

  function title(full = false): string {
    const maxLength = 30;
    const t = `${script.filename} ${script.args.map((x: any): string => `${x}`).join(" ")}`;
    if (full || t.length <= maxLength) {
      return t;
    }
    return t.slice(0, maxLength - 3) + "...";
  }

  function minimize(): void {
    setMinimized(!minimized);
  }

  function lineClass(s: string): string {
    if (s.match(/(^\[[^\]]+\] )?ERROR/) || s.match(/(^\[[^\]]+\] )?FAIL/)) {
      return classes.error;
    }
    if (s.match(/(^\[[^\]]+\] )?SUCCESS/)) {
      return classes.success;
    }
    if (s.match(/(^\[[^\]]+\] )?WARN/)) {
      return classes.warning;
    }
    if (s.match(/(^\[[^\]]+\] )?INFO/)) {
      return classes.info;
    }
    return classes.primary;
  }

  // And trigger fakeDrag when the window is resized
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const onResize = debounce((): void => {
    const node = draggableRef?.current;
    if (!node) return;

    if (!isOnScreen(node)) {
      resetPosition();
    }
  }, 100);

  const isOnScreen = (node: HTMLDivElement): boolean => {
    const bounds = node.getBoundingClientRect();

    return !(bounds.right < 0 || bounds.bottom < 0 || bounds.left > innerWidth || bounds.top > outerWidth);
  };

  const resetPosition = (): void => {
    const node = rootRef?.current;
    if (!node) return;
    const state = node.state as { x: number; y: number };
    state.x = 0;
    state.y = 0;
    node.setState(state);
  };

  const boundToBody = (e: any): void | false => {
    if (e.clientX < 0 || e.clientY < 0 || e.clientX > innerWidth || e.clientY > innerHeight) return false;
  };

  return (
    <Draggable handle=".drag" onDrag={boundToBody} ref={rootRef}>
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
            className={classes.title + " " + (minimized ? "is-minimized" : "")}
            style={{
              cursor: "grab",
            }}
          >
            <Box className="drag" display="flex" alignItems="center" ref={draggableRef}>
              <Typography color="primary" variant="h6" title={title(true)}>
                {title()}
              </Typography>

              <Box position="absolute" right={0}>
                {!workerScripts.has(script.pid) && <Button onClick={run}>Run</Button>}
                {workerScripts.has(script.pid) && <Button onClick={kill}>Kill</Button>}
                <Button onClick={minimize}>{minimized ? "\u{1F5D6}" : "\u{1F5D5}"}</Button>
                <Button onClick={props.onClose}>Close</Button>
              </Box>
            </Box>
          </Paper>
          <Paper sx={{ overflow: "scroll", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}>
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
                {script.logs.map(
                  (line: string, i: number): JSX.Element => (
                    <Typography key={i} className={lineClass(line)}>
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
