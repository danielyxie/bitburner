import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";

export function Money(money: number | string): JSX.Element {
	return <span className={"money-gold samefont"}>{typeof money === 'number' ? numeralWrapper.formatMoney(money) : money}</span>
}