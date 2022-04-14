import React from "react";

import { numeralWrapper } from "../numeralFormat";

import { Money } from "./Money";

export function MoneyRate({ money }: { money: number }): JSX.Element {
  return <Money money={`${numeralWrapper.formatMoney(money)} / sec`} />;
}
