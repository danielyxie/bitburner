import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    favor: {
      color: theme.colors.rep,
    },
  }),
);

export function Favor({ favor }: { favor: number | string }): React.ReactElement {
  const classes = useStyles();
  return <span className={classes.favor}>{typeof favor === "number" ? numeralWrapper.formatFavor(favor) : favor}</span>;
}
