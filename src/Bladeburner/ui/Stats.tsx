import React, { useState, useEffect } from "react";
import { formatNumber, convertTimeMsToTimeElapsedString } from "../../utils/StringHelperFunctions";
import { BladeburnerConstants } from "../data/Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Money } from "../../ui/React/Money";
import { StatsTable } from "../../ui/React/StatsTable";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Factions } from "../../Faction/Factions";
import { IRouter } from "../../ui/Router";
import { joinFaction } from "../../Faction/FactionHelpers";
import { IBladeburner } from "../IBladeburner";

import { TravelModal } from "./TravelModal";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";

interface IProps {
  bladeburner: IBladeburner;
  router: IRouter;
  player: IPlayer;
}

export function Stats(props: IProps): React.ReactElement {
  const [travelOpen, setTravelOpen] = useState(false);
  const setRerender = useState(false)[1];

  const inFaction = props.bladeburner.rank >= BladeburnerConstants.RankNeededForFaction;
  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => clearInterval(id);
  }, []);

  function openFaction(): void {
    if (!inFaction) return;
    const faction = Factions["Bladeburners"];
    if (!faction.isMember) {
      joinFaction(faction);
    }

    props.router.toFaction(faction);
  }

  return (
    <Paper sx={{ p: 1 }}>
      <Box display="flex">
        <Tooltip title={<Typography>Your rank within the Bladeburner division.</Typography>}>
          <Typography>Rank: {formatNumber(props.bladeburner.rank, 2)}</Typography>
        </Tooltip>
      </Box>
      <br />
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              Performing actions will use up your stamina.
              <br />
              <br />
              Your max stamina is determined primarily by your agility stat.
              <br />
              <br />
              Your stamina gain rate is determined by both your agility and your max stamina. Higher max stamina leads
              to a higher gain rate.
              <br />
              <br />
              Once your stamina falls below 50% of its max value, it begins to negatively affect the success rate of
              your contracts/operations. This penalty is shown in the overview panel. If the penalty is 15%, then this
              means your success rate would be multipled by 85% (100 - 15).
              <br />
              <br />
              Your max stamina and stamina gain rate can also be increased by training, or through skills and
              Augmentation upgrades.
            </Typography>
          }
        >
          <Typography>
            Stamina: {formatNumber(props.bladeburner.stamina, 3)} / {formatNumber(props.bladeburner.maxStamina, 3)}
          </Typography>
        </Tooltip>
      </Box>
      <br />
      <Typography>
        Stamina Penalty: {formatNumber((1 - props.bladeburner.calculateStaminaPenalty()) * 100, 1)}%
      </Typography>
      <br />
      <Typography>Team Size: {formatNumber(props.bladeburner.teamSize, 0)}</Typography>
      <Typography>Team Members Lost: {formatNumber(props.bladeburner.teamLost, 0)}</Typography>
      <br />
      <Typography>Num Times Hospitalized: {props.bladeburner.numHosp}</Typography>
      <Typography>
        Money Lost From Hospitalizations: <Money money={props.bladeburner.moneyLost} />
      </Typography>
      <br />
      <Typography>Current City: {props.bladeburner.city}</Typography>
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              This is your Bladeburner division's estimate of how many Synthoids exist in your current city. An accurate
              population count increases success rate estimates.
            </Typography>
          }
        >
          <Typography>
            Est. Synthoid Population: {numeralWrapper.formatPopulation(props.bladeburner.getCurrentCity().popEst)}
          </Typography>
        </Tooltip>
      </Box>
      <br />
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              This is your Bladeburner divison's estimate of how many Synthoid communities exist in your current city.
            </Typography>
          }
        >
          <Typography>Synthoid Communities: {formatNumber(props.bladeburner.getCurrentCity().comms, 0)}</Typography>
        </Tooltip>
      </Box>
      <br />
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              The city's chaos level due to tensions and conflicts between humans and Synthoids. Having too high of a
              chaos level can make contracts and operations harder.
            </Typography>
          }
        >
          <Typography>City Chaos: {formatNumber(props.bladeburner.getCurrentCity().chaos)}</Typography>
        </Tooltip>
      </Box>
      <br />
      {(props.bladeburner.storedCycles / BladeburnerConstants.CyclesPerSecond) * 1000 > 15000 && (
        <>
          <Box display="flex">
            <Tooltip
              title={
                <Typography>
                  You gain bonus time while offline or when the game is inactive (e.g. when the tab is throttled by
                  browser). Bonus time makes the Bladeburner mechanic progress faster, up to 5x the normal speed.
                </Typography>
              }
            >
              <Typography>
                Bonus time:{" "}
                {convertTimeMsToTimeElapsedString(
                  (props.bladeburner.storedCycles / BladeburnerConstants.CyclesPerSecond) * 1000,
                )}
              </Typography>
            </Tooltip>
          </Box>
          <br />
        </>
      )}
      <Typography>Skill Points: {formatNumber(props.bladeburner.skillPoints, 0)}</Typography>
      <br />
      <StatsTable
        rows={[
          ["Aug. Success Chance mult: ", formatNumber(props.player.bladeburner_success_chance_mult * 100, 1) + "%"],
          ["Aug. Max Stamina mult: ", formatNumber(props.player.bladeburner_max_stamina_mult * 100, 1) + "%"],
          ["Aug. Stamina Gain mult: ", formatNumber(props.player.bladeburner_stamina_gain_mult * 100, 1) + "%"],
          ["Aug. Field Analysis mult: ", formatNumber(props.player.bladeburner_analysis_mult * 100, 1) + "%"],
        ]}
      />
      <br />
      <Button onClick={() => setTravelOpen(true)}>Travel</Button>
      <Tooltip title={!inFaction ? <Typography>Rank 25 required.</Typography> : ""}>
        <span>
          <Button disabled={!inFaction} onClick={openFaction}>
            Faction
          </Button>
        </span>
      </Tooltip>
      <TravelModal open={travelOpen} onClose={() => setTravelOpen(false)} bladeburner={props.bladeburner} />
    </Paper>
  );
}
