import { CityName } from "src/Locations/data/CityNames";
import { BaseServer } from "../Server/BaseServer";

export interface INetscriptHelper {
  updateDynamicRam(functionName: string, ram: number): void;
  makeRuntimeErrorMsg(functionName: string, message: string): void;
  string(funcName: string, argName: string, v: unknown): string;
  number(funcName: string, argName: string, v: unknown): number;
  city(funcName: string, argName: string, v: unknown): CityName;
  boolean(v: unknown): boolean;
  getServer(ip: any, fn: any): BaseServer;
  checkSingularityAccess(func: string): void;
  hack(hostname: string, manual: boolean): Promise<number>;
}
