import { BaseServer } from "../Server/BaseServer";

export interface IProgramCreate {
  level: number;
  req(): boolean; // Function that indicates whether player meets requirements
  time: number;
  tooltip: string;
}

export class Program {
  name = "";
  create: IProgramCreate | null;
  run: (args: string[], server: BaseServer) => void;

  constructor(
    name: string,
    create: IProgramCreate | null,
    run: (args: string[], server: BaseServer) => void,
  ) {
    this.name = name;
    this.create = create;
    this.run = run;
  }
}
