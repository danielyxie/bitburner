/**
 * React Component for displaying a single WorkerScript's info as an
 * Accordion element
 */
import * as React from "react";

import { numeralWrapper } from "../numeralFormat";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AccordionButton } from "../React/AccordionButton";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

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
  const [open, setOpen] = React.useState(false);
  const workerScript = props.workerScript;
  const scriptRef = workerScript.scriptRef;

  const logClickHandler = logBoxCreate.bind(null, scriptRef);
  const killScript = killWorkerScript.bind(null, scriptRef as any, scriptRef.server);

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
    <>
      <ListItemButton onClick={() => setOpen((old) => !old)} component={Paper}>
        <ListItemText
          primary={<Typography style={{ whiteSpace: "pre-wrap" }}>└ {props.workerScript.name}</Typography>}
        />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout={0} unmountOnExit>
        <Box mx={4}>
          <pre>Threads: {numeralWrapper.formatThreads(props.workerScript.scriptRef.threads)}</pre>
          <pre>Args: {arrayToString(props.workerScript.args)}</pre>
          <pre>Online Time: {convertTimeMsToTimeElapsedString(scriptRef.onlineRunningTime * 1e3)}</pre>
          <pre>Offline Time: {convertTimeMsToTimeElapsedString(scriptRef.offlineRunningTime * 1e3)}</pre>
          <pre>
            Total online production: <Money money={scriptRef.onlineMoneyMade} />
          </pre>
          <pre>{Array(26).join(" ") + numeralWrapper.formatExp(scriptRef.onlineExpGained) + " hacking exp"}</pre>
          <pre>
            Online production rate: <Money money={onlineMps} /> / second
          </pre>
          <pre>{Array(25).join(" ") + numeralWrapper.formatExp(onlineEps) + " hacking exp / second"}</pre>
          <pre>
            Total offline production: <Money money={scriptRef.offlineMoneyMade} />
          </pre>
          <pre>{Array(27).join(" ") + numeralWrapper.formatExp(scriptRef.offlineExpGained) + " hacking exp"}</pre>
          <pre>
            Offline production rate: <Money money={offlineMps} /> / second
          </pre>
          <pre>{Array(26).join(" ") + numeralWrapper.formatExp(offlineEps) + " hacking exp / second"}</pre>

          <Button onClick={logClickHandler}>
            <Typography>Log</Typography>
          </Button>
          <IconButton onClick={killScriptClickHandler}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      </Collapse>
    </>
  );
}
