// Root React Component for the Corporation UI
import React, { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "./Reputation";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";

import { colors } from "./Theme";

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
                <Button color="primary" onClick={save}>
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
