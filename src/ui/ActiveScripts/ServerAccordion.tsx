/**
 * React Component for rendering the Accordion element for a single
 * server in the 'Active Scripts' UI page
 */
import * as React from "react";

import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
  const paddedName = `${server.hostname}${" ".repeat(longestHostnameLength)}`.slice(
    0,
    Math.max(server.hostname.length, longestHostnameLength),
  );
  const barOptions = {
    progress: server.ramUsed / server.maxRam,
    totalTicks: 30,
  };
  const headerTxt = `${paddedName} ${createProgressBarText(barOptions)}`;

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography style={{ whiteSpace: "pre-wrap" }} color="primary">
          {headerTxt}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <ServerAccordionContent workerScripts={props.workerScripts} />
      </AccordionDetails>
    </Accordion>
  );
}
