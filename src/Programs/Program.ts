import { BaseServer } from "../Server/BaseServer";
import { ITerminal } from "../Terminal/ITerminal";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IRouter } from "../ui/Router";

export interface IProgramCreate {
  level: number;
  req(p: IPlayer): boolean; // Function that indicates whether player meets requirements
  time: number;
  tooltip: string;
}

export class Program {
  name = "";
  create: IProgramCreate | null;
  run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer, args: string[]) => void;

  constructor(
    name: string,
    create: IProgramCreate | null,
    run: (router: IRouter, terminal: ITerminal, player: IPlayer, server: BaseServer, args: string[]) => void,
  ) {
    this.name = name;
    this.create = create;
    this.run = run;
  }
}
