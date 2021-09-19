// Root React Component for the Corporation UI
import React, { useState, useEffect } from "react";

import makeStyles from "@mui/styles/makeStyles";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "./Reputation";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Fab from "@mui/material/Fab";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SaveIcon from "@mui/icons-material/Save";

import { colors } from "./Theme";
import { Settings } from "../../Settings/Settings";
import { use } from "../Context";
import { Page } from "../Router";
import { Overview } from "./Overview";

interface IProps {
  save: () => void;
}

function Intelligence(): React.ReactElement {
  const player = use.Player();
  const classes = useStyles();
  if (player.intelligence === 0) return <></>;
  return (
    <TableRow>
      <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
        <Typography classes={{ root: classes.int }}>Int&nbsp;</Typography>
      </TableCell>
      <TableCell align="right" classes={{ root: classes.cell }}>
        <Typography classes={{ root: classes.int }}>{numeralWrapper.formatSkill(player.intelligence)}</Typography>
      </TableCell>
      <TableCell align="right" classes={{ root: classes.cell }}>
        <Typography id="overview-int-hook" classes={{ root: classes.int }}>
          {/*Hook for player scripts*/}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

function Work(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const classes = useStyles();
  if (!player.isWorking || player.focus) return <></>;
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
          <Button
            onClick={() => {
              player.startFocusing();
              router.toWork();
            }}
          >
            Focus
          </Button>
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

export function CharacterOverview({ save }: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();

  if (router.page() === Page.BitVerse) return <></>;
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
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography id="overview-hp-hook" classes={{ root: classes.hp }}>
                  {/*Hook for player scripts*/}
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
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography id="overview-money-hook" classes={{ root: classes.money }}>
                  {/*Hook for player scripts*/}
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
              <TableCell align="right" classes={{ root: classes.cell }}>
                <Typography id="overview-hack-hook" classes={{ root: classes.hack }}>
                  {/*Hook for player scripts*/}
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
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography id="overview-str-hook" classes={{ root: classes.combat }}>
                  {/*Hook for player scripts*/}
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
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography id="overview-def-hook" classes={{ root: classes.combat }}>
                  {/*Hook for player scripts*/}
                </Typography>
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
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography id="overview-dex-hook" classes={{ root: classes.combat }}>
                  {/*Hook for player scripts*/}
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
              <TableCell align="right" classes={{ root: classes.cell }}>
                <Typography id="overview-agi-hook" classes={{ root: classes.combat }}>
                  {/*Hook for player scripts*/}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.cha }}>Cha&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.cha }}>{numeralWrapper.formatSkill(player.charisma)}</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography id="overview-cha-hook" classes={{ root: classes.cha }}>
                  {/*Hook for player scripts*/}
                </Typography>
              </TableCell>
            </TableRow>
            <Intelligence />

            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                <Typography id="overview-extra-hook-0" classes={{ root: classes.hack }}>
                  {/*Hook for player scripts*/}
                </Typography>
              </TableCell>
              <TableCell component="th" scope="row" align="right" classes={{ root: classes.cell }}>
                <Typography id="overview-extra-hook-1" classes={{ root: classes.hack }}>
                  {/*Hook for player scripts*/}
                </Typography>
              </TableCell>
              <TableCell component="th" scope="row" align="right" classes={{ root: classes.cell }}>
                <Typography id="overview-extra-hook-2" classes={{ root: classes.hack }}>
                  {/*Hook for player scripts*/}
                </Typography>
              </TableCell>
            </TableRow>
            <Work />

            <TableRow>
              <TableCell align="center" colSpan={2} classes={{ root: classes.cellNone }}>
                <IconButton onClick={save}>
                  <SaveIcon color={Settings.AutosaveInterval !== 0 ? "primary" : "error"} />
                </IconButton>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
