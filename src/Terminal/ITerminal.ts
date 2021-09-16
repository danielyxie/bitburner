import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";

export class Output {
  text: string;
  color: "inherit" | "initial" | "primary" | "secondary" | "error" | "textPrimary" | "textSecondary" | undefined;
  constructor(
    text: string,
    color: "inherit" | "initial" | "primary" | "secondary" | "error" | "textPrimary" | "textSecondary" | undefined,
  ) {
    this.text = text;
    this.color = color;
  }
}

export class Link {
  hostname: string;
  constructor(hostname: string) {
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

  print(s: string, config?: any): void;
  error(s: string): void;

  clear(): void;
  startAnalyze(): void;
  startBackdoor(player: IPlayer): void;
  startHack(player: IPlayer): void;
  finishHack(player: IPlayer, cancelled?: boolean): void;
  finishBackdoor(player: IPlayer, cancelled?: boolean): void;
  finishAnalyze(player: IPlayer, cancelled?: boolean): void;
  finishAction(player: IPlayer, cancelled?: boolean): void;
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
  executeCommand(engine: IEngine, player: IPlayer, command: string): void;
  executeCommands(engine: IEngine, player: IPlayer, commands: string): void;
  // If there was any changes, will return true, once.
  pollChanges(): boolean;
  process(player: IPlayer, cycles: number): void;
  prestige(): void;
  getProgressText(): string;
}
