/**
 * React Component for displaying the total production and production rate
 * of scripts on the 'Active Scripts' UI page
 */
import * as React from "react";

import { WorkerScript } from "../../Netscript/WorkerScript";
import { Money } from "../React/Money";
import { MoneyRate } from "../React/MoneyRate";
import { use } from "../Context";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type IProps = {
  workerScripts: Map<number, WorkerScript>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cell: {
      borderBottom: "none",
      padding: theme.spacing(1),
      margin: theme.spacing(1),
      whiteSpace: "nowrap",
    },
    size: {
      width: "1px",
    },
  }),
);
export function ScriptProduction(props: IProps): React.ReactElement {
  const player = use.Player();
  const classes = useStyles();
  const prodRateSinceLastAug = player.scriptProdSinceLastAug / (player.playtimeSinceLastAug / 1000);

  let onlineProduction = 0;
  for (const ws of props.workerScripts.values()) {
    onlineProduction += ws.scriptRef.onlineMoneyMade / ws.scriptRef.onlineRunningTime;
  }

  return (
    <Table size="small" classes={{ root: classes.size }}>
      <TableBody>
        <TableRow>
          <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
            <Typography variant="body2">Total online production of Active scripts:</Typography>
          </TableCell>
          <TableCell align="left" classes={{ root: classes.cell }}>
            <Typography variant="body2">
              <Money money={player.scriptProdSinceLastAug} />
            </Typography>
          </TableCell>
        </TableRow>
        <TableRow style={{ width: "1px" }}>
          <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
            <Typography variant="body2">Total online production since last Aug installation:</Typography>
          </TableCell>
          <TableCell align="left" classes={{ root: classes.cell }}>
            <Typography variant="body2">
              (<MoneyRate money={prodRateSinceLastAug} />)
            </Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
