export interface INetscriptHelper {
  updateDynamicRam(functionName: string, ram: number): void;
  makeRuntimeErrorMsg(functionName: string, message: string): void;
  string(funcName: string, argName: string, v: any): string;
  number(funcName: string, argName: string, v: any): number;
  boolean(v: any): boolean;
}
