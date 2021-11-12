import React, { useState } from "react";

import { Sleeve } from "../Sleeve";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";

import { CONSTANTS } from "../../../Constants";

import { Crimes } from "../../../Crime/Crimes";

import { numeralWrapper } from "../../../ui/numeralFormat";

import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";

import { SleeveAugmentationsModal } from "./SleeveAugmentationsModal";
import { TravelModal } from "./TravelModal";
import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { use } from "../../../ui/Context";
import { ReputationRate } from "../../../ui/React/ReputationRate";
import { StatsElement } from "../ui/StatsElement";
import { MoreStatsModal } from "./MoreStatsModal";
import { MoreEarningsModal } from "../ui/MoreEarningsModal";
import { TaskSelector } from "../ui/TaskSelector";
import { FactionWorkType } from "../../../Faction/FactionWorkTypeEnum";
import { StatsTable } from "../../../ui/React/StatsTable";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

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

  let data: any[][] = [];
  if (props.sleeve.currentTask === SleeveTaskType.Crime) {
    data = [
      [`Money`, <Money money={parseFloat(props.sleeve.currentTaskLocation)} />, `(on success)`],
      [`Hacking Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.hack), `(2x on success)`],
      [`Strength Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.str), `(2x on success)`],
      [`Defense Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.def), `(2x on success)`],
      [`Dexterity Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.dex), `(2x on success)`],
      [`Agility Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.agi), `(2x on success)`],
      [`Charisma Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.cha), `(2x on success)`],
    ];
  } else {
    data = [
      [`Money:`, <MoneyRate money={5 * props.sleeve.gainRatesForTask.money} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.hack)} / s`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.str)} / s`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.def)} / s`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.dex)} / s`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.agi)} / s`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.cha)} / s`],
    ];
    if (props.sleeve.currentTask === SleeveTaskType.Company || props.sleeve.currentTask === SleeveTaskType.Faction) {
      const repGain: number = props.sleeve.getRepGain(player);
      data.push([`Reputation:`, <ReputationRate reputation={5 * repGain} />]);
    }
  }

  return (
    <>
      <Grid container component={Paper}>
        <Grid item xs={3}>
          <StatsElement sleeve={props.sleeve} />
          <Button onClick={() => setStatsOpen(true)}>More Stats</Button>
          <Tooltip title={player.money < CONSTANTS.TravelCost ? <Typography>Insufficient funds</Typography> : ""}>
            <span>
              <Button onClick={() => setTravelOpen(true)} disabled={player.money < CONSTANTS.TravelCost}>
                Travel
              </Button>
            </span>
          </Tooltip>
          <Tooltip
            title={props.sleeve.shock < 100 ? <Typography>Unlocked when sleeve has fully recovered</Typography> : ""}
          >
            <span>
              <Button onClick={() => setAugmentationsOpen(true)} disabled={props.sleeve.shock < 100}>
                Manage Augmentations
              </Button>
            </span>
          </Tooltip>
        </Grid>
        <Grid item xs={5}>
          <TaskSelector player={player} sleeve={props.sleeve} setABC={setABC} />
          <Typography>{desc}</Typography>
          <Typography>
            {props.sleeve.currentTask === SleeveTaskType.Crime &&
              createProgressBarText({
                progress: props.sleeve.currentTaskTime / props.sleeve.currentTaskMaxTime,
                totalTicks: 25,
              })}
          </Typography>
          <Button onClick={setTask}>Set Task</Button>
        </Grid>
        <Grid item xs={4}>
          <StatsTable title="Earnings (Pre-Synchronization)" rows={data} />
          <Button onClick={() => setEarningsOpen(true)}>More Earnings Info</Button>
        </Grid>
      </Grid>
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
