// Root React Component for the Corporation UI
import React, { useState, useEffect } from "react";

import { Theme, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { numeralWrapper } from "../numeralFormat";
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
import { Router } from "../GameRoot";
import { Player } from "../../Player";
import { StatsProgressOverviewCell } from "./StatsProgressBar";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";

import { Box, Tooltip } from "@mui/material";

import { isClassWork } from "../../Work/ClassWork";
import { CONSTANTS } from "../../Constants";
import { isCreateProgramWork } from "../../Work/CreateProgramWork";
import { isGraftingWork } from "../../Work/GraftingWork";
import { isFactionWork } from "../../Work/FactionWork";
import { ReputationRate } from "./ReputationRate";
import { isCompanyWork } from "../../Work/CompanyWork";
import { isCrimeWork } from "../../Work/CrimeWork";

interface IProps {
  save: () => void;
  killScripts: () => void;
}

function Intelligence(): React.ReactElement {
  const theme = useTheme();
  const classes = useStyles();
  if (Player.skills.intelligence === 0) return <></>;
  const progress = Player.calculateSkillProgress(Player.exp.intelligence);

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
          <Typography classes={{ root: classes.int }}>Int&nbsp;</Typography>
        </TableCell>
        <TableCell align="right" classes={{ root: classes.cell }}>
          <Typography classes={{ root: classes.int }}>
            {numeralWrapper.formatSkill(Player.skills.intelligence)}
          </Typography>
        </TableCell>
        <TableCell align="right" classes={{ root: classes.cell }}>
          <Typography id="overview-int-hook" classes={{ root: classes.int }}>
            {/*Hook for player scripts*/}
          </Typography>
        </TableCell>
      </TableRow>

      <TableRow>
        {!Settings.DisableOverviewProgressBars && (
          <StatsProgressOverviewCell progress={progress} color={theme.colors.int} />
        )}
      </TableRow>
    </>
  );
}

function Bladeburner(): React.ReactElement {
  const classes = useStyles();
  const bladeburner = Player.bladeburner;
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
  const onClickFocus = (): void => {
    Player.startFocusing();
    Router.toWork();
  };
  if (Player.currentWork === null || Player.focus) return <></>;

  let details = <></>;
  let header = <></>;
  let innerText = <></>;
  if (isCrimeWork(Player.currentWork)) {
    const crime = Player.currentWork.getCrime();
    const perc = (Player.currentWork.unitCompleted / crime.time) * 100;

    details = <>{Player.currentWork.crimeType}</>;
    header = <>You are attempting to {Player.currentWork.crimeType}</>;
    innerText = <>{perc.toFixed(2)}%</>;
  }
  if (isClassWork(Player.currentWork)) {
    details = <>{Player.currentWork.getClass().youAreCurrently}</>;
    header = <>You are {Player.currentWork.getClass().youAreCurrently}</>;
    innerText = <>{convertTimeMsToTimeElapsedString(Player.currentWork.cyclesWorked * CONSTANTS._idleSpeed)}</>;
  }
  if (isCreateProgramWork(Player.currentWork)) {
    const create = Player.currentWork;
    details = <>Coding {create.programName}</>;
    header = <>Creating a program</>;
    innerText = (
      <>
        {create.programName} {((create.unitCompleted / create.unitNeeded()) * 100).toFixed(2)}%
      </>
    );
  }
  if (isGraftingWork(Player.currentWork)) {
    const graft = Player.currentWork;
    details = <>Grafting {graft.augmentation}</>;
    header = <>Grafting an Augmentation</>;
    innerText = (
      <>
        <strong>{((graft.unitCompleted / graft.unitNeeded()) * 100).toFixed(2)}%</strong> done
      </>
    );
  }

  if (isFactionWork(Player.currentWork)) {
    const factionWork = Player.currentWork;
    header = (
      <>
        Working for <strong>{factionWork.factionName}</strong>
      </>
    );
    innerText = (
      <>
        <Reputation reputation={factionWork.getFaction().playerReputation} /> rep
        <br />(
        <ReputationRate reputation={factionWork.getReputationRate() * (1000 / CONSTANTS._idleSpeed)} />)
      </>
    );
  }
  if (isCompanyWork(Player.currentWork)) {
    const companyWork = Player.currentWork;
    details = (
      <>
        {Player.jobs[companyWork.companyName]} at <strong>{companyWork.companyName}</strong>
      </>
    );
    header = (
      <>
        Working at <strong>{companyWork.companyName}</strong>
      </>
    );
    innerText = (
      <>
        <Reputation reputation={companyWork.getCompany().playerReputation} /> rep
        <br />(
        <ReputationRate reputation={companyWork.getGainRates().reputation * (1000 / CONSTANTS._idleSpeed)} />)
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
  const setRerender = useState(false)[1];
  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 600);
    return () => clearInterval(id);
  }, []);
  const classes = useStyles();
  const theme = useTheme();

  const hackingProgress = Player.calculateSkillProgress(
    Player.exp.hacking,
    Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  );
  const strengthProgress = Player.calculateSkillProgress(
    Player.exp.strength,
    Player.mults.strength * BitNodeMultipliers.StrengthLevelMultiplier,
  );
  const defenseProgress = Player.calculateSkillProgress(
    Player.exp.defense,
    Player.mults.defense * BitNodeMultipliers.DefenseLevelMultiplier,
  );
  const dexterityProgress = Player.calculateSkillProgress(
    Player.exp.dexterity,
    Player.mults.dexterity * BitNodeMultipliers.DexterityLevelMultiplier,
  );
  const agilityProgress = Player.calculateSkillProgress(
    Player.exp.agility,
    Player.mults.agility * BitNodeMultipliers.AgilityLevelMultiplier,
  );
  const charismaProgress = Player.calculateSkillProgress(
    Player.exp.charisma,
    Player.mults.charisma * BitNodeMultipliers.CharismaLevelMultiplier,
  );

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
                {numeralWrapper.formatHp(Player.hp.current)}&nbsp;/&nbsp;{numeralWrapper.formatHp(Player.hp.max)}
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
              <Typography classes={{ root: classes.money }}>{numeralWrapper.formatMoney(Player.money)}</Typography>
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
              <Typography classes={{ root: classes.hack }}>
                {numeralWrapper.formatSkill(Player.skills.hacking)}
              </Typography>
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
              <Typography classes={{ root: classes.combat }}>
                {numeralWrapper.formatSkill(Player.skills.strength)}
              </Typography>
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
              <Typography classes={{ root: classes.combat }}>
                {numeralWrapper.formatSkill(Player.skills.defense)}
              </Typography>
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
              <Typography classes={{ root: classes.combat }}>
                {numeralWrapper.formatSkill(Player.skills.dexterity)}
              </Typography>
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
              <Typography classes={{ root: classes.combat }}>
                {numeralWrapper.formatSkill(Player.skills.agility)}
              </Typography>
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
              <Typography classes={{ root: classes.cha }}>
                {numeralWrapper.formatSkill(Player.skills.charisma)}
              </Typography>
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
      <Box sx={{ display: "flex", borderTop: `1px solid ${Settings.theme.welllight}` }}>
        <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-start", alignItems: "center" }}>
          <IconButton aria-label="save game" onClick={save}>
            <Tooltip title={Settings.AutosaveInterval !== 0 ? "Save game" : "Save game (auto-saves are disabled!)"}>
              <SaveIcon color={Settings.AutosaveInterval !== 0 ? "primary" : "error"} />
            </Tooltip>
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end", alignItems: "center" }}>
          <IconButton aria-label="kill all scripts" onClick={() => setKillOpen(true)}>
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
