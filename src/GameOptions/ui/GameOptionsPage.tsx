import { List, ListItem, Paper, Typography } from "@mui/material";
import { uniqueId } from "lodash";
import React from "react";

interface IProps {
  children: React.ReactElement | (React.ReactElement | null)[];
  title: string;
}

export const GameOptionsPage = (props: IProps): React.ReactElement => {
  return (
    <Paper sx={{ height: "fit-content", p: 1 }}>
      <Typography variant="h6">{props.title}</Typography>
      {(props.children as any)?.length > 1 ? (
        <List disablePadding dense>
          {(props.children as React.ReactElement[])
            .filter((c) => c)
            .map((c, i) => (
              <ListItem key={uniqueId(String(i))} sx={{ px: 0, display: "block" }}>
                {c}
              </ListItem>
            ))}
        </List>
      ) : (
        props.children
      )}
    </Paper>
  );
};
