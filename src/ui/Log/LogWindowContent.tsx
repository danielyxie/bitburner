import React, { PropsWithChildren, useEffect, useState } from "react";
import { Settings } from "../../Settings/Settings";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import makeStyles from "@mui/styles/makeStyles";
import { Theme } from "@mui/material";
import createStyles from "@mui/styles/createStyles";

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

export interface IContentProps {
  draggableRef: React.RefObject<HTMLDivElement>;
  showLogs: boolean;
  filename: string;
  args: any[];
  running: boolean;
  logs: string[];
  run: () => void;
  kill: () => void;
  close: () => void;
}

export function LogWindowContent(props: PropsWithChildren<IContentProps>): React.ReactElement {
  const classes = useStyles();
  const setRerender = useState(false)[1];

  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  function kill(): void {
    props.kill();
  }

  function run(): void {
    props.run();
  }

  function title(full = false): string {
    const maxLength = 30;
    const t = `${props.filename} ${props.args.map((x: any): string => `${x}`).join(" ")}`;
    if (full || t.length <= maxLength) {
      return t;
    }
    return t.slice(0, maxLength - 3) + "...";
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

  // Max [width, height]
  const minConstraints: [number, number] = [250, 33];

  return (
    <>
      <Paper className="drag" sx={{ display: "flex", alignItems: "center", cursor: "grab" }} ref={props.draggableRef}>
        <Typography
          variant="h6"
          sx={{ marginRight: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
          title={title(true)}
        >
          {title(true)}
        </Typography>

        <span style={{ minWidth: "fit-content", height: `${minConstraints[1]}px` }}>
          {!props.running ? (
            <Button className={classes.titleButton} onClick={run} onTouchEnd={run}>
              Run
            </Button>
          ) : (
            <Button className={classes.titleButton} onClick={kill} onTouchEnd={kill}>
              Kill
            </Button>
          )}
          {props.children}
          <Button className={classes.titleButton} onClick={props.close} onTouchEnd={props.close}>
            Close
          </Button>
        </span>
      </Paper>

      <Paper
        className={classes.logs}
        sx={{ height: `calc(100% - ${minConstraints[1]}px)`, display: props.showLogs ? "flex" : "none" }}
      >
        <span style={{ display: "flex", flexDirection: "column" }}>
          {props.logs.map(
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
  );
}
