import { BaseServer } from "../Server/BaseServer";

export interface INetscriptHelper {
  updateDynamicRam(functionName: string): void;
  makeRuntimeErrorMsg(functionName: string, message: string): void;
  string(funcName: string, argName: string, v: any): string;
  number(funcName: string, argName: string, v: any): number;
  boolean(v: any): boolean;
  getServer(ip: any, fn: any): BaseServer;
  checkSingularityAccess(func: string): void;
  hack(hostname: string, manual: boolean): Promise<number>;
}
