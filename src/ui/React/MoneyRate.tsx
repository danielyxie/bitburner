import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";

export function MoneyRate(money: number): JSX.Element {
  return <Money money={`${numeralWrapper.formatMoney(money)} / sec`} />;
}
