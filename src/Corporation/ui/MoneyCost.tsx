import type { Theme } from "@mui/material/styles";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";

import { numeralWrapper } from "../../ui/numeralFormat";
import type { ICorporation } from "../ICorporation";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    unbuyable: {
      color: theme.palette.action.disabled,
    },
    money: {
      color: theme.colors.money,
    },
  }),
);

interface IProps {
  money: number;
  corp: ICorporation;
}

export function MoneyCost(props: IProps): React.ReactElement {
  const classes = useStyles();
  if (!(props.corp.funds > props.money))
    return <span className={classes.unbuyable}>{numeralWrapper.formatMoney(props.money)}</span>;

  return <span className={classes.money}>{numeralWrapper.formatMoney(props.money)}</span>;
}
