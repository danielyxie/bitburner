import { NSFull } from "../NetscriptFunctions";
import { ExternalAPI } from "../Netscript/APIWrapper";
import { AutocompleteData } from "../ScriptEditor/NetscriptDefinitions";

export interface ScriptModule {
  main?: (ns: ExternalAPI<NSFull>) => unknown;
  autocomplete?: (data: AutocompleteData, flags: string[]) => unknown;
}
