const nsImportCache: { [namespace: string]: string } = {};

export class NsImportCache {
  static get(namespace: string): string {
    return nsImportCache[namespace];
  }

  static store(namespace: string, value: string): void {
    if (nsImportCache[namespace]) return;
    nsImportCache[namespace] = value;
  }
}
