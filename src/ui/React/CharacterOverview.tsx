// Root React Component for the Corporation UI
import React, { useState, useEffect } from "react";

import { Theme, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "./Reputation";
import { KillScriptsModal } from "./KillScriptsModal";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ClearAllIcon from "@mui/icons-material/ClearAll";

import { Settings } from "../../Settings/Settings";
import { use } from "../Context";
import { StatsProgressOverviewCell } from "./StatsProgressBar";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { IRouter, Page } from "../Router";
import { Box, Tooltip } from "@mui/material";

interface IProps {
  save: () => void;
  killScripts: () => void;
  router: IRouter;
  allowBackButton: boolean;
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

function Bladeburner(): React.ReactElement {
  const player = use.Player();
  const classes = useStyles();
  const bladeburner = player.bladeburner;
  if (bladeburner === null) return <></>;
  const action = bladeburner.getTypeAndNameFromActionId(bladeburner.action);
  if (action.type === "Idle") return <></>;
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
          <Typography>Bladeburner:</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
          <Typography>
            {action.type}: {action.name}
          </Typography>
        </TableCell>
      </TableRow>
    </>
  );
}

function Work(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const classes = useStyles();
  if (!player.isWorking || player.focus) return <></>;

  if (player.className !== "") {
    return (
      <>
        <TableRow>
          <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
            <Typography>Work&nbsp;in&nbsp;progress:</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
            <Typography>{player.className}</Typography>
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

  if (player.createProgramName !== "") {
    return (
      <>
        <TableRow>
          <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
            <Typography>Work&nbsp;in&nbsp;progress:</Typography>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
            <Typography>
              {player.createProgramName}{" "}
              {((player.timeWorkedCreateProgram / player.timeNeededToCompleteWork) * 100).toFixed(2)}%
            </Typography>
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

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
          <Typography>Work&nbsp;in&nbsp;progress:</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
          <Typography>
            +<Reputation reputation={player.workRepGained} /> rep
          </Typography>
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      color: theme.colors.hp,
    },
    money: {
      color: theme.colors.money,
    },
    hack: {
      color: theme.colors.hack,
    },
    combat: {
      color: theme.colors.combat,
    },
    cha: {
      color: theme.colors.cha,
    },
    int: {
      color: theme.colors.int,
    },
  }),
);

export { useStyles as characterOverviewStyles };

export function CharacterOverview({ save, killScripts, router, allowBackButton }: IProps): React.ReactElement {
  const [killOpen, setKillOpen] = useState(false);
  const player = use.Player();

  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 600);
    return () => clearInterval(id);
  }, []);

  const classes = useStyles();
  const theme = useTheme();

  const hackingProgress = player.calculateSkillProgress(
    player.hacking_exp,
    player.hacking_mult * BitNodeMultipliers.HackingLevelMultiplier,
  );
  const strengthProgress = player.calculateSkillProgress(
    player.strength_exp,
    player.strength_mult * BitNodeMultipliers.StrengthLevelMultiplier,
  );
  const defenseProgress = player.calculateSkillProgress(
    player.defense_exp,
    player.defense_mult * BitNodeMultipliers.DefenseLevelMultiplier,
  );
  const dexterityProgress = player.calculateSkillProgress(
    player.dexterity_exp,
    player.dexterity_mult * BitNodeMultipliers.DexterityLevelMultiplier,
  );
  const agilityProgress = player.calculateSkillProgress(
    player.agility_exp,
    player.agility_mult * BitNodeMultipliers.AgilityLevelMultiplier,
  );
  const charismaProgress = player.calculateSkillProgress(
    player.charisma_exp,
    player.charisma_mult * BitNodeMultipliers.CharismaLevelMultiplier,
  );

  const previousPageName = router.previousPage() < 0
    ? '' : Page[router.previousPage() ?? 0].replace(/([a-z])([A-Z])/g, '$1 $2');

  return (
    <>
      <Table sx={{ display: "block", m: 1 }}>
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
              <Typography classes={{ root: classes.money }}>{numeralWrapper.formatMoney(player.money)}</Typography>
            </TableCell>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-money-hook" classes={{ root: classes.money }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
              <Typography classes={{ root: classes.hack }}>Hack&nbsp;</Typography>
            </TableCell>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography classes={{ root: classes.hack }}>{numeralWrapper.formatSkill(player.hacking)}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={hackingProgress} color={theme.colors.hack} />
            )}
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
              <Typography classes={{ root: classes.hack }}></Typography>
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
              <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.strength)}</Typography>
            </TableCell>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-str-hook" classes={{ root: classes.combat }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={strengthProgress} color={theme.colors.combat} />
            )}
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
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={defenseProgress} color={theme.colors.combat} />
            )}
          </TableRow>

          <TableRow>
            <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
              <Typography classes={{ root: classes.combat }}>Dex&nbsp;</Typography>
            </TableCell>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.dexterity)}</Typography>
            </TableCell>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-dex-hook" classes={{ root: classes.combat }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={dexterityProgress} color={theme.colors.combat} />
            )}
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
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={agilityProgress} color={theme.colors.combat} />
            )}
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
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={charismaProgress} color={theme.colors.cha} />
            )}
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
          <Bladeburner />
        </TableBody>
      </Table>
      <Box sx={{ display: 'flex', borderTop: `1px solid ${Settings.theme.welllight}` }}>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
          <IconButton onClick={save}>
            <Tooltip title="Save game">
              <SaveIcon color={Settings.AutosaveInterval !== 0 ? "primary" : "error"} />
            </Tooltip>
          </IconButton>
          {allowBackButton && (
            <Tooltip title={previousPageName ? `Go back to "${previousPageName}"` : 'Go back one page (disabled: nowhere to go)'}>
              <Box sx={{ cursor: (!previousPageName ? 'not-allowed': 'inherit') }}>
                <IconButton
                  disabled={!previousPageName}
                  onClick={() => router.toPreviousPage()}>
                    <ArrowBackIcon />
                </IconButton>
              </Box>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ display: 'flex', flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
          <IconButton onClick={() => setKillOpen(true)}>
            <Tooltip title="Kill all running scripts">
              <ClearAllIcon color="error" />
            </Tooltip>
          </IconButton>
        </Box>
      </Box>
      <KillScriptsModal open={killOpen} onClose={() => setKillOpen(false)} killScripts={killScripts} />
    </>
  );
}
