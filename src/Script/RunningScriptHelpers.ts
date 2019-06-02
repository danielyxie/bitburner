import { AllServers } from "../Server/AllServers";
import { RunningScript } from "./RunningScript";

export function getRamUsageFromRunningScript(script: RunningScript): number {
    if (script.ramUsage != null && script.ramUsage > 0) {
        return script.ramUsage; // Use cached value
    }

    const server = AllServers[script.server];
    if (server == null) { return 0; }
    for (let i = 0; i < server.scripts.length; ++i) {
        if (server.scripts[i].filename === script.filename) {
            // Cache the ram usage for the next call
            script.ramUsage = server.scripts[i].ramUsage;
            return script.ramUsage;
        }
    }

    return 0;
}
