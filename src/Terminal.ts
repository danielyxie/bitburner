import { Terminal as TTerminal } from "./Terminal/Terminal";
import { ReactNode } from "react";
declare global {
  interface Window {
    tprintRaw: (node: ReactNode) => void;
  }
}
export const Terminal = new TTerminal();
window["tprintRaw"] = Terminal.printRaw.bind(Terminal);
