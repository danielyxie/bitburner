export const validScriptExtensions: Array<string> = [`.js`, `.script`, `.ns`];

export function isScriptFilename(f: string): boolean {
  return validScriptExtensions.some((ext) => f.endsWith(ext));
}
