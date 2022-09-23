import * as React from "react";
import { IPlayer } from "../PersonObjects/IPlayer";
import { dialogBoxCreate } from "../ui/React/DialogBox";

const gainLimit = 10e9;

export function win(p: IPlayer, n: number): void {
  p.gainMoney(n, "casino");
}

export function reachedLimit(p: IPlayer): boolean {
  const reached = p.getCasinoWinnings() > gainLimit;
  if (reached) {
    dialogBoxCreate("Alright cheater get out of here. You're not allowed here anymore.");
  }
  return reached;
}

export class Game<T, U> extends React.Component<T, U> {
  win(p: IPlayer, n: number): void {
    p.gainMoney(n, "casino");
  }

  reachedLimit(p: IPlayer): boolean {
    const reached = p.getCasinoWinnings() > gainLimit;
    if (reached) {
      dialogBoxCreate("Alright cheater get out of here. You're not allowed here anymore.");
    }
    return reached;
  }
}
