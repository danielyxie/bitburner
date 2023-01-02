import { Box, Container, Paper, Table, TableBody, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import { Companies } from "../Company/Companies";
import { Company } from "../Company/Company";
import { CONSTANTS } from "../Constants";
import { LocationName } from "../Locations/data/LocationNames";
import { Locations } from "../Locations/Locations";
import { Settings } from "../Settings/Settings";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { use } from "./Context";
import { numeralWrapper } from "./numeralFormat";
import { Money } from "./React/Money";
import { MoneyRate } from "./React/MoneyRate";
import { ProgressBar } from "./React/Progress";
import { Reputation } from "./React/Reputation";
import { ReputationRate } from "./React/ReputationRate";
import { StatsRow } from "./React/StatsRow";
import { isCrimeWork } from "../Work/CrimeWork";
import { isClassWork } from "../Work/ClassWork";
import { WorkStats } from "../Work/WorkStats";
import { isCreateProgramWork } from "../Work/CreateProgramWork";
import { isGraftingWork } from "../Work/GraftingWork";
import { isFactionWork } from "../Work/FactionWork";
import { FactionWorkType } from "../Work/data/FactionWorkType";
import { isCompanyWork } from "../Work/CompanyWork";

const CYCLES_PER_SEC = 1000 / CONSTANTS.MilliPerCycle;

interface IWorkInfo {
  buttons: {
    cancel: () => void;
    unfocus?: () => void;
  };
  title: string | React.ReactElement;

  description?: string | React.ReactElement;
  gains?: (string | React.ReactElement)[];
  progress?: {
    elapsed?: number;
    remaining?: number;
    percentage?: number;
  };

  stopText: string;
  stopTooltip?: string | React.ReactElement;
}

function ExpRows(rate: WorkStats): React.ReactElement[] {
  return [
    rate.hackExp > 0 ? (
      <StatsRow
        name="Hacking Exp"
        color={Settings.theme.hack}
        data={{
          content: `${numeralWrapper.formatExp(rate.hackExp * CYCLES_PER_SEC)} / sec`,
        }}
      />
    ) : (
      <></>
    ),
    rate.strExp > 0 ? (
      <StatsRow
        name="Strength Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.strExp * CYCLES_PER_SEC)} / sec`,
        }}
      />
    ) : (
      <></>
    ),
    rate.defExp > 0 ? (
      <StatsRow
        name="Defense Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.defExp * CYCLES_PER_SEC)} / sec`,
        }}
      />
    ) : (
      <></>
    ),
    rate.dexExp > 0 ? (
      <StatsRow
        name="Dexterity Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.dexExp * CYCLES_PER_SEC)} / sec`,
        }}
      />
    ) : (
      <></>
    ),
    rate.agiExp > 0 ? (
      <StatsRow
        name="Agility Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.agiExp * CYCLES_PER_SEC)} / sec`,
        }}
      />
    ) : (
      <></>
    ),
    rate.chaExp > 0 ? (
      <StatsRow
        name="Charisma Exp"
        color={Settings.theme.cha}
        data={{
          content: `${numeralWrapper.formatExp(rate.chaExp * CYCLES_PER_SEC)} / sec`,
        }}
      />
    ) : (
      <></>
    ),
  ];
}

/* Because crime exp is given all at once at the end, we don't care about the cycles per second. */
function CrimeExpRows(rate: WorkStats): React.ReactElement[] {
  return [
    rate.hackExp > 0 ? (
      <StatsRow
        name="Hacking Exp"
        color={Settings.theme.hack}
        data={{
          content: `${numeralWrapper.formatExp(rate.hackExp)}`,
        }}
      />
    ) : (
      <></>
    ),
    rate.strExp > 0 ? (
      <StatsRow
        name="Strength Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.strExp)}`,
        }}
      />
    ) : (
      <></>
    ),
    rate.defExp > 0 ? (
      <StatsRow
        name="Defense Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.defExp)}`,
        }}
      />
    ) : (
      <></>
    ),
    rate.dexExp > 0 ? (
      <StatsRow
        name="Dexterity Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.dexExp)}`,
        }}
      />
    ) : (
      <></>
    ),
    rate.agiExp > 0 ? (
      <StatsRow
        name="Agility Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(rate.agiExp)}`,
        }}
      />
    ) : (
      <></>
    ),
    rate.chaExp > 0 ? (
      <StatsRow
        name="Charisma Exp"
        color={Settings.theme.cha}
        data={{
          content: `${numeralWrapper.formatExp(rate.chaExp)}`,
        }}
      />
    ) : (
      <></>
    ),
  ];
}

export function WorkInProgressRoot(): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, CONSTANTS.MilliPerCycle);
    return () => clearInterval(id);
  }, []);

  const player = use.Player();
  const router = use.Router();

  let workInfo: IWorkInfo = {
    buttons: {
      cancel: () => undefined,
    },
    title: "",
    stopText: "",
  };

  if (player.currentWork === null) {
    setTimeout(() => router.toTerminal());
    return <></>;
  }

  if (isCrimeWork(player.currentWork)) {
    const crime = player.currentWork.getCrime();
    const completion = (player.currentWork.unitCompleted / crime.time) * 100;
    const gains = player.currentWork.earnings();
    const successChance = crime.successRate(player);
    workInfo = {
      buttons: {
        cancel: () => {
          router.toLocation(Locations[LocationName.Slums]);
          player.finishWork(true);
        },
        unfocus: () => {
          router.toCity();
          player.stopFocusing();
        },
      },
      title: `You are attempting ${crime.workName}`,

      gains: [
        <Typography>Success chance: {numeralWrapper.formatPercentage(successChance)}</Typography>,
        <Typography>Gains (on success)</Typography>,
        <StatsRow name="Money:" color={Settings.theme.money}>
          <Typography>
            <Money money={gains.money} />
          </Typography>
        </StatsRow>,
        ...CrimeExpRows(gains),
      ],
      progress: {
        remaining: crime.time - player.currentWork.unitCompleted,
        percentage: completion,
      },

      stopText: "Stop commiting crime",
    };
  }

  if (isClassWork(player.currentWork)) {
    const classWork = player.currentWork;
    function cancel(): void {
      player.finishWork(true);
      router.toCity();
    }

    function unfocus(): void {
      router.toCity();
      player.stopFocusing();
    }

    let stopText = "";
    if (classWork.isGym()) {
      stopText = "Stop training at gym";
    } else {
      stopText = "Stop taking course";
    }

    const rates = classWork.calculateRates(player);
    workInfo = {
      buttons: {
        cancel: cancel,
        unfocus: unfocus,
      },
      title: (
        <>
          You are currently <b>{classWork.getClass().youAreCurrently}</b>
        </>
      ),

      gains: [
        <StatsRow name="Total Cost" color={Settings.theme.money}>
          <Typography>
            <Money money={classWork.earnings.money} /> (<MoneyRate money={rates.money * CYCLES_PER_SEC} />)
          </Typography>
        </StatsRow>,
        ...ExpRows(rates),
      ],
      progress: {
        elapsed: classWork.cyclesWorked * CONSTANTS._idleSpeed,
      },

      stopText: stopText,
    };
  }

  if (isCreateProgramWork(player.currentWork)) {
    const create = player.currentWork;
    function cancel(): void {
      player.finishWork(true);
      router.toTerminal();
    }
    function unfocus(): void {
      router.toTerminal();
      player.stopFocusing();
    }

    const completion = (create.unitCompleted / create.unitNeeded()) * 100;

    workInfo = {
      buttons: {
        cancel: cancel,
        unfocus: unfocus,
      },
      title: (
        <>
          You are currently working on coding <b>{create.programName}</b>
        </>
      ),

      progress: {
        elapsed: create.cyclesWorked * CONSTANTS._idleSpeed,
        percentage: completion,
      },

      stopText: "Stop creating program",
      stopTooltip: "Your work will be saved and you can return to complete the program later.",
    };
  }

  if (isGraftingWork(player.currentWork)) {
    const graft = player.currentWork;
    function cancel(): void {
      player.finishWork(true);
      router.toTerminal();
    }
    function unfocus(): void {
      router.toTerminal();
      player.stopFocusing();
    }

    workInfo = {
      buttons: {
        cancel: cancel,
        unfocus: unfocus,
      },
      title: (
        <>
          You are currently working on grafting <b>{graft.augmentation}</b>
        </>
      ),

      progress: {
        elapsed: graft.cyclesWorked * CONSTANTS._idleSpeed,
        percentage: (graft.unitCompleted / graft.unitNeeded()) * 100,
      },

      stopText: "Stop grafting",
      stopTooltip: (
        <>
          If you cancel, your work will <b>not</b> be saved, and the money you spent will <b>not</b> be returned
        </>
      ),
    };
  }

  if (isFactionWork(player.currentWork)) {
    const faction = player.currentWork.getFaction();
    if (!faction) {
      workInfo = {
        buttons: {
          cancel: () => router.toFactions(),
        },
        title:
          `You have not joined ${player.currentWork.factionName || "(Faction not found)"} at this time,` +
          " please try again if you think this should have worked",

        stopText: "Back to Factions",
      };
    }

    function cancel(): void {
      router.toFaction(faction);
      player.finishWork(true);
    }
    function unfocus(): void {
      router.toFaction(faction);
      player.stopFocusing();
    }

    const description = {
      [FactionWorkType.HACKING]: "carrying out hacking contracts",
      [FactionWorkType.FIELD]: "carrying out field missions",
      [FactionWorkType.SECURITY]: "performing security detail",
    };

    const exp = player.currentWork.getExpRates(player);

    workInfo = {
      buttons: {
        cancel: cancel,
        unfocus: unfocus,
      },
      title: (
        <>
          You are currently {description[player.currentWork.factionWorkType]} for <b>{faction.name}</b>
        </>
      ),

      description: (
        <>
          Current Faction Reputation: <Reputation reputation={faction.playerReputation} /> (
          <ReputationRate reputation={player.currentWork.getReputationRate(player) * CYCLES_PER_SEC} />)
        </>
      ),
      gains: ExpRows(exp),
      progress: {
        elapsed: player.currentWork.cyclesWorked * CONSTANTS._idleSpeed,
      },

      stopText: "Stop Faction work",
    };
  }

  if (isCompanyWork(player.currentWork)) {
    const comp = Companies[player.currentWork.companyName];
    if (comp == null || !(comp instanceof Company)) {
      workInfo = {
        buttons: {
          cancel: () => router.toTerminal(),
        },
        title:
          `You cannot work for ${player.currentWork.companyName || "(Company not found)"} at this time,` +
          " please try again if you think this should have worked",

        stopText: "Back to Terminal",
      };
    }

    const companyRep = comp.playerReputation;

    function cancel(): void {
      player.finishWork(true);
      router.toJob(Locations[comp.name]);
    }
    function unfocus(): void {
      player.stopFocusing();
      router.toJob(Locations[comp.name]);
    }

    const position = player.jobs[player.currentWork.companyName];
    const gains = player.currentWork.getGainRates(player);
    workInfo = {
      buttons: {
        cancel: cancel,
        unfocus: unfocus,
      },
      title: (
        <>
          You are currently working as a <b>{position}</b> at <b>{player.currentWork.companyName}</b>
        </>
      ),

      description: (
        <>
          Current Company Reputation: <Reputation reputation={companyRep} />
        </>
      ),
      gains: [
        <StatsRow name="Money" color={Settings.theme.money}>
          <Typography>
            <MoneyRate money={gains.money * CYCLES_PER_SEC} />
          </Typography>
        </StatsRow>,
        <StatsRow name="Company Reputation" color={Settings.theme.rep}>
          <Typography>
            <ReputationRate reputation={gains.reputation * CYCLES_PER_SEC} />
          </Typography>
        </StatsRow>,
        ...ExpRows(gains),
      ],
      progress: {
        elapsed: player.currentWork.cyclesWorked * CONSTANTS._idleSpeed,
      },

      stopText: "Stop working",
    };
  }

  if (workInfo.title === "") {
    return <></>;
  }

  const tooltipInfo =
    typeof workInfo?.stopTooltip === "string" ? (
      <Typography>{workInfo.stopTooltip}</Typography>
    ) : (
      workInfo.stopTooltip || <></>
    );

  return (
    <Container
      maxWidth="md"
      sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "calc(100vh - 16px)" }}
    >
      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography variant="h6">{workInfo.title}</Typography>
        <Typography>{workInfo.description}</Typography>
        {workInfo.gains && (
          <Table sx={{ mt: 1 }}>
            <TableBody>
              {workInfo.gains.map((row) => (
                <React.Fragment key={uniqueId()}>{row}</React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
      <Paper sx={{ mb: 1, p: 1 }}>
        {workInfo.progress !== undefined && (
          <Box sx={{ mb: 1 }}>
            <Box
              display="grid"
              sx={{
                gridTemplateColumns: `repeat(${Object.keys(workInfo.progress).length}, 1fr)`,
                width: "100%",
                justifyItems: "center",
                textAlign: "center",
              }}
            >
              {workInfo.progress.elapsed !== undefined && (
                <Typography>{convertTimeMsToTimeElapsedString(workInfo.progress.elapsed)} elapsed</Typography>
              )}
              {workInfo.progress.remaining !== undefined && (
                <Typography>{convertTimeMsToTimeElapsedString(workInfo.progress.remaining)} remaining</Typography>
              )}
              {workInfo.progress.percentage !== undefined && (
                <Typography>{workInfo.progress.percentage.toFixed(2)}% done</Typography>
              )}
            </Box>
            {workInfo.progress.percentage !== undefined && (
              <ProgressBar variant="determinate" value={workInfo.progress.percentage} color="primary" />
            )}
          </Box>
        )}

        <Box display="grid" sx={{ gridTemplateColumns: `repeat(${Object.keys(workInfo.buttons).length}, 1fr)` }}>
          {workInfo.stopTooltip ? (
            <Tooltip title={tooltipInfo}>
              <Button onClick={workInfo.buttons.cancel}>{workInfo.stopText}</Button>
            </Tooltip>
          ) : (
            <Button onClick={workInfo.buttons.cancel}>{workInfo.stopText}</Button>
          )}
          {workInfo.buttons.unfocus && (
            <Button onClick={workInfo.buttons.unfocus}>Do something else simultaneously</Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
