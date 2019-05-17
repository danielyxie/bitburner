/**
 * React Component for rendering the Accordion elements for all servers
 * on which scripts are running
 */
import * as React from "react";

import { ServerAccordion } from "./ServerAccordion";

import { getServer } from "../../Server/ServerHelpers";
import { BaseServer } from "../../Server/BaseServer";
import { WorkerScript } from "../../Netscript/WorkerScript";

// Map of server hostname -> all workerscripts on that server for all active scripts
interface IServerData {
    server: BaseServer;
    workerScripts: WorkerScript[];
}

interface IServerToScriptsMap {
    [key: string]: IServerData;
}

type IProps = {
    workerScripts: WorkerScript[];
};

export class ServerAccordions extends React.Component<IProps> {
    serverToScriptMap: IServerToScriptsMap = {};

    constructor(props: IProps) {
        super(props);

        this.updateServerToScriptsMap();

        // TODO
        // We subscribe to an event emitter that publishes whenever a script is
        // started/stopped. This allows us to only update the map when necessary
    }

    updateServerToScriptsMap(): void {
        const map: IServerToScriptsMap = {};

        for (const ws of this.props.workerScripts) {
            const server = getServer(ws.serverIp);
            if (server == null) {
                console.warn(`WorkerScript has invalid IP address: ${ws.serverIp}`);
                continue;
            }

            if (map[server.hostname] == null) {
                map[server.hostname] = {
                    server: server,
                    workerScripts: [],
                };
            }

            map[server.hostname].workerScripts.push(ws);
        }

        this.serverToScriptMap = map;
    }

    render() {
        const elems = Object.keys(this.serverToScriptMap).map((serverName) => {
            const data = this.serverToScriptMap[serverName];
            return (
                <ServerAccordion
                    key={serverName}
                    server={data.server}
                    workerScripts={data.workerScripts}
                />
            )
        });

        return (
            <ul className="active-scripts-list" id="active-scripts-list">
                {elems}
            </ul>
        )
    }
}
