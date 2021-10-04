import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    money: {
      color: theme.colors.money,
    },
  }),
);

export function Hashes({ hashes }: { hashes: number | string }): React.ReactElement {
  const classes = useStyles();
  return (
    <span className={classes.money}>{typeof hashes === "number" ? numeralWrapper.formatHashes(hashes) : hashes}</span>
  );
}
