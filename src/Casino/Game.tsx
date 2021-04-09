import * as React from "react";
import { IPlayer }   from "../PersonObjects/IPlayer";
import { dialogBoxCreate } from "../../utils/DialogBox";

const gainLimit = 10e9;

export class Game<T,U> extends React.Component<T, U> {
	win(p: IPlayer, n: number) {
		p.gainMoney(n);
		p.recordMoneySource(n, "casino");
	}

	reachedLimit(p: IPlayer): boolean {
		const reached = p.getCasinoWinnings() > gainLimit;
		if(reached) {
			dialogBoxCreate(<>Alright cheater get out of here. You're not allowed here anymore.</>);
		}
		return reached;
	}
}