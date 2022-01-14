// Root React Component for the Corporation UI
import React, { useState, useEffect } from "react";

import { Theme, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Reputation } from "./Reputation";
import { KillScriptsModal } from "./KillScriptsModal";
import { convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import ClearAllIcon from "@mui/icons-material/ClearAll";

import { Settings } from "../../Settings/Settings";
import { use } from "../Context";
import { StatsProgressOverviewCell } from "./StatsProgressBar";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

import { Box, Tooltip } from "@mui/material";
import { CONSTANTS } from "../../Constants";
import { ISkillProgress } from "src/PersonObjects/formulas/skill";

interface IProps {
  save: () => void;
  killScripts: () => void;
}

function Intelligence(): React.ReactElement {
  const player = use.Player();
  const classes = useStyles();
  if (player.intelligence === 0) return <></>;
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
          <Typography classes={{ root: classes.int }}>Int&nbsp;</Typography>
        </TableCell>
        <TableCell align="right" classes={{ root: classes.cell }}>
          <Typography classes={{ root: classes.int }}>{numeralWrapper.formatSkill(player.intelligence)}</Typography>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell align="right" classes={{ root: classes.cell }}>
          <Typography id="overview-int-hook" classes={{ root: classes.int }}>
            {/*Hook for player scripts*/}
          </Typography>
        </TableCell>
      </TableRow>
    </>
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

interface WorkInProgressOverviewProps {
  tooltip: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  onClickFocus: () => void;
}

function WorkInProgressOverview({
  tooltip,
  children,
  onClickFocus,
  header,
}: WorkInProgressOverviewProps): React.ReactElement {
  const classes = useStyles();
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.workCell }}>
          <Tooltip title={<>{tooltip}</>}>
            <Typography className={classes.workHeader} sx={{ pt: 1, pb: 0.5 }}>
              {header}
            </Typography>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.workCell }}>
          <Typography className={classes.workSubtitles}>{children}</Typography>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell component="th" scope="row" align="center" colSpan={2} classes={{ root: classes.cellNone }}>
          <Button sx={{ mt: 1 }} onClick={onClickFocus}>
            Focus
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
}

function Work(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const onClickFocus = (): void => {
    player.startFocusing();
    router.toWork();
  };

  if (!player.isWorking || player.focus) return <></>;

  let details = <></>;
  let header = <></>;
  let innerText = <></>;
  if (player.workType === CONSTANTS.WorkTypeCompanyPartTime || player.workType === CONSTANTS.WorkTypeCompany) {
    details = (
      <>
        {player.jobs[player.companyName]} at <strong>{player.companyName}</strong>
      </>
    );
    header = (
      <>
        Working at <strong>{player.companyName}</strong>
      </>
    );
    innerText = (
      <>
        +<Reputation reputation={player.workRepGained} /> rep
      </>
    );
  } else if (player.workType === CONSTANTS.WorkTypeFaction) {
    details = (
      <>
        {player.factionWorkType} for <strong>{player.currentWorkFactionName}</strong>
      </>
    );
    header = (
      <>
        Working for <strong>{player.currentWorkFactionName}</strong>
      </>
    );
    innerText = (
      <>
        +<Reputation reputation={player.workRepGained} /> rep
      </>
    );
  } else if (player.workType === CONSTANTS.WorkTypeStudyClass) {
    details = <>{player.workType}</>;
    header = <>You are {player.className}</>;
    innerText = <>{convertTimeMsToTimeElapsedString(player.timeWorked)}</>;
  } else if (player.workType === CONSTANTS.WorkTypeCreateProgram) {
    details = <>Coding {player.createProgramName}</>;
    header = <>Creating a program</>;
    innerText = (
      <>
        {player.createProgramName}{" "}
        {((player.timeWorkedCreateProgram / player.timeNeededToCompleteWork) * 100).toFixed(2)}%
      </>
    );
  }

  return (
    <WorkInProgressOverview tooltip={details} header={header} onClickFocus={onClickFocus}>
      {innerText}
    </WorkInProgressOverview>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    workCell: {
      textAlign: "center",
      maxWidth: "200px",
      borderBottom: "none",
      padding: 0,
      margin: 0,
    },

    workHeader: {
      fontSize: "0.9rem",
    },

    workSubtitles: {
      fontSize: "0.8rem",
    },

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

export function CharacterOverview({ save, killScripts }: IProps): React.ReactElement {
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

  const generateTooltip = ({
    baseExperience: min,
    nextExperience: max,
    currentExperience: current,
    remainingExperience: remaining,
    progress
  }: ISkillProgress): React.ReactElement => {
    return (
      <Typography sx={{ textAlign: 'right' }}>
        <strong>Progress:</strong>&nbsp;
        {numeralWrapper.formatExp(current)} / {numeralWrapper.formatExp(max - min)}
        <br />
        <strong>Remaining:</strong>&nbsp;
        {numeralWrapper.formatExp(remaining)} ({progress.toFixed(2)}%)
      </Typography>
    );
  }

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
          </TableRow>

          <TableRow>
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
          </TableRow>

          <TableRow>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-money-hook" classes={{ root: classes.money }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>

          <Tooltip title={generateTooltip(hackingProgress)}>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.hack }}>Hack&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.hack }}>{numeralWrapper.formatSkill(player.hacking)}</Typography>
              </TableCell>
            </TableRow>
          </Tooltip>
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

          <Tooltip title={generateTooltip(strengthProgress)}>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>Str&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.strength)}</Typography>
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={strengthProgress} color={theme.colors.combat} />
            )}
          </TableRow>

          <TableRow>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-str-hook" classes={{ root: classes.combat }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>

          <Tooltip title={generateTooltip(defenseProgress)}>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>Def&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.defense)}</Typography>
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={defenseProgress} color={theme.colors.combat} />
            )}
          </TableRow>

          <TableRow>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-def-hook" classes={{ root: classes.combat }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>

          <Tooltip title={generateTooltip(dexterityProgress)}>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>Dex&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.dexterity)}</Typography>
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={dexterityProgress} color={theme.colors.combat} />
            )}
          </TableRow>

          <TableRow>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-dex-hook" classes={{ root: classes.combat }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>

          <Tooltip title={generateTooltip(agilityProgress)}>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
                <Typography classes={{ root: classes.combat }}>Agi&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cell }}>
                <Typography classes={{ root: classes.combat }}>{numeralWrapper.formatSkill(player.agility)}</Typography>
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={agilityProgress} color={theme.colors.combat} />
            )}
          </TableRow>

          <TableRow>
            <TableCell align="right" classes={{ root: classes.cellNone }}>
              <Typography id="overview-agi-hook" classes={{ root: classes.combat }}>
                {/*Hook for player scripts*/}
              </Typography>
            </TableCell>
          </TableRow>

          <Tooltip title={generateTooltip(charismaProgress)}>
            <TableRow>
              <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.cha }}>Cha&nbsp;</Typography>
              </TableCell>
              <TableCell align="right" classes={{ root: classes.cellNone }}>
                <Typography classes={{ root: classes.cha }}>{numeralWrapper.formatSkill(player.charisma)}</Typography>
              </TableCell>
            </TableRow>
          </Tooltip>
          <TableRow>
            {!Settings.DisableOverviewProgressBars && (
              <StatsProgressOverviewCell progress={charismaProgress} color={theme.colors.cha} />
            )}
          </TableRow>

          <TableRow>
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
          <Bladeburner />
        </TableBody>
      </Table>
      <Box sx={{ display: "flex", borderTop: `1px solid ${Settings.theme.welllight}` }}>
        <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
          <IconButton onClick={save}>
            <Tooltip title="Save game">
              <SaveIcon color={Settings.AutosaveInterval !== 0 ? "primary" : "error"} />
            </Tooltip>
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
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
