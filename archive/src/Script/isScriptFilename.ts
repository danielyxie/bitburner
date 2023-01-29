export const validScriptExtensions: Array<string> = [`.js`, `.script`];

export function isScriptFilename(f: string): boolean {
  return validScriptExtensions.some((ext) => f.endsWith(ext));
}
