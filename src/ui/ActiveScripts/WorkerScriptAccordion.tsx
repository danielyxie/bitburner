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

import { dialogBoxCreate } from "../../../utils/DialogBox";
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
    const killScript = killWorkerScript.bind(null, scriptRef, scriptRef.server);

    function killScriptClickHandler() {
        killScript();
        dialogBoxCreate("Killing script");
    }

    // Calculations for script stats
    const onlineMps = scriptRef.onlineMoneyMade / scriptRef.onlineRunningTime;
    const onlineEps = scriptRef.onlineExpGained / scriptRef.onlineRunningTime;
    const offlineMps = scriptRef.offlineMoneyMade / scriptRef.offlineRunningTime;
    const offlineEps = scriptRef.offlineExpGained / scriptRef.offlineRunningTime;

    return (
        <Accordion
            headerClass="active-scripts-script-header"
            headerContent={
                <>{props.workerScript.name}</>
            }
            panelClass="active-scripts-script-panel"
            panelContent={
                <>
                <pre>Threads: {props.workerScript.scriptRef.threads}</pre>
                <pre>Args: {arrayToString(props.workerScript.args)}</pre>
                <pre>Online Time: {convertTimeMsToTimeElapsedString(scriptRef.onlineRunningTime * 1e3)}</pre>
                <pre>Offline Time: {convertTimeMsToTimeElapsedString(scriptRef.offlineRunningTime * 1e3)}</pre>
                <pre>Total online production: {numeralWrapper.formatMoney(scriptRef.onlineMoneyMade)}</pre>
                <pre>{(Array(26).join(" ") + numeralWrapper.formatBigNumber(scriptRef.onlineExpGained) + " hacking exp")}</pre>
                <pre>Online production rate: {numeralWrapper.formatMoney(onlineMps)} / second</pre>
                <pre>{(Array(25).join(" ") + numeralWrapper.formatBigNumber(onlineEps) + " hacking exp / second")}</pre>
                <pre>Total offline production: {numeralWrapper.formatMoney(scriptRef.offlineMoneyMade)}</pre>
                <pre>{(Array(27).join(" ") + numeralWrapper.formatBigNumber(scriptRef.offlineExpGained) + " hacking exp")}</pre>
                <pre>Offline production rate: {numeralWrapper.formatMoney(offlineMps)} / second</pre>
                <pre>{(Array(26).join(" ") + numeralWrapper.formatBigNumber(offlineEps) +  " hacking exp / second")}</pre>

                <AccordionButton
                    onClick={logClickHandler}
                    text="Log"
                />
                <AccordionButton
                    onClick={killScriptClickHandler}
                    text="Kill Script"
                />
                </>
            }
        />
    )
}
