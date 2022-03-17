import React from "react";

import { List, ListItem, ListItemText } from "@mui/material";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

import { Settings } from "../Settings/Settings";
import { LogItem } from "./LogItem";
import { DetailedLogEntry } from "./EventLog";

interface IProps {
  logs: DetailedLogEntry[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      padding: theme.spacing(0),
      width: "100%",
      maxWidth: "500px",
      border: `1px solid ${Settings.theme.welllight}`,
    },
  }),
);

export function LogsList({ logs }: IProps): React.ReactElement {
  const classes = useStyles();
  const items = logs.map((log) => {
    return <LogItem key={log.logKey} {...log} />;
  });
  return (
    <List dense className={classes.list}>
      {items.length > 0 ? (
        items
      ) : (
        <ListItem>
          <ListItemText>No events occured yet...</ListItemText>
        </ListItem>
      )}
    </List>
  );
}
