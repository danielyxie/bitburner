/**
 * React Component for displaying a single WorkerScript's info as an
 * Accordion element
 */
import * as React from "react";

import { Accordion } from "../React/Accordion";

import { WorkerScript } from "../../Netscript/WorkerScript";

import { arrayToString } from "../../../utils/helpers/arrayToString";

type IProps = {
    workerScript: WorkerScript;
}

export function WorkerScriptAccordion(props: IProps): React.ReactElement {


    return (
        <Accordion
            headerClass="active-scripts-script-header"
            headerContent={
                <>
                </>
            }
            panelClass="active-scripts-script-panel"
            panelContent={
                <>
                <p>
                    Threads: {props.workerScript.scriptRef.threads}
                </p>
                <p>
                    Args: {arrayToString(props.workerScript.args)}
                </p>
                </>
            }
        />
    )
}
