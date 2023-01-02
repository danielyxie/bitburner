import { startWorkerScript } from "../../../src/NetscriptWorker";
import { Server } from "../../../src/Server/Server";
import { RunningScript } from "../../../src/Script/RunningScript";
import { AddToAllServers, DeleteServer } from "../../../src/Server/AllServers";
import { WorkerScriptStartStopEventEmitter } from "../../../src/Netscript/WorkerScriptStartStopEventEmitter";
import { AlertEvents } from "../../../src/ui/React/AlertManager";

test.each([
  {
    name: "NS1 test /w import",
    expected: ["false home 8", "Script finished running"],
    scripts: [
      {
        name: "import.script",
        code: `
        export function getInfo() {
          return stock.has4SData();
        }
      `,
      },
      {
        name: "simple_test.script",
        code: `
        import { getInfo } from "import.script";

        var access = getInfo();
        var server = getServer();
        printf("%s %s %d", access, server.hostname, server.maxRam);
      `,
      },
    ],
  },
  /*  { // Doesn't work, due to issues with URL.createObjectURL
    name: "NS2 test, no import",
    expected: [
      "false home 8",
      "Script finished running",
    ],
    scripts: [
      {name: "simple_test.js", code: `
        export async function main(ns) {
          var access = ns.stock.has4SData();
          var server = ns.getServer();
          ns.printf("%s %s %d", access, server.hostname, server.maxRam);
        }
      `},
    ],
  },*/
])("Netscript execution: $name", async function ({ expected: expectedLog, scripts }) {
  let server, eventDelete, alertDelete;
  try {
    const alerted = new Promise((resolve) => {
      alertDelete = AlertEvents.subscribe((x) => resolve(x));
    });
    server = new Server({ hostname: "home", hasAdminRights: true, maxRam: 8 });
    AddToAllServers(server);
    for (const s of scripts) {
      expect(server.writeToScriptFile(s.name, s.code)).toEqual({ success: true, overwritten: false });
    }

    const script = server.scripts[server.scripts.length - 1];
    expect(script.filename).toEqual(scripts[scripts.length - 1].name);

    const runningScript = new RunningScript(script);
    runningScript.threads = 1;
    expect(startWorkerScript(runningScript, server)).toBeGreaterThan(0);
    // We don't care about start, so subscribe after that. Await script death.
    const result = await Promise.race([
      alerted,
      new Promise((resolve) => {
        eventDelete = WorkerScriptStartStopEventEmitter.subscribe(() => resolve(null));
      }),
    ]);
    // If an error alert was thrown, we catch it here.
    expect(result).toBeNull();
    expect(runningScript.logs).toEqual(expectedLog);
  } finally {
    if (eventDelete) eventDelete();
    if (server) DeleteServer(server.hostname);
    if (alertDelete) alertDelete();
  }
});
