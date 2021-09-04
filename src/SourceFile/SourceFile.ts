import { BitNodes } from "../BitNode/BitNode";

export class SourceFile {
  info: string;
  lvl = 1;
  n: number;
  name: string;
  owned = false;

  constructor(number: number, info = "") {
    const bitnodeKey = "BitNode" + number;
    const bitnode = BitNodes[bitnodeKey];
    if (bitnode == null) {
      throw new Error("Invalid Bit Node for this Source File");
    }

    this.n = number;
    this.name = `Source-File ${number}: ${bitnode.name}`;
    this.info = info;
  }
}
