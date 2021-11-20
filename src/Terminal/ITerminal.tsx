import React from "react";
import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IRouter } from "../ui/Router";
import { Settings } from "../Settings/Settings";
import { formatTime } from "../utils/helpers/formatTime";

export class Output {
  text: string;
  color: "primary" | "error" | "success" | "info" | "warn";
  constructor(text: string, color: "primary" | "error" | "success" | "info" | "warn") {
    if (Settings.TimestampsFormat) text = "[" + formatTime(Settings.TimestampsFormat) + "] " + text;
    this.text = text;
    this.color = color;
  }
}

export class RawOutput {
  raw: React.ReactNode;
  constructor(node: React.ReactNode) {
    if (Settings.TimestampsFormat)
      node = (
        <>
          [{formatTime(Settings.TimestampsFormat)}] {node}
        </>
      );
    this.raw = node;
  }
}

export class Link {
  hostname: string;
  dashes: string;
  constructor(dashes: string, hostname: string) {
    if (Settings.TimestampsFormat) dashes = "[" + formatTime(Settings.TimestampsFormat) + "] " + dashes;
    this.hostname = hostname;
    this.dashes = dashes;
  }
}

export class TTimer {
  time: number;
  timeLeft: number;
  action: "h" | "b" | "a" | "g" | "w";

  constructor(time: number, action: "h" | "b" | "a" | "g" | "w") {
    this.time = time;
    this.timeLeft = time;
    this.action = action;
  }
}

export interface ITerminal {
  action: TTimer | null;

  commandHistory: string[];
  commandHistoryIndex: number;

  outputHistory: (Output | Link | RawOutput)[];

  // True if a Coding Contract prompt is opened
  contractOpen: boolean;

  // Full Path of current directory
  // Excludes the trailing forward slash
  currDir: string;

  print(s: string): void;
  printRaw(node: React.ReactNode): void;
  error(s: string): void;
  success(s: string): void;
  info(s: string): void;
  warn(s: string): void;

  clear(): void;
  startAnalyze(): void;
  startBackdoor(player: IPlayer): void;
  startHack(player: IPlayer): void;
  startGrow(player: IPlayer): void;
  startWeaken(player: IPlayer): void;
  finishHack(router: IRouter, player: IPlayer, cancelled?: boolean): void;
  finishGrow(player: IPlayer, cancelled?: boolean): void;
  finishWeaken(player: IPlayer, cancelled?: boolean): void;
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
