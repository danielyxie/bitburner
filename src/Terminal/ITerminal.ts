import { TextFile } from "../TextFile";
import { Script } from "../Script/Script";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";

export interface ITerminal {
  print(s: string, config?: any): void;
  error(s: string): void;

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
  resetTerminalInput(): void;
  cwd(): string;
  setcwd(dir: string): void;
  runContract(player: IPlayer, name: string): void;
  executeScanAnalyzeCommand(player: IPlayer, depth?: number, all?: boolean): void;
  connectToServer(player: IPlayer, server: string): void;
  executeCommand(engine: IEngine, player: IPlayer, command: string): void;
  executeCommands(engine: IEngine, player: IPlayer, commands: string): void;
}
