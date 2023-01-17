/**
 * React Component for the stats related to the gang, like total respect and
 * money per second.
 */
import React from "react";
import { Factions } from "../../Faction/Factions";

import { formatNumber } from "../../utils/StringHelperFunctions";
import { numeralWrapper } from "../../ui/numeralFormat";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { Reputation } from "../../ui/React/Reputation";
import { AllGangs } from "../AllGangs";
import { BonusTime } from "./BonusTime";
import { useGang } from "./Context";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

export function GangStats(): React.ReactElement {
  const gang = useGang();
  const territoryMult = AllGangs[gang.facName].territory * 100;
  let territoryStr;
  if (territoryMult <= 0) {
    territoryStr = formatNumber(0, 2);
  } else if (territoryMult >= 100) {
    territoryStr = formatNumber(100, 2);
  } else {
    territoryStr = formatNumber(territoryMult, 2);
  }

  return (
    <>
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              Represents the amount of respect your gang has from other gangs and criminal organizations. Your respect
              affects the amount of money your gang members will earn, and also determines how much reputation you are
              earning with your gang's corresponding Faction.
            </Typography>
          }
        >
          <Typography>
            Respect: {numeralWrapper.formatRespect(gang.respect)} (
            {numeralWrapper.formatRespect(5 * gang.respectGainRate)} / sec)
          </Typography>
        </Tooltip>
      </Box>

      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              Represents how much the gang is wanted by law enforcement. The higher your gang's wanted level, the harder
              it will be for your gang members to make money and earn respect. Note that the minimum wanted level is 1.
            </Typography>
          }
        >
          <Typography>
            Wanted Level: {numeralWrapper.formatWanted(gang.wanted)} (
            {numeralWrapper.formatWanted(5 * gang.wantedGainRate)} / sec)
          </Typography>
        </Tooltip>
      </Box>

      <Box display="flex">
        <Tooltip title={<Typography>Penalty for respect and money gain rates due to Wanted Level</Typography>}>
          <Typography>Wanted Level Penalty: -{formatNumber((1 - gang.getWantedPenalty()) * 100, 2)}%</Typography>
        </Tooltip>
      </Box>

      <Typography>
        Money gain rate: <MoneyRate money={5 * gang.moneyGainRate} />
      </Typography>

      <Box display="flex">
        <Tooltip title={<Typography>The percentage of total territory your Gang controls</Typography>}>
          <Typography>Territory: {territoryStr}%</Typography>
        </Tooltip>
      </Box>
      <Typography>
        Faction reputation: <Reputation reputation={Factions[gang.facName].playerReputation} />
      </Typography>

      <BonusTime gang={gang} />
    </>
  );
}
