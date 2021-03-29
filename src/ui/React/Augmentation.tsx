import * as React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";

export function Augmentation(name: string): JSX.Element {
	return <span className={"samefont"} style={{'color': 'white'}}>{name}</span>
}