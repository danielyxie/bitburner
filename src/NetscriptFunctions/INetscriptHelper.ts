import { BaseServer } from "../Server/BaseServer";
import { Faction } from "../Faction/Faction";

export interface INetscriptHelper {
  updateDynamicRam(functionName: string, ram: number): void;
  makeRuntimeErrorMsg(functionName: string, message: string): void;
  string(funcName: string, argName: string, v: any): string;
  number(funcName: string, argName: string, v: any): number;
  boolean(v: any): boolean;
  getServer(ip: any, fn: any): BaseServer;
  checkSingularityAccess(func: string, n: number): void;
  getFaction(func: string, name: string): Faction;
}
