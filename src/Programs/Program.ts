export interface IPlayer {
  hacking_skill: number;
  sourceFiles: any[];
}

export interface IProgramCreate {
  level: number;
  req(p: IPlayer): boolean; // Function that indicates whether player meets requirements
  time: number;
  tooltip: string;
}

export class Program {
  name = "";
  create: IProgramCreate | null;

  constructor(name: string, create: IProgramCreate | null) {
    this.name = name;
    this.create = create;
  }

  htmlID(): string {
    const name = this.name.endsWith(".exe") ? this.name.slice(0, -".exe".length) : this.name;
    return "create-program-" + name;
  }
}
