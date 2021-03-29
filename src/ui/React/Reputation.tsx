import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";

export function Reputation(reputation: number | string): JSX.Element {
	return <span className={"reputation samefont"}>{typeof reputation === 'number' ? numeralWrapper.formatReputation(reputation) : reputation}</span>
}