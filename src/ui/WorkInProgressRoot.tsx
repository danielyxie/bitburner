import { Box, Container, Paper, Table, TableBody, Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { uniqueId } from "lodash";
import React, { useEffect, useState } from "react";
import { Companies } from "../Company/Companies";
import { Company } from "../Company/Company";
import { CONSTANTS } from "../Constants";
import { Factions } from "../Faction/Factions";
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
import { WorkType, ClassType } from "../utils/WorkType";
import { isCrimeWork } from "../Work/CrimeWork";
import { isClassWork } from "../Work/ClassWork";
import { WorkStats } from "../Work/WorkStats";
import { isCreateProgramWork } from "../Work/CreateProgramWork";
import { isGraftingWork } from "../Work/GraftingWork";

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

export function ExpRows(total: WorkStats, rate: WorkStats): React.ReactElement[] {
  return [
    total.hackExp > 0 ? (
      <StatsRow
        name="Hacking Exp"
        color={Settings.theme.hack}
        data={{
          content: `${numeralWrapper.formatExp(total.hackExp)} (${numeralWrapper.formatExp(
            rate.hackExp * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    total.strExp > 0 ? (
      <StatsRow
        name="Strength Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(total.strExp)} (${numeralWrapper.formatExp(
            rate.strExp * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    total.defExp > 0 ? (
      <StatsRow
        name="Defense Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(total.defExp)} (${numeralWrapper.formatExp(
            rate.defExp * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    total.dexExp > 0 ? (
      <StatsRow
        name="Dexterity Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(total.dexExp)} (${numeralWrapper.formatExp(
            rate.dexExp * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    total.agiExp > 0 ? (
      <StatsRow
        name="Agility Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(total.agiExp)} (${numeralWrapper.formatExp(
            rate.agiExp * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    total.chaExp > 0 ? (
      <StatsRow
        name="Charisma Exp"
        color={Settings.theme.cha}
        data={{
          content: `${numeralWrapper.formatExp(total.chaExp)} (${numeralWrapper.formatExp(
            rate.chaExp * CYCLES_PER_SEC,
          )} / sec)`,
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

  let expGains = [
    player.workHackExpGained > 0 ? (
      <StatsRow
        name="Hacking Exp"
        color={Settings.theme.hack}
        data={{
          content: `${numeralWrapper.formatExp(player.workHackExpGained)} (${numeralWrapper.formatExp(
            player.workHackExpGainRate * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    player.workStrExpGained > 0 ? (
      <StatsRow
        name="Strength Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(player.workStrExpGained)} (${numeralWrapper.formatExp(
            player.workStrExpGainRate * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    player.workDefExpGained > 0 ? (
      <StatsRow
        name="Defense Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(player.workDefExpGained)} (${numeralWrapper.formatExp(
            player.workDefExpGainRate * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    player.workDexExpGained > 0 ? (
      <StatsRow
        name="Dexterity Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(player.workDexExpGained)} (${numeralWrapper.formatExp(
            player.workDexExpGainRate * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    player.workAgiExpGained > 0 ? (
      <StatsRow
        name="Agility Exp"
        color={Settings.theme.combat}
        data={{
          content: `${numeralWrapper.formatExp(player.workAgiExpGained)} (${numeralWrapper.formatExp(
            player.workAgiExpGainRate * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
    player.workChaExpGained > 0 ? (
      <StatsRow
        name="Charisma Exp"
        color={Settings.theme.cha}
        data={{
          content: `${numeralWrapper.formatExp(player.workChaExpGained)} (${numeralWrapper.formatExp(
            player.workChaExpGainRate * CYCLES_PER_SEC,
          )} / sec)`,
        }}
      />
    ) : (
      <></>
    ),
  ];

  let workInfo: IWorkInfo = {
    buttons: {
      cancel: () => undefined,
    },
    title: "",
    stopText: "",
  };

  if (player.currentWork !== null) {
    if (isCrimeWork(player.currentWork)) {
      const crime = player.currentWork.getCrime();
      const completion = ((player.currentWork.cyclesWorked * CONSTANTS._idleSpeed) / crime.time) * 100;

      workInfo = {
        buttons: {
          cancel: () => {
            router.toLocation(Locations[LocationName.Slums]);
            player.finishNEWWork(true);
          },
        },
        title: `You are attempting to ${crime.type}`,

        progress: {
          remaining: crime.time - player.currentWork.cyclesWorked * CONSTANTS._idleSpeed,
          percentage: completion,
        },

        stopText: "Cancel crime",
      };
    }

    if (isClassWork(player.currentWork)) {
      const classWork = player.currentWork;
      function cancel(): void {
        player.finishNEWWork(true);
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
      expGains = ExpRows(classWork.earnings, rates);
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
          ...expGains,
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
        player.finishNEWWork(true);
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
        player.finishNEWWork(true);
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
  }

  switch (player.workType) {
    case WorkType.Faction: {
      const faction = Factions[player.currentWorkFactionName];
      if (!faction) {
        workInfo = {
          buttons: {
            cancel: () => router.toFactions(),
          },
          title:
            `You have not joined ${player.currentWorkFactionName || "(Faction not found)"} at this time,` +
            " please try again if you think this should have worked",

          stopText: "Back to Factions",
        };
      }

      function cancel(): void {
        router.toFaction(faction);
        player.finishFactionWork(true);
      }
      function unfocus(): void {
        router.toFaction(faction);
        player.stopFocusing();
      }

      workInfo = {
        buttons: {
          cancel: cancel,
          unfocus: unfocus,
        },
        title: (
          <>
            You are currently {player.currentWorkFactionDescription} for your faction <b>{faction.name}</b>
          </>
        ),

        description: (
          <>
            Current Faction Reputation: <Reputation reputation={faction.playerReputation} />
          </>
        ),
        gains: [
          player.workMoneyGained > 0 ? (
            <StatsRow name="Money" color={Settings.theme.money}>
              <Typography>
                <Money money={player.workMoneyGained} /> (
                <MoneyRate money={player.workMoneyGainRate * CYCLES_PER_SEC} />)
              </Typography>
            </StatsRow>
          ) : (
            <></>
          ),
          <StatsRow name="Faction Reputation" color={Settings.theme.rep}>
            <Typography>
              <Reputation reputation={player.workRepGained} /> (
              <ReputationRate reputation={player.workRepGainRate * CYCLES_PER_SEC} />)
            </Typography>
          </StatsRow>,
          ...expGains,
        ],
        progress: {
          elapsed: player.timeWorked,
        },

        stopText: "Stop Faction work",
      };

      break;
    }

    case WorkType.Company: {
      const comp = Companies[player.companyName];
      if (comp == null || !(comp instanceof Company)) {
        workInfo = {
          buttons: {
            cancel: () => router.toTerminal(),
          },
          title:
            `You cannot work for ${player.companyName || "(Company not found)"} at this time,` +
            " please try again if you think this should have worked",

          stopText: "Back to Terminal",
        };
      }

      const companyRep = comp.playerReputation;

      function cancel(): void {
        player.finishWork(true);
        router.toJob();
      }
      function unfocus(): void {
        player.stopFocusing();
        router.toJob();
      }

      const position = player.jobs[player.companyName];

      const penalty = player.cancelationPenalty();

      const penaltyString = penalty === 0.5 ? "half" : "three-quarters";

      workInfo = {
        buttons: {
          cancel: cancel,
          unfocus: unfocus,
        },
        title: (
          <>
            You are currently working as a <b>{position}</b> at <b>{player.companyName}</b>
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
              <Money money={player.workMoneyGained} /> (<MoneyRate money={player.workMoneyGainRate * CYCLES_PER_SEC} />)
            </Typography>
          </StatsRow>,
          <StatsRow name="Company Reputation" color={Settings.theme.rep}>
            <Typography>
              <Reputation reputation={player.workRepGained} /> (
              <ReputationRate reputation={player.workRepGainRate * CYCLES_PER_SEC} />)
            </Typography>
          </StatsRow>,
          ...expGains,
        ],
        progress: {
          elapsed: player.timeWorked,
        },

        stopText: "Stop working",
        stopTooltip:
          "You will automatically finish after working for 8 hours. You can cancel earlier if you wish" +
          ` but you will only gain ${penaltyString} of the reputation you've earned so far.`,
      };

      break;
    }

    case WorkType.CompanyPartTime: {
      function cancel(): void {
        player.finishWorkPartTime(true);
        router.toJob();
      }
      function unfocus(): void {
        player.stopFocusing();
        router.toJob();
      }
      const comp = Companies[player.companyName];
      let companyRep = 0;
      if (comp == null || !(comp instanceof Company)) {
        throw new Error(`Could not find Company: ${player.companyName}`);
      }
      companyRep = comp.playerReputation;

      const position = player.jobs[player.companyName];

      workInfo = {
        buttons: {
          cancel: cancel,
          unfocus: unfocus,
        },
        title: (
          <>
            You are currently working as a <b>{position}</b> at <b>{player.companyName}</b>
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
              <Money money={player.workMoneyGained} /> (<MoneyRate money={player.workMoneyGainRate * CYCLES_PER_SEC} />)
            </Typography>
          </StatsRow>,
          <StatsRow name="Company Reputation" color={Settings.theme.rep}>
            <Typography>
              <Reputation reputation={player.workRepGained} /> (
              <ReputationRate reputation={player.workRepGainRate * CYCLES_PER_SEC} />)
            </Typography>
          </StatsRow>,
          ...expGains,
        ],
        progress: {
          elapsed: player.timeWorked,
        },

        stopText: "Stop working",
        stopTooltip:
          "You will automatically finish after working for 8 hours. You can cancel earlier if you wish" +
          " and there will be no penalty because this is a part-time job.",
      };

      break;
    }

    default:
      if (player.currentWork === null) {
        router.toTerminal();
      }
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
