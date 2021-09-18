/**
 * React Component for rendering the Accordion element for a single
 * server in the 'Active Scripts' UI page
 */
import * as React from "react";

import Typography from "@mui/material/Typography";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { ServerAccordionContent } from "./ServerAccordionContent";

import { BaseServer } from "../../Server/BaseServer";
import { WorkerScript } from "../../Netscript/WorkerScript";

import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";

type IProps = {
  server: BaseServer;
  workerScripts: WorkerScript[];
};

export function ServerAccordion(props: IProps): React.ReactElement {
  const [open, setOpen] = React.useState(false);
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
  const headerTxt = `${createProgressBarText(barOptions)}`;

  return (
    <>
      <ListItemButton onClick={() => setOpen((old) => !old)} component={Paper}>
        <ListItemText primary={<Typography style={{ whiteSpace: "pre-wrap" }}>{paddedName}[<Typography display="inline" className="active-scripts-accordion-override">{headerTxt}</Typography>]</Typography>} />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} timeout={0} unmountOnExit>
        <ServerAccordionContent workerScripts={props.workerScripts} />
      </Collapse>
    </>
  );
}
