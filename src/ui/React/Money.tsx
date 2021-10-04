import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

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
  money: number | string;
  player?: IPlayer;
}
export function Money(props: IProps): React.ReactElement {
  const classes = useStyles();
  if (props.player !== undefined) {
    if (typeof props.money !== "number") throw new Error("if player if provided, money should be number, contact dev");
    if (!props.player.canAfford(props.money))
      return <span className={classes.unbuyable}>{numeralWrapper.formatMoney(props.money)}</span>;
  }
  return (
    <span className={classes.money}>
      {typeof props.money === "number" ? numeralWrapper.formatMoney(props.money) : props.money}
    </span>
  );
}
