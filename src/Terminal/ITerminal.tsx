import React from "react";
import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { Settings } from "../Settings/Settings";
import { formatTime } from "../utils/helpers/formatTime";
import { BaseServer } from "../Server/BaseServer";

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
  server?: BaseServer;

  constructor(time: number, action: "h" | "b" | "a" | "g" | "w", server?: BaseServer) {
    this.time = time;
    this.timeLeft = time;
    this.action = action;
    this.server = server;
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
  startBackdoor(): void;
  startHack(): void;
  startGrow(): void;
  startWeaken(): void;
  finishHack(server: BaseServer, cancelled?: boolean): void;
  finishGrow(server: BaseServer, cancelled?: boolean): void;
  finishWeaken(server: BaseServer, cancelled?: boolean): void;
  finishBackdoor(server: BaseServer, cancelled?: boolean): void;
  finishAnalyze(server: BaseServer, cancelled?: boolean): void;
  finishAction(cancelled?: boolean): void;
  getFilepath(filename: string): string;
  getFile(filename: string): Script | TextFile | string | null;
  getScript(filename: string): Script | null;
  getTextFile(filename: string): TextFile | null;
  getLitFile(filename: string): string | null;
  cwd(): string;
  setcwd(dir: string): void;
  runContract(name: string): void;
  executeScanAnalyzeCommand(depth?: number, all?: boolean): void;
  connectToServer(server: string): void;
  executeCommand(command: string): void;
  executeCommands(commands: string): void;
  // If there was any changes, will return true, once.
  process(cycles: number): void;
  prestige(): void;
  getProgressText(): string;
}
