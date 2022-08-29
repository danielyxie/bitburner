import { List, Paper, Typography } from "@mui/material";
import React from "react";

interface IProps {
  children: React.ReactNode;
  title: string;
}

export const GameOptionsPage = (props: IProps): React.ReactElement => {
  return (
    <Paper sx={{ height: "fit-content", p: 1 }}>
      <Typography variant="h6">{props.title}</Typography>
      {props.children}
    </Paper>
  );
};
