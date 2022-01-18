import { ScriptUrl } from "../Script/ScriptUrl";

const importCache: { [hash: string]: ScriptUrl[] } = {};

export class ImportCache {
  static get(hash: string): ScriptUrl[] | null {
    return importCache[hash] || null;
  }

  static store(hash: string, value: ScriptUrl[]): void {
    if (importCache[hash]) return;
    importCache[hash] = value;
  }

  static remove(hash: string): void {
    delete importCache[hash];
  }
}
