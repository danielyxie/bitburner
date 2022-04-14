import type { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    aug: {
      color: theme.colors.combat,
    },
  }),
);

export function Augmentation({ name }: { name: string }): JSX.Element {
  const classes = useStyles();
  return <span className={classes.aug}>{name}</span>;
}
