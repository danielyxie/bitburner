import { CityName } from "../Locations/data/CityNames";
import { NetscriptContext } from "../Netscript/APIWrapper";
import { IPort } from "../NetscriptPort";
import { IPlayer } from "../PersonObjects/IPlayer";
import { Server } from "../Server/Server";
import { BaseServer } from "../Server/BaseServer";
import { FormulaGang } from "../Gang/formulas/formulas";
import { GangMember } from "../Gang/GangMember";
import { GangMemberTask } from "../Gang/GangMemberTask";
import { BasicHGWOptions } from "../ScriptEditor/NetscriptDefinitions";

export interface INetscriptHelper {
  updateDynamicRam(functionName: string, ram: number): void;
  makeRuntimeErrorMsg(functionName: string, message: string): string;
  string(funcName: string, argName: string, v: unknown): string;
  number(funcName: string, argName: string, v: unknown): number;
  city(funcName: string, argName: string, v: unknown): CityName;
  boolean(v: unknown): boolean;
  getServer(ip: string, ctx: NetscriptContext): BaseServer;
  checkSingularityAccess(func: string): void;
  hack(ctx: NetscriptContext, hostname: string, manual: boolean, extra?: BasicHGWOptions): Promise<number>;
  getValidPort(funcName: string, port: number): IPort;
  player(funcName: string, p: unknown): IPlayer;
  server(funcName: string, s: unknown): Server;
  gang(funcName: string, g: unknown): FormulaGang;
  gangMember(funcName: string, m: unknown): GangMember;
  gangTask(funcName: string, m: unknown): GangMemberTask;
}
