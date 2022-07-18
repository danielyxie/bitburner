import { CityName } from "src/Locations/data/CityNames";
import { NetscriptContext } from "src/Netscript/APIWrapper";
import { IPort } from "src/NetscriptPort";
import { BaseServer } from "../Server/BaseServer";

export interface INetscriptHelper {
  updateDynamicRam(functionName: string, ram: number): void;
  makeRuntimeErrorMsg(functionName: string, message: string): string;
  string(funcName: string, argName: string, v: unknown): string;
  number(funcName: string, argName: string, v: unknown): number;
  city(funcName: string, argName: string, v: unknown): CityName;
  boolean(v: unknown): boolean;
  getServer(ip: string, ctx: NetscriptContext): BaseServer;
  checkSingularityAccess(func: string): void;
  hack(ctx: NetscriptContext, hostname: string, manual: boolean): Promise<number>;
  getValidPort(funcName: string, port: number): IPort;
}
