import { Script } from "../Script/Script";
import { GetAllServers } from "../Server/AllServers";

const changes: [RegExp, string][] = [
  [/ns.getHackTime/g, "((...a)=>ns.getHackTime(...a)/1000)"],
  [/ns.getGrowTime/g, "((...a)=>ns.getGrowTime(...a)/1000)"],
  [/ns.getWeakenTime/g, "((...a)=>ns.getWeakenTime(...a)/1000)"],
  [/ns.bladeburner.getActionTime/g, "((...a)=>ns.bladeburner.getActionTime(...a)/1000)"],
  [/ns.hackAnalyzePercent/g, "((...a)=>ns.hackAnalyze(...a)*100)"],
  [/ns.hackChance/g, "ns.hackAnalyzeChance"],
];
function hasChanges(code: string): boolean {
  for (const change of changes) {
    if (code.match(change[0])) return true;
  }
  return false;
}

function convert(code: string): string {
  const lines = code.split("\n");
  const out: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const orig = lines[i];
    let line = lines[i];
    for (const change of changes) {
      line = line.replace(change[0], change[1]);
    }
    if (line != orig) {
      out.push(`// =============================== original line ===============================`);
      out.push(`// ${orig}`);
      out.push(`// =============================================================================`);
    }
    out.push(line);
  }
  return out.join("\n");
}

export function v1APIBreak(): void {
  for (const server of GetAllServers()) {
    const backups: Script[] = [];
    for (const script of server.scripts) {
      if (!hasChanges(script.code)) continue;
      backups.push(new Script("BACKUP_" + script.filename, script.code, script.server));
      script.code = convert(script.code);
    }
    server.scripts = server.scripts.concat(backups);
  }
}
