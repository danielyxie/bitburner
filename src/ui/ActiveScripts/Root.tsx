/**
 * Root React Component for the "Active Scripts" UI page. This page displays
 * and provides information about all of the player's scripts that are currently running
 */
import * as React from "react";

import { ScriptProduction } from "./ScriptProduction";
import { ServerAccordions } from "./ServerAccordions";

import { WorkerScript } from "../../Netscript/WorkerScript";
import { IPlayer } from "../../PersonObjects/IPlayer";

type IProps = {
    p: IPlayer;
    workerScripts: WorkerScript[];
}

export class ActiveScriptsRoot extends React.Component<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    render() {
        return (
            <>
                <p>
                    This page displays a list of all of your scripts that are currently
                    running across every machine. It also provides information about each
                    script's production. The scripts are categorized by the hostname of
                    the servers on which they are running.
                </p>

                <ScriptProduction {...this.props} />
                <ServerAccordions {...this.props} />
            </>
        )
    }
}
