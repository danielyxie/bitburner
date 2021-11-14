/**
 * React Component for displaying a single WorkerScript's info as an
 * Accordion element
 */
import * as React from "react";

import { numeralWrapper } from "../numeralFormat";

import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import makeStyles from "@mui/styles/makeStyles";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { killWorkerScript } from "../../Netscript/killWorkerScript";
import { WorkerScript } from "../../Netscript/WorkerScript";

import { dialogBoxCreate } from "../React/DialogBox";
import { LogBoxEvents } from "../React/LogBoxManager";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { arrayToString } from "../../utils/helpers/arrayToString";
import { Money } from "../React/Money";
import { MoneyRate } from "../React/MoneyRate";

const useStyles = makeStyles({
  noborder: {
    borderBottom: "none",
  },
});

type IProps = {
  workerScript: WorkerScript;
};

export function WorkerScriptAccordion(props: IProps): React.ReactElement {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const workerScript = props.workerScript;
  const scriptRef = workerScript.scriptRef;

  function logClickHandler(): void {
    LogBoxEvents.emit(scriptRef);
  }
  const killScript = killWorkerScript.bind(null, scriptRef as any, scriptRef.server);

  function killScriptClickHandler(): void {
    killScript();
    dialogBoxCreate("Killing script");
  }

  // Calculations for script stats
  const onlineMps = scriptRef.onlineMoneyMade / scriptRef.onlineRunningTime;
  const onlineEps = scriptRef.onlineExpGained / scriptRef.onlineRunningTime;

  return (
    <>
      <ListItemButton onClick={() => setOpen((old) => !old)} component={Paper}>
        <ListItemText primary={<Typography>└ {props.workerScript.name} {JSON.stringify(props.workerScript.args)}</Typography>} />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} timeout={0} unmountOnExit>
        <Box mx={6}>
          <Table padding="none" size="small">
            <TableBody>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Threads:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>{numeralWrapper.formatThreads(props.workerScript.scriptRef.threads)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={2}>
                  <Typography>└ Args: {arrayToString(props.workerScript.args)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Online Time:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>{convertTimeMsToTimeElapsedString(scriptRef.onlineRunningTime * 1e3)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Offline Time:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>{convertTimeMsToTimeElapsedString(scriptRef.offlineRunningTime * 1e3)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Total online production:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <Money money={scriptRef.onlineMoneyMade} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>&nbsp;{numeralWrapper.formatExp(scriptRef.onlineExpGained) + " hacking exp"}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Online production rate:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <MoneyRate money={onlineMps} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>&nbsp;{numeralWrapper.formatExp(onlineEps) + " hacking exp / sec"}</Typography>
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Total offline production:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <Money money={scriptRef.offlineMoneyMade} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>&nbsp;{numeralWrapper.formatExp(scriptRef.offlineExpGained) + " hacking exp"}</Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <Button onClick={logClickHandler}>LOG</Button>
          <IconButton onClick={killScriptClickHandler}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      </Collapse>
    </>
  );
}
