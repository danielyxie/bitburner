import React, { useState, useEffect, useRef } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { RunningScript } from "../../Script/RunningScript";
import { killWorkerScript } from "../../Netscript/killWorkerScript";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

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

  useEffect(() => {
    function closeHandler(event: KeyboardEvent): void {
      if (event.keyCode === 27) {
        props.onClose();
      }
    }

    document.addEventListener("keydown", closeHandler);

    return () => {
      document.removeEventListener("keydown", closeHandler);
    };
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
    <Paper
      style={{
        display: "flex",
        flexFlow: "column",
        backgroundColor: "gray",
        width: "50%",
        position: "fixed",
        left: "50%",
        top: "40%",
        margin: "-10% 0 0 -25%",
        height: "auto",
        maxHeight: "50%",
        zIndex: 10,
        border: "2px solid $hacker-green",
      }}
      ref={container}
    >
      <Paper
        style={{
          cursor: "grab",
        }}
      >
        <Box display="flex" alignItems="center" onMouseDown={drag}>
          <Typography color="primary" variant="h6" noWrap component="div">
            {props.script.filename} {props.script.args.map((x: any): string => `${x}`).join(" ")}
          </Typography>

          <Box display="flex" marginLeft="auto">
            <Button onClick={kill}>Kill Script</Button>
            <Button onClick={props.onClose}>Close</Button>
          </Box>
        </Box>
      </Paper>
      <Paper>
        {props.script.logs.map(
          (line: string, i: number): JSX.Element => (
            <Typography key={i} style={{ whiteSpace: "pre-line" }}>
              {line}
              <br />
            </Typography>
          ),
        )}
      </Paper>
    </Paper>
  );
}
