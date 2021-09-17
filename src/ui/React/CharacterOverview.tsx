// Root React Component for the Corporation UI
import React, { useState, useEffect } from "react";

import makeStyles from "@mui/styles/makeStyles";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "./Reputation";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";

import { colors } from "./Theme";
import { Settings } from "../../Settings/Settings";

interface IProps {
  player: IPlayer;
  save: () => void;
}

function Intelligence({ player }: { player: IPlayer }): React.ReactElement {
  if (player.intelligence === 0) return <></>;
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
        <Typography classes={{ root: classes.int }}>Int&nbsp;</Typography>
      </TableCell>
      <TableCell align="right" classes={{ root: classes.cell }}>
        <Typography classes={{ root: classes.int }}>{numeralWrapper.formatSkill(player.intelligence)}</Typography>
      </TableCell>
    </TableRow>
  );
}

function Work({ player }: { player: IPlayer }): React.ReactElement {
  if (!player.isWorking || player.focus) return <></>;
  const classes = useStyles();
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
          <Typography>Work&nbsp;in&nbsp;progress:</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
          <Typography>+{Reputation(player.workRepGained)} rep</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row" align="center" colSpan={2} classes={{ root: classes.cellNone }}>
          <Button onClick={() => player.startFocusing()}>Focus</Button>
        </TableCell>
      </TableRow>
    </>
  );
}

const useStyles = makeStyles({
  cellNone: {
    borderBottom: "none",
    padding: 0,
    margin: 0,
  },
  cell: {
    padding: 0,
    margin: 0,
  },
  hp: {
    color: colors.hp,
  },
  money: {
    color: colors.money,
  },
  hack: {
    color: colors.hack,
  },
  combat: {
    color: colors.combat,
  },
  cha: {
    color: colors.cha,
  },
  int: {
    color: colors.int,
  },
});

export function CharacterOverview({ player, save }: IProps): React.ReactElement {
  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 600);
    return () => clearInterval(id);
  }, []);

  const classes = useStyles();
  return (
    <Paper square>
      <Box m={1}>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.hp }}>HP&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.hp }}>
                  {numeralWrapper.formatHp(player.hp)}&nbsp;/&nbsp;{numeralWrapper.formatHp(player.max_hp)}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.money }}>Money&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.money }}>
                  {numeralWrapper.formatMoney(player.money.toNumber())}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                <Typography classes={{ root: classes.hack }}>Hack&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cell }}>
                <Typography classes={{ root: classes.hack }}>
                  {numeralWrapper.formatSkill(player.hacking_skill)}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>Str&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>
                  {numeralWrapper.formatSkill(player.strength)}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>Def&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.defense)}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>Dex&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>
                  {numeralWrapper.formatSkill(player.dexterity)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                <Typography classes={{ root: classes.combat }}>Agi&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cell }}>
                <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.agility)}</Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.cha }}>Cha&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.cha }}>{numeralWrapper.formatSkill(player.charisma)}</Typography>
              </TableCell>
            </TableRow>
            <Intelligence player={player} />
            <Work player={player} />

            <TableRow>
              <TableCell align="center" colSpan={2} classes={{ root: classes.cellNone }}>
                <Button color={Settings.AutosaveInterval !== 0 ? "primary" : "secondary"} onClick={save}>
                  SAVE
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
