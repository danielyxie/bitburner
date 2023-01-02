// Root React Component for the Corporation UI
import React, { useMemo, useState, useEffect } from "react";

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
import { ActionIdentifier } from "../../Bladeburner/ActionIdentifier";
import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { Skills } from "../../PersonObjects/Skills";
import { calculateSkillProgress } from "../../PersonObjects/formulas/skill";
import { EventEmitter } from "../../utils/EventEmitter";

type SkillRowName = "Hack" | "Str" | "Def" | "Dex" | "Agi" | "Cha" | "Int";
type RowName = SkillRowName | "HP" | "Money";
const OverviewEventEmitter = new EventEmitter();

// These values aren't displayed, they're just used for comparison to check if state has changed
const valUpdaters: Record<RowName, () => any> = {
  HP: () => Player.hp.current + "|" + Player.hp.max, // This isn't displayed, it's just compared for updates.
  Money: () => Player.money,
  Hack: () => Player.skills.hacking,
  Str: () => Player.skills.strength,
  Def: () => Player.skills.defense,
  Dex: () => Player.skills.dexterity,
  Agi: () => Player.skills.agility,
  Cha: () => Player.skills.charisma,
  Int: () => Player.skills.intelligence,
};

//These formattedVals functions don't take in a value because of the weirdness around HP.
const formattedVals: Record<RowName, () => string> = {
  HP: () => `${numeralWrapper.formatHp(Player.hp.current)} / ${numeralWrapper.formatHp(Player.hp.max)}`,
  Money: () => numeralWrapper.formatMoney(Player.money),
  Hack: () => numeralWrapper.formatSkill(Player.skills.hacking),
  Str: () => numeralWrapper.formatSkill(Player.skills.strength),
  Def: () => numeralWrapper.formatSkill(Player.skills.defense),
  Dex: () => numeralWrapper.formatSkill(Player.skills.dexterity),
  Agi: () => numeralWrapper.formatSkill(Player.skills.agility),
  Cha: () => numeralWrapper.formatSkill(Player.skills.charisma),
  Int: () => numeralWrapper.formatSkill(Player.skills.intelligence),
};

const skillMultUpdaters: Record<SkillRowName, () => number> = {
  //Used by skill bars to calculate the mult
  Hack: () => Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  Str: () => Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  Def: () => Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  Dex: () => Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  Agi: () => Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  Cha: () => Player.mults.hacking * BitNodeMultipliers.HackingLevelMultiplier,
  Int: () => 1,
};

const skillNameMap: Record<SkillRowName, keyof Skills> = {
  Hack: "hacking",
  Str: "strength",
  Def: "defense",
  Dex: "dexterity",
  Agi: "agility",
  Cha: "charisma",
  Int: "intelligence",
};

interface SkillBarProps {
  name: SkillRowName;
  color?: string;
}
function SkillBar({ name, color }: SkillBarProps): React.ReactElement {
  const [mult, setMult] = useState(skillMultUpdaters[name]?.());
  const [progress, setProgress] = useState(calculateSkillProgress(Player.exp[skillNameMap[name]], mult));
  useEffect(() => {
    const clearSubscription = OverviewEventEmitter.subscribe(() => {
      setMult(skillMultUpdaters[name]());
      setProgress(calculateSkillProgress(Player.exp[skillNameMap[name] as keyof Skills], mult));
    });
    return clearSubscription;
  }, []);
  return (
    <TableRow>
      <StatsProgressOverviewCell progress={progress} color={color} />
    </TableRow>
  );
}

interface ValProps {
  name: RowName;
  color?: string;
}
export function Val({ name, color }: ValProps): React.ReactElement {
  //val isn't actually used here, the update of val just forces a refresh of the formattedVal that gets shown
  const setVal = useState(valUpdaters[name]())[1];
  useEffect(() => {
    const clearSubscription = OverviewEventEmitter.subscribe(() => setVal(valUpdaters[name]()));
    return clearSubscription;
  }, []);
  return <Typography color={color}>{formattedVals[name]()}</Typography>;
}

interface DataRowProps {
  name: RowName; //name for UI display
  showBar: boolean;
  color?: string;
  cellType: "cellNone" | "cell";
}
export function DataRow({ name, showBar, color, cellType }: DataRowProps): React.ReactElement {
  const classes = useStyles();
  const isSkill = name in skillNameMap;
  const skillBar = showBar && isSkill ? <SkillBar name={name as SkillRowName} color={color} /> : <></>;
  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row" classes={{ root: classes[cellType] }}>
          <Typography color={color}>{name}&nbsp;</Typography>
        </TableCell>
        <TableCell align="right" classes={{ root: classes[cellType] }}>
          <Val name={name} color={color} />
        </TableCell>
        <TableCell align="right" classes={{ root: classes[cellType] }}>
          <Typography id={"overview-" + name + "-hook"} color={color}>
            {}
          </Typography>
        </TableCell>
      </TableRow>
      {skillBar}
    </>
  );
}

interface OverviewProps {
  parentOpen: boolean;
  save: () => void;
  killScripts: () => void;
}

export function CharacterOverview({ parentOpen, save, killScripts }: OverviewProps): React.ReactElement {
  const [killOpen, setKillOpen] = useState(false);
  const [hasIntelligence, setHasIntelligence] = useState(Player.skills.intelligence > 0);
  const [showBars, setShowBars] = useState(!Settings.DisableOverviewProgressBars);
  useEffect(() => {
    if (!parentOpen) return; // No rerendering if overview is hidden, for performance
    const interval = setInterval(() => {
      setHasIntelligence(Player.skills.intelligence > 0);
      setShowBars(!Settings.DisableOverviewProgressBars);
      OverviewEventEmitter.emit(); // Tell every other updating component to update as well
    }, 600);
    return () => clearInterval(interval);
  }, [parentOpen]);
  const classes = useStyles();
  const theme = useTheme();
  return (
    <>
      <Table sx={{ display: "block", m: 1 }}>
        <TableBody>
          <DataRow name="HP" showBar={false} color={theme.colors.hp} cellType={"cellNone"} />
          <DataRow name="Money" showBar={false} color={theme.colors.money} cellType={"cell"} />
          <DataRow name="Hack" showBar={showBars} color={theme.colors.hack} cellType={"cell"} />
          <DataRow name="Str" showBar={showBars} color={theme.colors.combat} cellType={"cellNone"} />
          <DataRow name="Def" showBar={showBars} color={theme.colors.combat} cellType={"cellNone"} />
          <DataRow name="Dex" showBar={showBars} color={theme.colors.combat} cellType={"cellNone"} />
          <DataRow name="Agi" showBar={showBars} color={theme.colors.combat} cellType={"cell"} />
          <DataRow name="Cha" showBar={showBars} color={theme.colors.cha} cellType={"cell"} />
          {hasIntelligence ? (
            <DataRow name="Int" showBar={showBars} color={theme.colors.int} cellType={"cell"} />
          ) : (
            <></>
          )}
          <TableRow>
            <TableCell component="th" scope="row" classes={{ root: classes.cell }}>
              <Typography id="overview-extra-hook-0" color={theme.colors.hack}>
                {}
              </Typography>
            </TableCell>
            <TableCell component="th" scope="row" align="right" classes={{ root: classes.cell }}>
              <Typography id="overview-extra-hook-1" color={theme.colors.hack}>
                {}
              </Typography>
            </TableCell>
            <TableCell component="th" scope="row" align="right" classes={{ root: classes.cell }}>
              <Typography id="overview-extra-hook-2" color={theme.colors.hack}>
                {}
              </Typography>
            </TableCell>
          </TableRow>
          <Work />
          <BladeburnerText />
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

function ActionText(props: { action: ActionIdentifier }): React.ReactElement {
  // This component should never be called if Bladeburner is null, due to conditional checks in BladeburnerText
  const action = (Player.bladeburner as Bladeburner).getTypeAndNameFromActionId(props.action);
  return (
    <Typography>
      {action.type}: {action.name}
    </Typography>
  );
}

function BladeburnerText(): React.ReactElement {
  const classes = useStyles();
  const setRerender = useState(false)[1];
  useEffect(() => {
    const clearSubscription = OverviewEventEmitter.subscribe(() => setRerender((old) => !old));
    return clearSubscription;
  }, []);

  const action = Player.bladeburner?.action;
  return useMemo(
    () =>
      //Action type 1 is Idle, see ActionTypes.ts
      //TODO 2.3: Revamp typing in bladeburner
      !action || action.type === 1 ? (
        <></>
      ) : (
        <>
          <TableRow>
            <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
              <Typography>Bladeburner:</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row" colSpan={2} classes={{ root: classes.cellNone }}>
              <ActionText action={action} />
            </TableCell>
          </TableRow>
        </>
      ),
    [action?.type, action?.name, classes.cellNone],
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
  const setRerender = useState(false)[1];
  useEffect(() => {
    const clearSubscription = OverviewEventEmitter.subscribe(() => setRerender((old) => !old));
    return clearSubscription;
  }, []);

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
