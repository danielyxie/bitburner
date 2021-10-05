export interface INetscriptHelper {
  updateDynamicRam(functionName: string, ram: number): void;
  makeRuntimeErrorMsg(functionName: string, message: string): void;
}
