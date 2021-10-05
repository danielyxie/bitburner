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
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export const LogBoxEvents = new EventEmitter<[RunningScript]>();

interface Log {
  id: string;
  script: RunningScript;
}

export function LogBoxManager(): React.ReactElement {
  const [logs, setLogs] = useState<Log[]>([]);
  useEffect(
    () =>
      LogBoxEvents.subscribe((script: RunningScript) => {
        const id = script.server + "-" + script.filename + script.args.map((x: any): string => `${x}`).join("-");
        setLogs((old) => {
          return [
            ...old,
            {
              id: id,
              script: script,
            },
          ];
        });
      }),
    [],
  );

  function close(id: string): void {
    setLogs((old) => old.filter((l) => l.id !== id));
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

function LogWindow(props: IProps): React.ReactElement {
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

  function drag(event: React.MouseEvent<HTMLElement, MouseEvent>): void {
    const c = container.current;
    if (c === null) return;
    event.preventDefault();
    let x = event.clientX;
    let y = event.clientY;
    let left = c.offsetLeft + c.clientWidth / 2;
    let top = c.offsetTop + c.clientWidth / 5;
    function mouseMove(event: MouseEvent): void {
      const c = container.current;
      if (c === null) return;
      left += event.clientX - x;
      top += event.clientY - y;
      c.style.left = left + "px";
      c.style.top = top + "px";
      // reset right and bottom to avoid the window stretching
      c.style.right = "";
      c.style.bottom = "";
      x = event.clientX;
      y = event.clientY;
    }
    function mouseUp(): void {
      document.removeEventListener("mouseup", mouseUp);
      document.removeEventListener("mousemove", mouseMove);
    }
    document.addEventListener("mouseup", mouseUp);
    document.addEventListener("mousemove", mouseMove);
  }

  return (
    <Draggable handle="#drag">
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
        <Paper
          style={{
            cursor: "grab",
          }}
        >
          <Box id="drag" display="flex" alignItems="center">
            <Typography color="primary" variant="h6" noWrap component="div">
              {props.script.filename} {props.script.args.map((x: any): string => `${x}`).join(" ")}
            </Typography>

            <Box display="flex" marginLeft="auto">
              <Button onClick={kill}>Kill Script</Button>
              <Button onClick={props.onClose}>Close</Button>
            </Box>
          </Box>
        </Paper>
        <Paper sx={{ overflow: "scroll", overflowWrap: "break-word", whiteSpace: "pre-line" }}>
          <ResizableBox
            height={500}
            width={500}
            handle={
              <span style={{ position: "absolute", right: 0, bottom: 0 }}>
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
      </Paper>
    </Draggable>
  );
}
