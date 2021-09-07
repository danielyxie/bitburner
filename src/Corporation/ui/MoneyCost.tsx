import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { ICorporation } from "../ICorporation";

interface IProps {
  money: number;
  corp: ICorporation;
}
export function MoneyCost(props: IProps): JSX.Element {
  if (!props.corp.funds.gt(props.money))
    return (
      <span className={"unbuyable samefont"}>
        {numeralWrapper.formatMoney(props.money)}
      </span>
    );

  return (
    <span className={"money-gold samefont"}>
      {numeralWrapper.formatMoney(props.money)}
    </span>
  );
}
