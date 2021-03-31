import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";

export function Favor(favor: number | string): JSX.Element {
	return <span className={"light-yellow samefont"}>{typeof favor === 'number' ? numeralWrapper.formatFavor(favor) : favor}</span>
}