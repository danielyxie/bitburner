import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { FactionWorkType } from "../../../Work/data/FactionWorkType";
import { CONSTANTS } from "../../../Constants";
import { Player } from "@player";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { ProgressBar } from "../../../ui/React/Progress";
import { Sleeve } from "../Sleeve";
import { MoreStatsModal } from "./MoreStatsModal";
import { SleeveAugmentationsModal } from "./SleeveAugmentationsModal";
import { EarningsElement, StatsElement } from "./StatsElement";
import { TaskSelector } from "./TaskSelector";
import { TravelModal } from "./TravelModal";
import { isSleeveClassWork } from "../Work/SleeveClassWork";
import { isSleeveSynchroWork } from "../Work/SleeveSynchroWork";
import { isSleeveRecoveryWork } from "../Work/SleeveRecoveryWork";
import { isSleeveFactionWork } from "../Work/SleeveFactionWork";
import { isSleeveCompanyWork } from "../Work/SleeveCompanyWork";
import { isSleeveInfiltrateWork } from "../Work/SleeveInfiltrateWork";
import { isSleeveSupportWork } from "../Work/SleeveSupportWork";
import { isSleeveBladeburnerWork } from "../Work/SleeveBladeburnerWork";
import { isSleeveCrimeWork } from "../Work/SleeveCrimeWork";
import { findCrime } from "../../../Crime/CrimeHelpers";
import { CrimeType } from "../../../utils/WorkType";

interface IProps {
  sleeve: Sleeve;
  rerender: () => void;
}

export function SleeveElem(props: IProps): React.ReactElement {
  const [statsOpen, setStatsOpen] = useState(false);
  const [travelOpen, setTravelOpen] = useState(false);
  const [augmentationsOpen, setAugmentationsOpen] = useState(false);

  const [abc, setABC] = useState(["------", "------", "------"]);

  function setTask(): void {
    switch (abc[0]) {
      case "------":
        break;
      case "Work for Company":
        props.sleeve.workForCompany(abc[1]);
        break;
      case "Work for Faction":
        props.sleeve.workForFaction(abc[1], abc[2]);
        break;
      case "Commit Crime":
        props.sleeve.commitCrime(findCrime(abc[1])?.type ?? CrimeType.SHOPLIFT);
        break;
      case "Take University Course":
        props.sleeve.takeUniversityCourse(abc[2], abc[1]);
        break;
      case "Workout at Gym":
        props.sleeve.workoutAtGym(abc[2], abc[1]);
        break;
      case "Perform Bladeburner Actions":
        props.sleeve.bladeburner(abc[1], abc[2]);
        break;
      case "Shock Recovery":
        props.sleeve.shockRecovery();
        break;
      case "Synchronize":
        props.sleeve.synchronize();
        break;
      default:
        console.error(`Invalid/Unrecognized taskValue in setSleeveTask(): ${abc[0]}`);
    }
    props.rerender();
  }

  let desc = <>This sleeve is currently idle</>;

  if (isSleeveCrimeWork(props.sleeve.currentWork)) {
    const w = props.sleeve.currentWork;
    const crime = w.getCrime();
    desc = (
      <>
        This sleeve is currently attempting {crime.workName} (Success Rate:{" "}
        {numeralWrapper.formatPercentage(crime.successRate(props.sleeve))}).
      </>
    );
  }

  if (isSleeveClassWork(props.sleeve.currentWork)) {
    if (props.sleeve.currentWork.isGym())
      desc = <>This sleeve is currently working out at {props.sleeve.currentWork.location}.</>;
    else desc = <>This sleeve is currently studying at {props.sleeve.currentWork.location}.</>;
  }
  if (isSleeveSynchroWork(props.sleeve.currentWork)) {
    desc = (
      <>
        This sleeve is currently set to synchronize with the original consciousness. This causes the Sleeve's
        synchronization to increase.
      </>
    );
  }
  if (isSleeveRecoveryWork(props.sleeve.currentWork)) {
    desc = (
      <>
        This sleeve is currently set to focus on shock recovery. This causes the Sleeve's shock to decrease at a faster
        rate.
      </>
    );
  }
  if (isSleeveFactionWork(props.sleeve.currentWork)) {
    let doing = "nothing";
    switch (props.sleeve.currentWork.factionWorkType) {
      case FactionWorkType.FIELD:
        doing = "Field work";
        break;
      case FactionWorkType.HACKING:
        doing = "Hacking contracts";
        break;
      case FactionWorkType.SECURITY:
        doing = "Security work";
        break;
    }
    desc = (
      <>
        This sleeve is currently doing {doing} for {props.sleeve.currentWork.factionName}.
      </>
    );
  }
  if (isSleeveCompanyWork(props.sleeve.currentWork)) {
    desc = <>This sleeve is currently working your job at {props.sleeve.currentWork.companyName}.</>;
  }

  if (isSleeveBladeburnerWork(props.sleeve.currentWork)) {
    const w = props.sleeve.currentWork;
    desc = (
      <>
        This sleeve is currently attempting to perform {w.actionName}. (
        {((100 * w.cyclesWorked) / w.cyclesNeeded(props.sleeve)).toFixed(2)}%)
      </>
    );
  }

  if (isSleeveInfiltrateWork(props.sleeve.currentWork)) {
    const w = props.sleeve.currentWork;
    desc = (
      <>
        This sleeve is currently attempting to infiltrate synthoids communities. (
        {((100 * w.cyclesWorked) / w.cyclesNeeded()).toFixed(2)}%)
      </>
    );
  }

  if (isSleeveSupportWork(props.sleeve.currentWork)) {
    desc = <>This sleeve is currently supporting you in your bladeburner activities.</>;
  }

  return (
    <>
      <Paper sx={{ p: 1, display: "grid", gridTemplateColumns: "1fr 1fr", width: "auto", gap: 1 }}>
        <span>
          <StatsElement sleeve={props.sleeve} />
          <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", width: "100%" }}>
            <Button onClick={() => setStatsOpen(true)}>More Stats</Button>
            <Tooltip title={Player.money < CONSTANTS.TravelCost ? <Typography>Insufficient funds</Typography> : ""}>
              <span>
                <Button
                  onClick={() => setTravelOpen(true)}
                  disabled={Player.money < CONSTANTS.TravelCost}
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
          <TaskSelector sleeve={props.sleeve} setABC={setABC} />
          <Button onClick={setTask} sx={{ width: "100%" }}>
            Set Task
          </Button>
          <Typography>{desc}</Typography>
          <Typography>
            {isSleeveCrimeWork(props.sleeve.currentWork) && (
              <ProgressBar
                variant="determinate"
                value={(props.sleeve.currentWork.cyclesWorked / props.sleeve.currentWork.cyclesNeeded()) * 100}
                color="primary"
              />
            )}
            {isSleeveBladeburnerWork(props.sleeve.currentWork) && (
              <ProgressBar
                variant="determinate"
                value={
                  (props.sleeve.currentWork.cyclesWorked / props.sleeve.currentWork.cyclesNeeded(props.sleeve)) * 100
                }
                color="primary"
              />
            )}
          </Typography>
        </span>
      </Paper>
      <MoreStatsModal open={statsOpen} onClose={() => setStatsOpen(false)} sleeve={props.sleeve} />
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
