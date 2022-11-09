import { ExternalAPI } from "../Netscript/APIWrapper";
import { AutocompleteData, NS } from "../ScriptEditor/NetscriptDefinitions";

export interface ScriptModule {
  main?: (ns: ExternalAPI<NS>) => unknown;
  autocomplete?: (data: AutocompleteData, flags: string[]) => unknown;
}
