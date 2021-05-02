import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";

export function MoneyRate(money: number): JSX.Element {
	return Money(`${numeralWrapper.formatMoney(money)} / sec`);
}