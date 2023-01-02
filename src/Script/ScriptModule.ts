import { AutocompleteData, NS } from "../ScriptEditor/NetscriptDefinitions";

export interface ScriptModule {
  main?: (ns: NS) => Promise<void>;
  autocomplete?: (data: AutocompleteData, flags: string[]) => unknown;
}
