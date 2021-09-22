import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IRouter } from "../ui/Router";
import { Settings } from "../Settings/Settings";
import { getTimestamp } from "../../utils/helpers/getTimestamp";

export class Output {
  text: string;
  color: "inherit" | "initial" | "primary" | "secondary" | "error" | "textPrimary" | "textSecondary" | undefined;
  constructor(
    text: string,
    color: "inherit" | "initial" | "primary" | "secondary" | "error" | "textPrimary" | "textSecondary" | undefined,
  ) {
    if (Settings.EnableTimestamps) text = "[" + getTimestamp() + "] " + text;
    this.text = text;
    this.color = color;
  }
}

export class Link {
  hostname: string;
  constructor(hostname: string) {
    if (Settings.EnableTimestamps) hostname = "[" + getTimestamp() + "] " + hostname;
    this.hostname = hostname;
  }
}

export class TTimer {
  time: number;
  timeLeft: number;
  action: "h" | "b" | "a";

  constructor(time: number, action: "h" | "b" | "a") {
    this.time = time;
    this.timeLeft = time;
    this.action = action;
  }
}

export interface ITerminal {
  action: TTimer | null;

  commandHistory: string[];
  commandHistoryIndex: number;

  outputHistory: (Output | Link)[];

  // True if a Coding Contract prompt is opened
  contractOpen: boolean;

  // Full Path of current directory
  // Excludes the trailing forward slash
  currDir: string;

  print(s: string): void;
  error(s: string): void;

  clear(): void;
  startAnalyze(): void;
  startBackdoor(player: IPlayer): void;
  startHack(player: IPlayer): void;
  finishHack(router: IRouter, player: IPlayer, cancelled?: boolean): void;
  finishBackdoor(router: IRouter, player: IPlayer, cancelled?: boolean): void;
  finishAnalyze(player: IPlayer, cancelled?: boolean): void;
  finishAction(router: IRouter, player: IPlayer, cancelled?: boolean): void;
  getFilepath(filename: string): string;
  getFile(player: IPlayer, filename: string): Script | TextFile | string | null;
  getScript(player: IPlayer, filename: string): Script | null;
  getTextFile(player: IPlayer, filename: string): TextFile | null;
  getLitFile(player: IPlayer, filename: string): string | null;
  cwd(): string;
  setcwd(dir: string): void;
  runContract(player: IPlayer, name: string): void;
  executeScanAnalyzeCommand(player: IPlayer, depth?: number, all?: boolean): void;
  connectToServer(player: IPlayer, server: string): void;
  executeCommand(router: IRouter, player: IPlayer, command: string): void;
  executeCommands(router: IRouter, player: IPlayer, commands: string): void;
  // If there was any changes, will return true, once.
  process(router: IRouter, player: IPlayer, cycles: number): void;
  prestige(): void;
  getProgressText(): string;
}
