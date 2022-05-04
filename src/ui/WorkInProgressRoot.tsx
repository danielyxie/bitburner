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
import { WorkType } from "../utils/WorkType";

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

  const expGains = [
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

  let workInfo: IWorkInfo | null;

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

    case WorkType.StudyClass: {
      const className = player.className;
      function cancel(): void {
        player.finishClass(true);
        router.toCity();
      }

      function unfocus(): void {
        router.toCity();
        player.stopFocusing();
      }

      let stopText = "";
      if (
        className === CONSTANTS.ClassGymStrength ||
        className === CONSTANTS.ClassGymDefense ||
        className === CONSTANTS.ClassGymDexterity ||
        className === CONSTANTS.ClassGymAgility
      ) {
        stopText = "Stop training at gym";
      } else {
        stopText = "Stop taking course";
      }

      workInfo = {
        buttons: {
          cancel: cancel,
          unfocus: unfocus,
        },
        title: (
          <>
            You are currently <b>{className}</b>
          </>
        ),

        gains: [
          <StatsRow name="Total Cost" color={Settings.theme.money}>
            <Typography>
              <Money money={-player.workMoneyGained} /> (<MoneyRate money={player.workMoneyLossRate * CYCLES_PER_SEC} />
              )
            </Typography>
          </StatsRow>,
          ...expGains,
        ],
        progress: {
          elapsed: player.timeWorked,
        },

        stopText: stopText,
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

    case WorkType.Crime: {
      const completion = Math.round((player.timeWorked / player.timeNeededToCompleteWork) * 100);

      workInfo = {
        buttons: {
          cancel: () => {
            router.toLocation(Locations[LocationName.Slums]);
            player.finishCrime(true);
          },
        },
        title: `You are attempting to ${player.crimeType}`,

        progress: {
          remaining: player.timeNeededToCompleteWork - player.timeWorked,
          percentage: completion,
        },

        stopText: "Cancel crime",
      };

      break;
    }

    case WorkType.CreateProgram: {
      function cancel(): void {
        player.finishCreateProgramWork(true);
        router.toTerminal();
      }
      function unfocus(): void {
        router.toTerminal();
        player.stopFocusing();
      }

      const completion = (player.timeWorkedCreateProgram / player.timeNeededToCompleteWork) * 100;

      workInfo = {
        buttons: {
          cancel: cancel,
          unfocus: unfocus,
        },
        title: (
          <>
            You are currently working on coding <b>{player.createProgramName}</b>
          </>
        ),

        progress: {
          elapsed: player.timeWorked,
          percentage: completion,
        },

        stopText: "Stop creating program",
        stopTooltip: "Your work will be saved and you can return to complete the program later.",
      };

      break;
    }

    case WorkType.GraftAugmentation: {
      function cancel(): void {
        player.finishGraftAugmentationWork(true);
        router.toTerminal();
      }
      function unfocus(): void {
        router.toTerminal();
        player.stopFocusing();
      }

      const completion = (player.timeWorkedGraftAugmentation / player.timeNeededToCompleteWork) * 100;

      workInfo = {
        buttons: {
          cancel: cancel,
          unfocus: unfocus,
        },
        title: (
          <>
            You are currently working on grafting <b>{player.graftAugmentationName}</b>
          </>
        ),

        progress: {
          elapsed: player.timeWorked,
          percentage: completion,
        },

        stopText: "Stop grafting",
        stopTooltip: (
          <>
            If you cancel, your work will <b>not</b> be saved, and the money you spent will <b>not</b> be returned
          </>
        ),
      };

      break;
    }

    default:
      router.toTerminal();
      workInfo = null;
  }

  if (workInfo === null) {
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
