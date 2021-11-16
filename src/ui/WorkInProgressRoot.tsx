import React, { useState, useEffect } from "react";
import { use } from "./Context";
import { CONSTANTS } from "../Constants";
import { numeralWrapper } from "./numeralFormat";
import { Reputation } from "./React/Reputation";
import { ReputationRate } from "./React/ReputationRate";
import { MoneyRate } from "./React/MoneyRate";
import { Money } from "./React/Money";
import { convertTimeMsToTimeElapsedString } from "../utils/StringHelperFunctions";
import { Factions } from "../Faction/Factions";
import { Company } from "../Company/Company";
import { Companies } from "../Company/Companies";
import { Locations } from "../Locations/Locations";
import { LocationName } from "../Locations/data/LocationNames";

import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import { createProgressBarText } from "../utils/helpers/createProgressBarText";

const CYCLES_PER_SEC = 1000 / CONSTANTS.MilliPerCycle;

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
  const faction = Factions[player.currentWorkFactionName];
  if (player.workType == CONSTANTS.WorkTypeFaction) {
    function cancel(): void {
      router.toFaction(faction);
      player.finishFactionWork(true);
    }
    function unfocus(): void {
      router.toFaction(faction);
      player.stopFocusing();
    }
    console.log(`${player.currentWorkFactionName} ${player.workRepGainRate}`);
    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography>
            You are currently {player.currentWorkFactionDescription} for your faction {faction.name}
            <br />
            (Current Faction Reputation: <Reputation reputation={faction.playerReputation} />
            ). <br />
            You have been doing this for {convertTimeMsToTimeElapsedString(player.timeWorked)}
            <br />
            <br />
            You have earned: <br />
            <br />
            <Money money={player.workMoneyGained} /> (<MoneyRate money={player.workMoneyGainRate * CYCLES_PER_SEC} />){" "}
            <br />
            <br />
            <Reputation reputation={player.workRepGained} /> (
            <ReputationRate reputation={player.workRepGainRate * CYCLES_PER_SEC} />) reputation for this faction <br />
            <br />
            {numeralWrapper.formatExp(player.workHackExpGained)} (
            {numeralWrapper.formatExp(player.workHackExpGainRate * CYCLES_PER_SEC)} / sec) hacking exp <br />
            <br />
            {numeralWrapper.formatExp(player.workStrExpGained)} (
            {numeralWrapper.formatExp(player.workStrExpGainRate * CYCLES_PER_SEC)} / sec) strength exp <br />
            {numeralWrapper.formatExp(player.workDefExpGained)} (
            {numeralWrapper.formatExp(player.workDefExpGainRate * CYCLES_PER_SEC)} / sec) defense exp <br />
            {numeralWrapper.formatExp(player.workDexExpGained)} (
            {numeralWrapper.formatExp(player.workDexExpGainRate * CYCLES_PER_SEC)} / sec) dexterity exp <br />
            {numeralWrapper.formatExp(player.workAgiExpGained)} (
            {numeralWrapper.formatExp(player.workAgiExpGainRate * CYCLES_PER_SEC)} / sec) agility exp <br />
            <br />
            {numeralWrapper.formatExp(player.workChaExpGained)} (
            {numeralWrapper.formatExp(player.workChaExpGainRate * CYCLES_PER_SEC)} / sec) charisma exp <br />
            <br />
            You will automatically finish after working for 20 hours. You can cancel earlier if you wish.
            <br />
            There is no penalty for cancelling earlier.
          </Typography>
        </Grid>
        <Grid item>
          <Button sx={{ mx: 2 }} onClick={cancel}>
            Stop Faction Work
          </Button>
          <Button onClick={unfocus}>Do something else simultaneously</Button>
        </Grid>
      </Grid>
    );
  }

  const className = player.className;
  if (player.className !== "") {
    function cancel(): void {
      player.finishClass(true);
      router.toCity();
    }

    let stopText = "";
    if (
      className == CONSTANTS.ClassGymStrength ||
      className == CONSTANTS.ClassGymDefense ||
      className == CONSTANTS.ClassGymDexterity ||
      className == CONSTANTS.ClassGymAgility
    ) {
      stopText = "Stop training at gym";
    } else {
      stopText = "Stop taking course";
    }

    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography>
            You have been {className} for {convertTimeMsToTimeElapsedString(player.timeWorked)}
            <br />
            <br />
            This has cost you: <br />
            <Money money={-player.workMoneyGained} /> (<MoneyRate money={player.workMoneyLossRate * CYCLES_PER_SEC} />){" "}
            <br />
            <br />
            You have gained: <br />
            {numeralWrapper.formatExp(player.workHackExpGained)} (
            {numeralWrapper.formatExp(player.workHackExpGainRate * CYCLES_PER_SEC)} / sec) hacking exp <br />
            {numeralWrapper.formatExp(player.workStrExpGained)} (
            {numeralWrapper.formatExp(player.workStrExpGainRate * CYCLES_PER_SEC)} / sec) strength exp <br />
            {numeralWrapper.formatExp(player.workDefExpGained)} (
            {numeralWrapper.formatExp(player.workDefExpGainRate * CYCLES_PER_SEC)} / sec) defense exp <br />
            {numeralWrapper.formatExp(player.workDexExpGained)} (
            {numeralWrapper.formatExp(player.workDexExpGainRate * CYCLES_PER_SEC)} / sec) dexterity exp <br />
            {numeralWrapper.formatExp(player.workAgiExpGained)} (
            {numeralWrapper.formatExp(player.workAgiExpGainRate * CYCLES_PER_SEC)} / sec) agility exp <br />
            {numeralWrapper.formatExp(player.workChaExpGained)} (
            {numeralWrapper.formatExp(player.workChaExpGainRate * CYCLES_PER_SEC)} / sec) charisma exp <br />
            You may cancel at any time
          </Typography>
        </Grid>
        <Grid item>
          <Button onClick={cancel}>{stopText}</Button>
        </Grid>
      </Grid>
    );
  }

  if (player.workType == CONSTANTS.WorkTypeCompany) {
    const comp = Companies[player.companyName];
    let companyRep = 0;
    if (comp == null || !(comp instanceof Company)) {
      throw new Error(`Could not find Company: ${player.companyName}`);
    }
    companyRep = comp.playerReputation;

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
    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography>
            You are currently working as a {position} at {player.companyName} (Current Company Reputation:{" "}
            <Reputation reputation={companyRep} />)<br />
            <br />
            You have been working for {convertTimeMsToTimeElapsedString(player.timeWorked)}
            <br />
            <br />
            You have earned: <br />
            <br />
            <Money money={player.workMoneyGained} /> (<MoneyRate money={player.workMoneyGainRate * CYCLES_PER_SEC} />){" "}
            <br />
            <br />
            <Reputation reputation={player.workRepGained} /> (
            <ReputationRate reputation={player.workRepGainRate * CYCLES_PER_SEC} />) reputation for this company <br />
            <br />
            {numeralWrapper.formatExp(player.workHackExpGained)} (
            {`${numeralWrapper.formatExp(player.workHackExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) hacking exp <br />
            <br />
            {numeralWrapper.formatExp(player.workStrExpGained)} (
            {`${numeralWrapper.formatExp(player.workStrExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) strength exp <br />
            {numeralWrapper.formatExp(player.workDefExpGained)} (
            {`${numeralWrapper.formatExp(player.workDefExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) defense exp <br />
            {numeralWrapper.formatExp(player.workDexExpGained)} (
            {`${numeralWrapper.formatExp(player.workDexExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) dexterity exp <br />
            {numeralWrapper.formatExp(player.workAgiExpGained)} (
            {`${numeralWrapper.formatExp(player.workAgiExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) agility exp <br />
            <br />
            {numeralWrapper.formatExp(player.workChaExpGained)} (
            {`${numeralWrapper.formatExp(player.workChaExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) charisma exp <br />
            <br />
            You will automatically finish after working for 8 hours. You can cancel earlier if you wish, but you will
            only gain {penaltyString} of the reputation you've earned so far.
          </Typography>
        </Grid>
        <Grid item>
          <Button sx={{ mx: 2 }} onClick={cancel}>
            Stop Working
          </Button>
          <Button onClick={unfocus}>Do something else simultaneously</Button>
        </Grid>
      </Grid>
    );
  }

  if (player.workType == CONSTANTS.WorkTypeCompanyPartTime) {
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
    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography>
            You are currently working as a {position} at {player.companyName} (Current Company Reputation:{" "}
            <Reputation reputation={companyRep} />)<br />
            <br />
            You have been working for {convertTimeMsToTimeElapsedString(player.timeWorked)}
            <br />
            <br />
            You have earned: <br />
            <br />
            <Money money={player.workMoneyGained} /> (<MoneyRate money={player.workMoneyGainRate * CYCLES_PER_SEC} />){" "}
            <br />
            <br />
            <Reputation reputation={player.workRepGained} /> (
            <ReputationRate reputation={player.workRepGainRate * CYCLES_PER_SEC} />
            ) reputation for this company <br />
            <br />
            {numeralWrapper.formatExp(player.workHackExpGained)} (
            {`${numeralWrapper.formatExp(player.workHackExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) hacking exp <br />
            <br />
            {numeralWrapper.formatExp(player.workStrExpGained)} (
            {`${numeralWrapper.formatExp(player.workStrExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) strength exp <br />
            {numeralWrapper.formatExp(player.workDefExpGained)} (
            {`${numeralWrapper.formatExp(player.workDefExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) defense exp <br />
            {numeralWrapper.formatExp(player.workDexExpGained)} (
            {`${numeralWrapper.formatExp(player.workDexExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) dexterity exp <br />
            {numeralWrapper.formatExp(player.workAgiExpGained)} (
            {`${numeralWrapper.formatExp(player.workAgiExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) agility exp <br />
            <br />
            {numeralWrapper.formatExp(player.workChaExpGained)} (
            {`${numeralWrapper.formatExp(player.workChaExpGainRate * CYCLES_PER_SEC)} / sec`}
            ) charisma exp <br />
            <br />
            You will automatically finish after working for 8 hours. You can cancel earlier if you wish, and there will
            be no penalty because this is a part-time job.
          </Typography>
        </Grid>
        <Grid item>
          <Button sx={{ mx: 2 }} onClick={cancel}>
            Stop Working
          </Button>
          <Button onClick={unfocus}>Do something else simultaneously</Button>
        </Grid>
      </Grid>
    );
  }

  if (player.crimeType !== "") {
    const percent = Math.round((player.timeWorked / player.timeNeededToCompleteWork) * 100);
    let numBars = Math.round(percent / 5);
    if (numBars < 0) {
      numBars = 0;
    }
    if (numBars > 20) {
      numBars = 20;
    }
    // const progressBar = "[" + Array(numBars + 1).join("|") + Array(20 - numBars + 1).join(" ") + "]";
    const progressBar = createProgressBarText({ progress: (numBars + 1) / 20, totalTicks: 20 });

    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography>
            <Typography>You are attempting to {player.crimeType}.</Typography>
            <br />

            <Typography>
              Time remaining: {convertTimeMsToTimeElapsedString(player.timeNeededToCompleteWork - player.timeWorked)}
            </Typography>

            <br />
            <pre>{progressBar}</pre>
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              router.toLocation(Locations[LocationName.Slums]);
              player.finishCrime(true);
            }}
          >
            Cancel crime
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (player.createProgramName !== "") {
    return (
      <Grid container direction="column" justifyContent="center" alignItems="center" style={{ minHeight: "100vh" }}>
        <Grid item>
          <Typography>
            You are currently working on coding {player.createProgramName}.<br />
            <br />
            You have been working for {convertTimeMsToTimeElapsedString(player.timeWorked)}
            <br />
            <br />
            The program is {((player.timeWorkedCreateProgram / player.timeNeededToCompleteWork) * 100).toFixed(2)}
            % complete. <br />
            If you cancel, your work will be saved and you can come back to complete the program later.
          </Typography>
        </Grid>
        <Grid item>
          <Button
            onClick={() => {
              player.finishCreateProgramWork(true);
              router.toTerminal();
            }}
          >
            Cancel work on creating program
          </Button>
        </Grid>
      </Grid>
    );
  }

  if (!player.workType) router.toTerminal();

  return <></>;
}
