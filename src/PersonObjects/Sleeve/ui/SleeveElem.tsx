import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { CONSTANTS } from "../../../Constants";
import { Crimes } from "../../../Crime/Crimes";
import { FactionWorkType } from "../../../Faction/FactionWorkTypeEnum";
import { use } from "../../../ui/Context";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { ProgressBar } from "../../../ui/React/Progress";
import { Sleeve } from "../Sleeve";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";
import { MoreEarningsModal } from "./MoreEarningsModal";
import { MoreStatsModal } from "./MoreStatsModal";
import { SleeveAugmentationsModal } from "./SleeveAugmentationsModal";
import { EarningsElement, StatsElement } from "./StatsElement";
import { TaskSelector } from "./TaskSelector";
import { TravelModal } from "./TravelModal";

interface IProps {
  sleeve: Sleeve;
  rerender: () => void;
}

export function SleeveElem(props: IProps): React.ReactElement {
  const player = use.Player();
  const [statsOpen, setStatsOpen] = useState(false);
  const [earningsOpen, setEarningsOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [augmentationsOpen, setAugmentationsOpen] = useState(false);

  const [abc, setABC] = useState(["------", "------", "------"]);

  function setTask(): void {
    props.sleeve.resetTaskStatus(); // sets to idle
    switch (abc[0]) {
      case "------":
        break;
      case "Work for Company":
        props.sleeve.workForCompany(player, abc[1]);
        break;
      case "Work for Faction":
        props.sleeve.workForFaction(player, abc[1], abc[2]);
        break;
      case "Commit Crime":
        props.sleeve.commitCrime(player, abc[1]);
        break;
      case "Take University Course":
        props.sleeve.takeUniversityCourse(player, abc[2], abc[1]);
        break;
      case "Workout at Gym":
        props.sleeve.workoutAtGym(player, abc[2], abc[1]);
        break;
      case "Shock Recovery":
        props.sleeve.shockRecovery(player);
        break;
      case "Synchronize":
        props.sleeve.synchronize(player);
        break;
      default:
        console.error(`Invalid/Unrecognized taskValue in setSleeveTask(): ${abc[0]}`);
    }
    props.rerender();
  }

  let desc = <></>;
  switch (props.sleeve.currentTask) {
    case SleeveTaskType.Idle:
      desc = <>This sleeve is currently idle</>;
      break;
    case SleeveTaskType.Company:
      desc = <>This sleeve is currently working your job at {props.sleeve.currentTaskLocation}.</>;
      break;
    case SleeveTaskType.Faction: {
      let doing = "nothing";
      switch (props.sleeve.factionWorkType) {
        case FactionWorkType.Field:
          doing = "Field work";
          break;
        case FactionWorkType.Hacking:
          doing = "Hacking contracts";
          break;
        case FactionWorkType.Security:
          doing = "Security work";
          break;
      }
      desc = (
        <>
          This sleeve is currently doing {doing} for {props.sleeve.currentTaskLocation}.
        </>
      );
      break;
    }
    case SleeveTaskType.Crime: {
      const crime = Object.values(Crimes).find((crime) => crime.name === props.sleeve.crimeType);
      if (!crime) throw new Error("crime should not be undefined");
      desc = (
        <>
          This sleeve is currently attempting to {crime.type} (Success Rate:{" "}
          {numeralWrapper.formatPercentage(crime.successRate(props.sleeve))}).
        </>
      );
      break;
    }
    case SleeveTaskType.Class:
      desc = <>This sleeve is currently studying/taking a course at {props.sleeve.currentTaskLocation}.</>;
      break;
    case SleeveTaskType.Gym:
      desc = <>This sleeve is currently working out at {props.sleeve.currentTaskLocation}.</>;
      break;
    case SleeveTaskType.Recovery:
      desc = (
        <>
          This sleeve is currently set to focus on shock recovery. This causes the Sleeve's shock to decrease at a
          faster rate.
        </>
      );
      break;
    case SleeveTaskType.Synchro:
      desc = (
        <>
          This sleeve is currently set to synchronize with the original consciousness. This causes the Sleeve's
          synchronization to increase.
        </>
      );
      break;
    default:
      console.error(`Invalid/Unrecognized taskValue in updateSleeveTaskDescription(): ${abc[0]}`);
  }

  return (
    <>
      <Paper sx={{ p: 1, display: "grid", gridTemplateColumns: "1fr 1fr", width: "auto", gap: 1 }}>
        <span>
          <StatsElement sleeve={props.sleeve} />
          <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", width: "100%" }}>
            <Button onClick={() => setStatsOpen(true)}>More Stats</Button>
            <Button onClick={() => setEarningsOpen(true)}>More Earnings Info</Button>
            <Tooltip title={player.money < CONSTANTS.TravelCost ? <Typography>Insufficient funds</Typography> : ""}>
              <span>
                <Button
                  onClick={() => setTravelOpen(true)}
                  disabled={player.money < CONSTANTS.TravelCost}
                  sx={{ width: "100%", height: "100%" }}
                >
                  Travel
                </Button>
              </span>
            </Tooltip>
            <Tooltip
              title={props.sleeve.shock < 100 ? <Typography>Unlocked when sleeve has fully recovered</Typography> : ""}
            >
              <span>
                <Button
                  onClick={() => setAugmentationsOpen(true)}
                  disabled={props.sleeve.shock < 100}
                  sx={{ width: "100%", height: "100%" }}
                >
                  Manage Augmentations
                </Button>
              </span>
            </Tooltip>
          </Box>
        </span>
        <span>
          <EarningsElement sleeve={props.sleeve} />
          <TaskSelector player={player} sleeve={props.sleeve} setABC={setABC} />
          <Button onClick={setTask} sx={{ width: "100%" }}>
            Set Task
          </Button>
          <Typography>{desc}</Typography>
          <Typography>
            {props.sleeve.currentTask === SleeveTaskType.Crime && (
              <ProgressBar
                variant="determinate"
                value={(props.sleeve.currentTaskTime / props.sleeve.currentTaskMaxTime) * 100}
                color="primary"
              />
            )}
          </Typography>
        </span>
      </Paper>
      <MoreStatsModal open={statsOpen} onClose={() => setStatsOpen(false)} sleeve={props.sleeve} />
      <MoreEarningsModal open={earningsOpen} onClose={() => setEarningsOpen(false)} sleeve={props.sleeve} />
      <TravelModal
        open={travelOpen}
        onClose={() => setTravelOpen(false)}
        sleeve={props.sleeve}
        rerender={props.rerender}
      />
      <SleeveAugmentationsModal
        open={augmentationsOpen}
        onClose={() => setAugmentationsOpen(false)}
        sleeve={props.sleeve}
      />
    </>
  );
}
