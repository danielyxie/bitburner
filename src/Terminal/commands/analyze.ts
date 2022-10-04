import { Terminal } from "../../Terminal";

export function analyze(args: (string | number | boolean)[]): void {
  if (args.length !== 0) {
    Terminal.error("Incorrect usage of analyze command. Usage: analyze");
    return;
  }
  Terminal.startAnalyze();
}
