/**
 * React Component for rendering the Accordion elements for all servers
 * on which scripts are running
 */
import * as React from "react";

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
    [key: string]: IServerData;
}

type IProps = {
    workerScripts: Map<number, WorkerScript>;
};

type IState = {
    rerenderFlag: boolean;
}


const subscriberId = "ActiveScriptsUI";

export class ServerAccordions extends React.Component<IProps, IState> {
    serverToScriptMap: IServerToScriptsMap = {};

    constructor(props: IProps) {
        super(props);

        this.state = {
            rerenderFlag: false,
        }

        this.updateServerToScriptsMap();

        this.rerender = this.rerender.bind(this);
    }

    componentDidMount(): void {
        WorkerScriptStartStopEventEmitter.addSubscriber({
            cb: this.rerender,
            id: subscriberId,
        })
    }

    componentWillUnmount(): void {
        WorkerScriptStartStopEventEmitter.removeSubscriber(subscriberId);
    }

    updateServerToScriptsMap(): void {
        const map: IServerToScriptsMap = {};

        for (const ws of this.props.workerScripts.values()) {
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

    rerender(): void {
        this.updateServerToScriptsMap();
        this.setState((prevState) => {
            return { rerenderFlag: !prevState.rerenderFlag }
        });
    }

    render(): React.ReactNode {
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
