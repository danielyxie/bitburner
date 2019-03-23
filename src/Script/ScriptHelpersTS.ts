// Script helper functions
export function isScriptFilename(f: string) {
    return f.endsWith(".js") || f.endsWith(".script") || f.endsWith(".ns");
}
