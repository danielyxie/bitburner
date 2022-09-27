import { AutocompleteData, NS } from "../ScriptEditor/NetscriptDefinitions";

export interface ScriptModule {
  main?: (ns: NS) => unknown;
  autocomplete?: (data: AutocompleteData, flags: string[]) => unknown;
}
