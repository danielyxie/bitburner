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
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import makeStyles from "@mui/styles/makeStyles";

import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { arrayToString } from "../../utils/helpers/arrayToString";
import { Money } from "../React/Money";
import { MoneyRate } from "../React/MoneyRate";
import { RecentScript } from "../..//Netscript/RecentScripts";
import { LogBoxEvents } from "../React/LogBoxManager";

const useStyles = makeStyles({
  noborder: {
    borderBottom: "none",
  },
});

interface IProps {
  recentScript: RecentScript;
}

export function RecentScriptAccordion(props: IProps): React.ReactElement {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const recentScript = props.recentScript;

  // Calculations for script stats
  const onlineMps = recentScript.runningScript.onlineMoneyMade / recentScript.runningScript.onlineRunningTime;
  const onlineEps = recentScript.runningScript.onlineExpGained / recentScript.runningScript.onlineRunningTime;

  function logClickHandler(): void {
    LogBoxEvents.emit(recentScript.runningScript);
  }
  return (
    <>
      <ListItemButton onClick={() => setOpen((old) => !old)} component={Paper}>
        <ListItemText
          primary={
            <Typography>
              └ {recentScript.filename} (died{" "}
              {convertTimeMsToTimeElapsedString(new Date().getTime() - recentScript.timestamp.getTime())} ago)
            </Typography>
          }
        />
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
                  <Typography>{numeralWrapper.formatThreads(recentScript.runningScript.threads)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={2}>
                  <Typography>└ Args: {arrayToString(recentScript.args)}</Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Online Time:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>
                    {convertTimeMsToTimeElapsedString(recentScript.runningScript.onlineRunningTime * 1e3)}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Offline Time:</Typography>
                </TableCell>
                <TableCell className={classes.noborder}>
                  <Typography>
                    {convertTimeMsToTimeElapsedString(recentScript.runningScript.offlineRunningTime * 1e3)}
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder}>
                  <Typography>└ Total online production:</Typography>
                </TableCell>
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    <Money money={recentScript.runningScript.onlineMoneyMade} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    &nbsp;{numeralWrapper.formatExp(recentScript.runningScript.onlineExpGained) + " hacking exp"}
                  </Typography>
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
                    <Money money={recentScript.runningScript.offlineMoneyMade} />
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className={classes.noborder} colSpan={1} />
                <TableCell className={classes.noborder} align="left">
                  <Typography>
                    &nbsp;{numeralWrapper.formatExp(recentScript.runningScript.offlineExpGained) + " hacking exp"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Button onClick={logClickHandler}>LOG</Button>
        </Box>
      </Collapse>
    </>
  );
}
