// Root React Component for the Corporation UI
import React, { useMemo, useState, useEffect } from "react";

import { Theme, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { numeralWrapper } from "../numeralFormat";
import { Reputation } from "./Reputation";
import { KillScriptsModal } from "./KillScriptsModal";
import { convertTimeMsToTimeElapsedString, formatNumber } from "../../utils/StringHelperFunctions";

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
import { Page } from "../Router";
import { Player } from "@player";
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
  parentOpen: boolean;
  save: () => void;
  killScripts: () => void;
}

function Bladeburner(): React.ReactElement {
  const classes = useStyles();
  const bladeburner = Player.bladeburner;
  if (bladeburner === null) return <></>;
  const action = bladeburner.getTypeAndNameFromActionId(bladeburner.action);
  if (action.type === "Idle") return <></>;
  return (
    <>
      {useMemo(
        () => (
          <TableRow>
            <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
              <Typography>Bladeburner:</Typography>
            </TableCell>
          </TableRow>
        ),
        [classes.cellNone],
      )}
      {useMemo(
        () => (
          <TableRow>
            <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
              <Typography>
                {action.type}: {action.name}
              </Typography>
            </TableCell>
          </TableRow>
        ),
        [classes.cellNone, action.type, action.name],
      )}
    </>
  );
}

interface WorkInProgressOverviewProps {
  tooltip: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
}

const onClickFocusWork = (): void => {
  Player.startFocusing();
  Router.toPage(Page.Work);
};
function WorkInProgressOverview({ tooltip, children, header }: WorkInProgressOverviewProps): React.ReactElement {
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
      {useMemo(
        () => (
          <TableRow>
            <TableCell component="th" scope="row" align="center" colSpan={2} classes={{ root: classes.cellNone }}>
              <Button sx={{ mt: 1 }} onClick={onClickFocusWork}>
                Focus
              </Button>
            </TableCell>
          </TableRow>
        ),
        [classes.cellNone],
      )}
    </>
  );
}

function Work(): React.ReactElement {
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
    <WorkInProgressOverview tooltip={details} header={header}>
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

function rowWithHook(name: string, value: string, className: string, cellNone: string): React.ReactElement {
  return useMemo(
    () => (
      <TableRow>
        <TableCell component="th" scope="row" classes={{ root: cellNone }}>
          <Typography classes={{ root: className }}>{name}&nbsp;</Typography>
        </TableCell>
        <TableCell align="right" classes={{ root: cellNone }}>
          <Typography classes={{ root: className }}>{value}</Typography>
        </TableCell>
        <TableCell align="right" classes={{ root: cellNone }}>
          <Typography id={"overview-" + name.toLowerCase() + "-str-hook"} classes={{ root: className }}>
            {/*Hook for player scripts*/}
          </Typography>
        </TableCell>
      </TableRow>
    ),
    [name, value, className, cellNone],
  );
}

function statItem(
  name: string,
  value: number,
  className: string,
  cellNone: string,
  themeColor: React.CSSProperties["color"],
  exp: number,
  mult: number,
  bitNodeMult: number,
): React.ReactElement[] {
  return [
    rowWithHook(name, formatNumber(value, 0), className, cellNone),
    useMemo(() => {
      const progress = Player.calculateSkillProgress(exp, mult * bitNodeMult);
      return (
        <TableRow>
          {!Settings.DisableOverviewProgressBars && (
            <StatsProgressOverviewCell progress={progress} color={themeColor} />
          )}
        </TableRow>
      );
    }, [Settings.DisableOverviewProgressBars, themeColor, exp, mult, bitNodeMult]),
  ];
}

export function CharacterOverview({ parentOpen, save, killScripts }: IProps): React.ReactElement {
  const [killOpen, setKillOpen] = useState(false);
  const setRerender = useState(false)[1];
  // Don't rerender while the overview is closed.
  useEffect(() => {
    if (parentOpen) {
      const id = setInterval(() => setRerender((old) => !old), 600);
      return () => clearInterval(id);
    }
    return () => null;
  }, [parentOpen]);
  const classes = useStyles();
  const theme = useTheme();

  const hackingProgress = Player.calculateSkillProgress(
    Player.exp.hacking,
    Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  );
  return (
    <>
      <Table sx={{ display: "block", m: 1 }}>
        <TableBody>
          {rowWithHook(
            "HP",
            numeralWrapper.formatHp(Player.hp.current) + "\u00a0/\u00a0" + numeralWrapper.formatHp(Player.hp.max),
            classes.hp,
            classes.cellNone,
          )}
          {rowWithHook("Money", numeralWrapper.formatMoney(Player.money), classes.money, classes.cellNone)}

          {useMemo(
            // Hack is a special-case, because of its overview-hack-hook placement
            () => (
              <TableRow>
                <TableCell component="th" scope="row" classes={{ root: classes.cellNone }}>
                  <Typography classes={{ root: classes.hack }}>Hack&nbsp;</Typography>
                </TableCell>
                <TableCell align="right" classes={{ root: classes.cellNone }}>
                  <Typography classes={{ root: classes.hack }}>{formatNumber(Player.skills.hacking, 0)}</Typography>
                </TableCell>
              </TableRow>
            ),
            [Player.skills.hacking, classes.hack, classes.cellNone],
          )}
          {useMemo(
            () => (
              <TableRow>
                {!Settings.DisableOverviewProgressBars && (
                  <StatsProgressOverviewCell progress={hackingProgress} color={theme.colors.hack} />
                )}
              </TableRow>
            ),
            [Settings.DisableOverviewProgressBars, Player.exp.hacking, Player.mults.hacking, theme.colors.hack],
          )}
          {useMemo(
            () => (
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
            ),
            [classes.cell, classes.hack],
          )}

          {statItem(
            "Str",
            Player.skills.strength,
            classes.combat,
            classes.cellNone,
            theme.colors.combat,
            Player.exp.strength,
            Player.mults.strength,
            BitNodeMultipliers.StrengthLevelMultiplier,
          )}
          {statItem(
            "Def",
            Player.skills.defense,
            classes.combat,
            classes.cellNone,
            theme.colors.combat,
            Player.exp.defense,
            Player.mults.defense,
            BitNodeMultipliers.DefenseLevelMultiplier,
          )}
          {statItem(
            "Dex",
            Player.skills.dexterity,
            classes.combat,
            classes.cellNone,
            theme.colors.combat,
            Player.exp.dexterity,
            Player.mults.dexterity,
            BitNodeMultipliers.DexterityLevelMultiplier,
          )}
          {statItem(
            "Agi",
            Player.skills.agility,
            classes.combat,
            classes.cellNone,
            theme.colors.combat,
            Player.exp.agility,
            Player.mults.agility,
            BitNodeMultipliers.AgilityLevelMultiplier,
          )}
          {statItem(
            "Cha",
            Player.skills.charisma,
            classes.cha,
            classes.cellNone,
            theme.colors.cha,
            Player.exp.charisma,
            Player.mults.charisma,
            BitNodeMultipliers.CharismaLevelMultiplier,
          )}
          {Player.skills.intelligence !== 0 &&
            statItem(
              "Int",
              Player.skills.intelligence,
              classes.int,
              classes.cellNone,
              theme.colors.int,
              Player.exp.intelligence,
              1,
              1,
            )}
          {useMemo(
            () => (
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
            ),
            [classes.cell, classes.hack],
          )}
          <Work />
          <Bladeburner />
        </TableBody>
      </Table>
      {useMemo(
        () => (
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
        ),
        [Settings.theme.welllight, save, Settings.AutosaveInterval],
      )}
      <KillScriptsModal open={killOpen} onClose={() => setKillOpen(false)} killScripts={killScripts} />
    </>
  );
}
