import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
  money: number | string;
  player?: IPlayer;
}
export function Money(props: IProps): JSX.Element {
  if (props.player !== undefined) {
    if (typeof props.money !== "number")
      throw new Error(
        "if player if provided, money should be number, contact dev",
      );
    if (!props.player.canAfford(props.money))
      return (
        <span className={"unbuyable samefont"}>
          {numeralWrapper.formatMoney(props.money)}
        </span>
      );
  }
  return (
    <span className={"money-gold samefont"}>
      {typeof props.money === "number"
        ? numeralWrapper.formatMoney(props.money)
        : props.money}
    </span>
  );
}
