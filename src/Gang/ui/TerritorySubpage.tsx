/**
 * React Component for the territory subpage.
 */
import React, { useState } from "react";

import { Container, Button, Paper, Box, Tooltip, Switch, FormControlLabel, Typography } from "@mui/material";
import { Help } from "@mui/icons-material";

import { numeralWrapper } from "../../ui/numeralFormat";
import { formatNumber } from "../../utils/StringHelperFunctions";

import { AllGangs } from "../AllGangs";

import { useGang } from "./Context";
import { TerritoryInfoModal } from "./TerritoryInfoModal";

export function TerritorySubpage(): React.ReactElement {
  const gang = useGang();
  const gangNames = Object.keys(AllGangs).filter((g) => g != gang.facName);
  const [infoOpen, setInfoOpen] = useState(false);

  return (
    <Container disableGutters maxWidth="md" sx={{ mx: 0 }}>
      <Typography>
        This page shows how much territory your Gang controls. This statistic is listed as a percentage, which
        represents how much of the total territory you control.
      </Typography>

      <Button onClick={() => setInfoOpen(true)} sx={{ my: 1 }}>
        <Help sx={{ mr: 1 }} />
        About Gang Territory
      </Button>

      <Box component={Paper} sx={{ p: 1, mb: 1 }}>
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          {gang.facName} (Your gang)
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
                  If this is enabled, then you will receive a pop-up notifying you whenever one of your Gang Members
                  dies in a territory clash.
                </Typography>
              }
            >
              <Typography>Notify about Gang Member Deaths</Typography>
            </Tooltip>
          }
        />

        <Typography>
          <b>Territory Clash Chance:</b> {numeralWrapper.formatPercentage(gang.territoryClashChance, 3)} <br />
          <b>Power:</b> {formatNumber(AllGangs[gang.facName].power, 3)} <br />
          <b>Territory:</b> {formatTerritory(AllGangs[gang.facName].territory)}% <br />
        </Typography>
      </Box>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {gangNames
          .filter((name) => AllGangs[name].territory > 0)
          .map((name) => (
            <OtherGangTerritory key={name} name={name} />
          ))}
      </Box>
      <TerritoryInfoModal open={infoOpen} onClose={() => setInfoOpen(false)} />
    </Container>
  );
}
function formatTerritory(n: number): string {
  const v = n * 100;
  const precision = 3;
  if (v <= 0) {
    return formatNumber(0, precision);
  } else if (v >= 100) {
    return formatNumber(100, precision);
  } else {
    return formatNumber(v, precision);
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
    <Box component={Paper} sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        {props.name}
      </Typography>
      <Typography>
        <b>Power:</b> {formatNumber(power, 3)} <br />
        <b>Territory:</b> {formatTerritory(AllGangs[props.name].territory)}% <br />
        <b>Clash Win Chance:</b> {numeralWrapper.formatPercentage(clashVictoryChance, 3)}
      </Typography>
    </Box>
  );
}
