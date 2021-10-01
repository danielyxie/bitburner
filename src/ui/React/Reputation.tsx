import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    reputation: {
      color: theme.colors.rep,
    },
  }),
);

export function Reputation({ reputation }: { reputation: number | string }): React.ReactElement {
  const classes = useStyles();
  return (
    <span className={classes.reputation}>
      {typeof reputation === "number" ? numeralWrapper.formatReputation(reputation) : reputation}
    </span>
  );
}
