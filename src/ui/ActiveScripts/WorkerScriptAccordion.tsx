/**
 * React Component for displaying a single WorkerScript's info as an
 * Accordion element
 */
import * as React from "react";

import { numeralWrapper } from "../numeralFormat";

import { Accordion } from "../React/Accordion";
import { AccordionButton } from "../React/AccordionButton";

import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { WorkerScript } from "../../Netscript/WorkerScript";

import { logBoxCreate } from "../../../utils/LogBox";
import { convertTimeMsToTimeElapsedString } from "../../../utils/StringHelperFunctions";
import { arrayToString } from "../../../utils/helpers/arrayToString";

type IProps = {
    workerScript: WorkerScript;
}

export function WorkerScriptAccordion(props: IProps): React.ReactElement {
    const workerScript = props.workerScript;
    const scriptRef = workerScript.scriptRef;

    const logClickHandler = logBoxCreate.bind(null, scriptRef);
    const killScriptButton = killWorkerScript.bind(null, scriptRef, scriptRef.server);

    // Calculations for script stats
    const onlineMps = scriptRef.onlineMoneyMade / scriptRef.onlineRunningTime;
    const onlineEps = scriptRef.onlineExpGained / scriptRef.onlineRunningTime;
    const offlineMps = scriptRef.offlineMoneyMade / scriptRef.offlineRunningTime;
    const offlineEps = scriptRef.offlineExpGained / scriptRef.offlineRunningTime;

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
                <p>Threads: {props.workerScript.scriptRef.threads}</p>
                <p>Args: {arrayToString(props.workerScript.args)}</p>
                <p>Online Time: {convertTimeMsToTimeElapsedString(scriptRef.onlineRunningTime * 1e3)}</p>
                <p>Offline Time: {convertTimeMsToTimeElapsedString(scriptRef.offlineRunningTime * 1e3)}</p>
                <p>Total online production: {numeralWrapper.formatMoney(scriptRef.onlineMoneyMade)}</p>
                <p>{(Array(26).join(" ") + numeralWrapper.formatBigNumber(scriptRef.onlineExpGained) + " hacking exp").replace( / /g, "&nbsp;")}</p>
                <p>Online production rate: {numeralWrapper.formatMoney(onlineMps)} / second</p>
                <p>{(Array(25).join(" ") + numeralWrapper.formatBigNumber(onlineEps) + " hacking exp / second").replace( / /g, "&nbsp;")}</p>
                <p>Total offline production: {numeralWrapper.formatMoney(scriptRef.offlineMoneyMade)}</p>
                <p>{(Array(27).join(" ") + numeralWrapper.formatBigNumber(scriptRef.offlineExpGained) + " hacking exp").replace( / /g, "&nbsp;")}</p>
                <p>Offline production rate: {numeralWrapper.formatMoney(offlineMps)} / second</p>
                <p>{(Array(26).join(" ") + numeralWrapper.formatBigNumber(offlineEps) +  " hacking exp / second").replace( / /g, "&nbsp;")}</p>

                <AccordionButton
                    onClick={logClickHandler}
                    text="Log"
                />
                <AccordionButton
                    onClick={killScriptButton}
                    text="Kill Script"
                />
                </>
            }
        />
    )
}
