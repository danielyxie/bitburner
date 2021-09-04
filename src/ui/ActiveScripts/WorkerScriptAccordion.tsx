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
import { Money } from "../React/Money";

type IProps = {
  workerScript: WorkerScript;
};

export function WorkerScriptAccordion(props: IProps): React.ReactElement {
  const workerScript = props.workerScript;
  const scriptRef = workerScript.scriptRef;

  const logClickHandler = logBoxCreate.bind(null, scriptRef);
  const killScript = killWorkerScript.bind(
    null,
    scriptRef as any,
    scriptRef.server,
  );

  function killScriptClickHandler(): void {
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
      headerContent={<>{props.workerScript.name}</>}
      panelClass="active-scripts-script-panel"
      panelContent={
        <>
          <pre>
            Threads:{" "}
            {numeralWrapper.formatThreads(props.workerScript.scriptRef.threads)}
          </pre>
          <pre>Args: {arrayToString(props.workerScript.args)}</pre>
          <pre>
            Online Time:{" "}
            {convertTimeMsToTimeElapsedString(
              scriptRef.onlineRunningTime * 1e3,
            )}
          </pre>
          <pre>
            Offline Time:{" "}
            {convertTimeMsToTimeElapsedString(
              scriptRef.offlineRunningTime * 1e3,
            )}
          </pre>
          <pre>
            Total online production: <Money money={scriptRef.onlineMoneyMade} />
          </pre>
          <pre>
            {Array(26).join(" ") +
              numeralWrapper.formatExp(scriptRef.onlineExpGained) +
              " hacking exp"}
          </pre>
          <pre>
            Online production rate: <Money money={onlineMps} /> / second
          </pre>
          <pre>
            {Array(25).join(" ") +
              numeralWrapper.formatExp(onlineEps) +
              " hacking exp / second"}
          </pre>
          <pre>
            Total offline production:{" "}
            <Money money={scriptRef.offlineMoneyMade} />
          </pre>
          <pre>
            {Array(27).join(" ") +
              numeralWrapper.formatExp(scriptRef.offlineExpGained) +
              " hacking exp"}
          </pre>
          <pre>
            Offline production rate: <Money money={offlineMps} /> / second
          </pre>
          <pre>
            {Array(26).join(" ") +
              numeralWrapper.formatExp(offlineEps) +
              " hacking exp / second"}
          </pre>

          <AccordionButton onClick={logClickHandler} text="Log" />
          <AccordionButton
            onClick={killScriptClickHandler}
            text="Kill Script"
          />
        </>
      }
    />
  );
}
