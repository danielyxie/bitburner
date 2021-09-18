/**
 * React Component for rendering the Accordion elements for all servers
 * on which scripts are running
 */
import React, { useState, useEffect } from "react";

import { ServerAccordion } from "./ServerAccordion";

import { WorkerScript } from "../../Netscript/WorkerScript";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";
import { getServer } from "../../Server/ServerHelpers";
import { BaseServer } from "../../Server/BaseServer";

// Map of server hostname -> all workerscripts on that server for all active scripts
interface IServerData {
  server: BaseServer;
  workerScripts: WorkerScript[];
}

interface IServerToScriptsMap {
  [key: string]: IServerData | undefined;
}

type IProps = {
  workerScripts: Map<number, WorkerScript>;
};

type IState = {
  rerenderFlag: boolean;
};

const subscriberId = "ActiveScriptsUI";

export function ServerAccordions(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    WorkerScriptStartStopEventEmitter.addSubscriber({
      cb: rerender,
      id: subscriberId,
    });
    return () => WorkerScriptStartStopEventEmitter.removeSubscriber(subscriberId);
  }, []);

  const serverToScriptMap: IServerToScriptsMap = {};
  for (const ws of props.workerScripts.values()) {
    const server = getServer(ws.serverIp);
    if (server == null) {
      console.warn(`WorkerScript has invalid IP address: ${ws.serverIp}`);
      continue;
    }

    let data = serverToScriptMap[server.hostname];

    if (data === undefined) {
      serverToScriptMap[server.hostname] = {
        server: server,
        workerScripts: [],
      };
      data = serverToScriptMap[server.hostname];
    }
    if (data !== undefined) data.workerScripts.push(ws);
  }

  return (
    <ul className="active-scripts-list" id="active-scripts-list">
      {Object.values(serverToScriptMap).map((data) => {
        return (
          data && <ServerAccordion key={data.server.hostname} server={data.server} workerScripts={data.workerScripts} />
        );
      })}
    </ul>
  );
}
