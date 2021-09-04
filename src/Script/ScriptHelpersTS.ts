// Script helper functions
export function isScriptFilename(f: string): boolean {
  return f.endsWith(".js") || f.endsWith(".script") || f.endsWith(".ns");
}
