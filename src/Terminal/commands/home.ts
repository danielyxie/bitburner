import { Terminal } from "../../Terminal";
import { Player } from "@player";

export function home(args: (string | number | boolean)[]): void {
  if (args.length !== 0) {
    Terminal.error("Incorrect usage of home command. Usage: home");
    return;
  }
  Player.getCurrentServer().isConnectedTo = false;
  Player.currentServer = Player.getHomeComputer().hostname;
  Player.getCurrentServer().isConnectedTo = true;
  Terminal.print("Connected to home");
  Terminal.setcwd("/");
}
