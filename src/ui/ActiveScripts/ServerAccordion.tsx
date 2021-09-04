/**
 * React Component for rendering the Accordion element for a single
 * server in the 'Active Scripts' UI page
 */
import * as React from "react";

import { WorkerScriptAccordion } from "./WorkerScriptAccordion";
import { Accordion } from "../React/Accordion";
import { ServerAccordionContent } from "./ServerAccordionContent";

import { BaseServer } from "../../Server/BaseServer";
import { WorkerScript } from "../../Netscript/WorkerScript";

import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";

type IProps = {
  server: BaseServer;
  workerScripts: WorkerScript[];
};

export function ServerAccordion(props: IProps): React.ReactElement {
  const server = props.server;

  // Accordion's header text
  // TODO: calculate the longest hostname length rather than hard coding it
  const longestHostnameLength = 18;
  const paddedName = `${server.hostname}${" ".repeat(
    longestHostnameLength,
  )}`.slice(0, Math.max(server.hostname.length, longestHostnameLength));
  const barOptions = {
    progress: server.ramUsed / server.maxRam,
    totalTicks: 30,
  };
  const headerTxt = `${paddedName} ${createProgressBarText(barOptions)}`;

  const scripts = props.workerScripts.map((ws) => {
    return (
      <WorkerScriptAccordion key={`${ws.name}_${ws.args}`} workerScript={ws} />
    );
  });

  return (
    <Accordion
      headerContent={<pre>{headerTxt}</pre>}
      panelContent={
        <ServerAccordionContent workerScripts={props.workerScripts} />
      }
    />
  );
}
