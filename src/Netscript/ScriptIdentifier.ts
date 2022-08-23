import { ScriptArg } from "./ScriptArg";

export type ScriptIdentifier =  //This was previously in INetscriptHelper.ts, may move to its own file or a generic types file.
  | number
  | {
      scriptname: string;
      hostname: string;
      args: ScriptArg[];
    };
