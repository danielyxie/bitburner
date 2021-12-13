import { ScriptUrl } from "../Script/ScriptUrl";

const importCache: { [hash: string]: ScriptUrl[] } = {};

export class ImportCache {
  static get(hash: string) {
    return importCache[hash];
  }

  static store(hash: string, value: ScriptUrl[]): void {
    if (importCache[hash]) return;
    importCache[hash] = value;
  }
}
