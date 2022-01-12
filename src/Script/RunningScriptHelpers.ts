import { GetServer } from "../Server/AllServers";
import { RunningScript } from "./RunningScript";

export function getRamUsageFromRunningScript(script: RunningScript): number {
  if (script.ramUsage != null && script.ramUsage > 0) {
    return script.ramUsage; // Use cached value
  }

  const server = GetServer(script.server);
  if (server == null) {
    return 0;
  }
  const scriptFile = server.getScript(script.filename);
  if (scriptFile === null) {
    return 0;
  }
  script.ramUsage = scriptFile.ramUsage;
  return script.ramUsage;
}
