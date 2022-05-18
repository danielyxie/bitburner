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
import { Settings } from "../../Settings/Settings";

let layerCounter = 0;

export const LogBoxEvents = new EventEmitter<[RunningScript]>();
export const LogBoxCloserEvents = new EventEmitter<[number]>();
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

  //Event used by ns.closeTail to close tail windows
  useEffect(
    () =>
      LogBoxCloserEvents.subscribe((pid: number) => {
        closePid(pid);
      }),
    [],
  );

  useEffect(() =>
    LogBoxClearEvents.subscribe(() => {
      logs = [];
      rerender();
    }),
  );

  //Close tail windows by their id
  function close(id: string): void {
    logs = logs.filter((l) => l.id !== id);
    rerender();
  }

  //Close tail windows by their pid
  function closePid(pid: number): void {
    logs = logs.filter((log) => log.script.pid != pid);
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

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    logs: {
      overflowY: "scroll",
      overflowX: "hidden",
      scrollbarWidth: "auto",
      flexDirection: "column-reverse",
      whiteSpace: "pre-wrap",
    },
    titleButton: {
      padding: "1px 0",
      height: "100%",
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

  // useEffect(
  //   () =>
  //     WorkerScriptStartStopEventEmitter.subscribe(() => {
  //       setTimeout(() => {
  //         const server = GetServer(script.server);
  //         if (server === null) return;
  //         const exisitingScript = findRunningScript(script.filename, script.args, server);
  //         if (exisitingScript) {
  //           exisitingScript.logs = script.logs.concat(exisitingScript.logs)
  //           setScript(exisitingScript)
  //         }
  //         rerender();
  //       }, 100)
  //     }),
  //   [],
  // );

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

  function lineColor(s: string): string {
    if (s.match(/(^\[[^\]]+\] )?ERROR/) || s.match(/(^\[[^\]]+\] )?FAIL/)) {
      return Settings.theme.error;
    }
    if (s.match(/(^\[[^\]]+\] )?SUCCESS/)) {
      return Settings.theme.success;
    }
    if (s.match(/(^\[[^\]]+\] )?WARN/)) {
      return Settings.theme.warning;
    }
    if (s.match(/(^\[[^\]]+\] )?INFO/)) {
      return Settings.theme.info;
    }
    return Settings.theme.primary;
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

  // Max [width, height]
  const minConstraints: [number, number] = [250, 33];

  return (
    <Draggable handle=".drag" onDrag={boundToBody} ref={rootRef} onMouseDown={updateLayer}>
      <Box
        display="flex"
        sx={{
          flexFlow: "column",
          position: "fixed",
          left: "40%",
          top: "30%",
          zIndex: 1400,
          minWidth: `${minConstraints[0]}px`,
          minHeight: `${minConstraints[1]}px`,
          ...(minimized
            ? {
                border: "none",
                margin: 0,
                maxHeight: 0,
                padding: 0,
              }
            : {
                border: `1px solid ${Settings.theme.welllight}`,
              }),
        }}
        ref={container}
      >
        <ResizableBox
          height={500}
          width={500}
          minConstraints={minConstraints}
          handle={
            <span
              style={{
                position: "absolute",
                right: "-10px",
                bottom: "-16px",
                cursor: "nw-resize",
                display: minimized ? "none" : "inline-block",
              }}
            >
              <ArrowForwardIosIcon color="primary" style={{ transform: "rotate(45deg)", fontSize: "1.75rem" }} />
            </span>
          }
        >
          <>
            <Paper className="drag" sx={{ display: "flex", alignItems: "center", cursor: "grab" }} ref={draggableRef}>
              <Typography
                variant="h6"
                sx={{ marginRight: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
                title={title(true)}
              >
                {title(true)}
              </Typography>

              <span style={{ minWidth: "fit-content", height: `${minConstraints[1]}px` }}>
                {!workerScripts.has(script.pid) ? (
                  <Button className={classes.titleButton} onClick={run} onTouchEnd={run}>
                    Run
                  </Button>
                ) : (
                  <Button className={classes.titleButton} onClick={kill} onTouchEnd={kill}>
                    Kill
                  </Button>
                )}
                <Button className={classes.titleButton} onClick={minimize} onTouchEnd={minimize}>
                  {minimized ? "\u{1F5D6}" : "\u{1F5D5}"}
                </Button>
                <Button className={classes.titleButton} onClick={props.onClose} onTouchEnd={props.onClose}>
                  Close
                </Button>
              </span>
            </Paper>

            <Paper
              className={classes.logs}
              sx={{ height: `calc(100% - ${minConstraints[1]}px)`, display: minimized ? "none" : "flex" }}
            >
              <span style={{ display: "flex", flexDirection: "column" }}>
                {script.logs.map(
                  (line: string, i: number): JSX.Element => (
                    <Typography key={i} sx={{ color: lineColor(line) }}>
                      {line}
                      <br />
                    </Typography>
                  ),
                )}
              </span>
            </Paper>
          </>
        </ResizableBox>
      </Box>
    </Draggable>
  );
}
