/**
 * React Component for the territory subpage.
 */
import React from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { AllGangs } from "../AllGangs";
import { Gang } from "../Gang";
import { useGang } from "./Context";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

export function TerritorySubpage(): React.ReactElement {
  const gang = useGang();
  const gangNames = Object.keys(AllGangs).filter((g) => g != gang.facName);

  return (
    <>
      <Typography>
        This page shows how much territory your Gang controls. This statistic is listed as a percentage, which
        represents how much of the total territory you control.
        <br />
        <br />
        Every ~20 seconds, your gang has a chance to 'clash' with other gangs. Your chance to win a clash depends on
        your gang's power, which is listed in the display below. Your gang's power slowly accumulates over time. The
        accumulation rate is determined by the stats of all Gang members you have assigned to the 'Territory Warfare'
        task. Gang members that are not assigned to this task do not contribute to your gang's power. Your gang also
        loses a small amount of power whenever you lose a clash.
        <br />
        <br />
        NOTE: Gang members assigned to 'Territory Warfare' can be killed during clashes. This can happen regardless of
        whether you win or lose the clash. A gang member being killed results in both respect and power loss for your
        gang.
        <br />
        <br />
        The amount of territory you have affects all aspects of your Gang members' production, including money, respect,
        and wanted level. It is very beneficial to have high territory control.
        <br />
        <br />
      </Typography>
      <FormControlLabel
        control={
          <Switch
            checked={gang.territoryWarfareEngaged}
            onChange={(event) => (gang.territoryWarfareEngaged = event.target.checked)}
          />
        }
        label={
          <Tooltip
            title={
              <Typography>
                Engaging in Territory Warfare sets your clash chance to 100%. Disengaging will cause your clash chance
                to gradually decrease until it reaches 0%.
              </Typography>
            }
          >
            <Typography>Engage in Territory Warfare</Typography>
          </Tooltip>
        }
      />
      <br />
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              This percentage represents the chance you have of 'clashing' with with another gang. If you do not wish to
              gain/lose territory, then keep this percentage at 0% by not engaging in territory warfare.
            </Typography>
          }
        >
          <Typography>
            Territory Clash Chance: {numeralWrapper.formatPercentage(gang.territoryClashChance, 3)}
          </Typography>
        </Tooltip>
      </Box>
      <br />
      <FormControlLabel
        control={
          <Switch
            checked={gang.notifyMemberDeath}
            onChange={(event) => (gang.notifyMemberDeath = event.target.checked)}
          />
        }
        label={
          <Tooltip
            title={
              <Typography>
                If this is enabled, then you will receive a pop-up notifying you whenever one of your Gang Members dies
                in a territory clash.
              </Typography>
            }
          >
            <Typography>Notify about Gang Member Deaths</Typography>
          </Tooltip>
        }
      />
      <br />
      <Paper>
        <Typography>
          <b>
            <u>{gang.facName}</u>
          </b>
          <br />
          Power: {formatNumber(AllGangs[gang.facName].power, 6)}
          <br />
          Territory: {formatTerritory(AllGangs[gang.facName].territory)}%
          <br />
          <br />
        </Typography>
        {gangNames.map((name) => (
          <OtherGangTerritory key={name} name={name} />
        ))}
      </Paper>
    </>
  );
}
function formatTerritory(n: number): string {
  const v = n * 100;
  if (v <= 0) {
    return formatNumber(0, 2);
  } else if (v >= 100) {
    return formatNumber(100, 2);
  } else {
    return formatNumber(v, 2);
  }
}

interface ITerritoryProps {
  name: string;
}

function OtherGangTerritory(props: ITerritoryProps): React.ReactElement {
  const gang = useGang();
  const playerPower = AllGangs[gang.facName].power;
  const power = AllGangs[props.name].power;
  const clashVictoryChance = playerPower / (power + playerPower);
  return (
    <Typography>
      <u>{props.name}</u>
      <br />
      Power: {formatNumber(power, 6)}
      <br />
      Territory: {formatTerritory(AllGangs[props.name].territory)}%<br />
      Chance to win clash with this gang: {numeralWrapper.formatPercentage(clashVictoryChance, 3)}
      <br />
      <br />
    </Typography>
  );
}
