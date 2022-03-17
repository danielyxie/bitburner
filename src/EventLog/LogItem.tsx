import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { ListItem, ListItemIcon, ListItemText, Tooltip, Collapse, IconButton, Link } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { Settings } from "../Settings/Settings";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { RelativeTime } from "../ui/React/RelativeTime";
import { LogTypes, LogCategories, DetailedLogEntry } from "./EventLog";

const useStyles = makeStyles(() =>
  createStyles({
    entry: {
      "& p": {
        color: Settings.theme.primary,
        fontSize: "1rem",
      },
    },
  }),
);

export function LogItem(log: DetailedLogEntry): React.ReactElement {
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(true);
  const descriptionSectionButton = !log.description ? (
    <></>
  ) : (
    <IconButton edge="end" onClick={() => setCollapsed(!collapsed)}>
      {collapsed ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
    </IconButton>
  );
  let iconTooltip = `${LogTypes[log.type]}`;
  if (log.category !== LogCategories.Misc) iconTooltip += ` - ${LogCategories[log.category]}`;
  return (
    <>
      <ListItem
        sx={{ borderBottom: collapsed ? `1px solid ${Settings.theme.well}` : "" }}
        secondaryAction={descriptionSectionButton}
      >
        <Tooltip title={iconTooltip}>
          <ListItemIcon>{log.icon}</ListItemIcon>
        </Tooltip>
        <ListItemText
          className={classes.entry}
          secondary={
            <RelativeTime sx={{ color: Settings.theme.secondarydark, fontSize: "0.8rem" }} initial={log.timestamp} />
          }
        >
          <Typography>
            {log.actionHandler ? (
              <Link sx={{ cursor: "pointer" }} onClick={log.actionHandler}>
                {log.message}
              </Link>
            ) : (
              <>{log.message}</>
            )}
          </Typography>
        </ListItemText>
      </ListItem>
      {log.description && (
        <Collapse in={!collapsed} timeout="auto" unmountOnExit>
          <ListItem sx={{ borderBottom: `1px solid ${Settings.theme.well}` }}>
            <ListItemText>
              {typeof log.description === "object" ? (
                <>{log.description}</>
              ) : (
                <span dangerouslySetInnerHTML={{ __html: log.description.toString() }} />
              )}
            </ListItemText>
          </ListItem>
        </Collapse>
      )}
    </>
  );
}
