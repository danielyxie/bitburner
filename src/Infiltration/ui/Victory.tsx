import { Factions } from "../../Faction/Factions";
import React, { useState } from "react";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { use } from "../../ui/Context";
import { FactionNames } from "../../Faction/data/FactionNames";
import { formatNumber } from "../../utils/StringHelperFunctions";
import {
  calculateInfiltratorsRepReward,
  calculateSellInformationCashReward,
  calculateTradeInformationRepReward,
} from "../formulas/victory";
import { inviteToFaction } from "../../Faction/FactionHelpers";
import { Button, MenuItem, Select, SelectChangeEvent, Paper, Typography, Box } from "@mui/material";
import { Location } from "../../Locations/Location";

interface IProps {
  StartingDifficulty: number;
  Difficulty: number;
  Reward: number;
  MaxLevel: number;
}

export function Victory(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [faction, setFaction] = useState("none");

  function quitInfiltration(): void {
    handleInfiltrators();
    router.toCity();
  }

  const soa = Factions[FactionNames.ShadowsOfAnarchy];
  const repGain = calculateTradeInformationRepReward(player, props.Reward, props.MaxLevel, props.StartingDifficulty);
  const moneyGain = calculateSellInformationCashReward(player, props.Reward, props.MaxLevel, props.StartingDifficulty);
  const infiltrationRepGain = calculateInfiltratorsRepReward(player, soa, props.StartingDifficulty);

  const isMemberOfInfiltrators = player.factions.includes(FactionNames.ShadowsOfAnarchy);

  function sell(): void {
    handleInfiltrators();
    player.gainMoney(moneyGain, "infiltration");
    quitInfiltration();
  }

  function trade(): void {
    handleInfiltrators();
    if (faction === "none") return;
    Factions[faction].playerReputation += repGain;
    quitInfiltration();
  }

  function changeDropdown(event: SelectChangeEvent<string>): void {
    setFaction(event.target.value);
  }

  function handleInfiltrators(): void {
    inviteToFaction(Factions[FactionNames.ShadowsOfAnarchy]);
    if (isMemberOfInfiltrators) {
      soa.playerReputation += infiltrationRepGain;
    }
  }

  return (
    <Paper sx={{ p: 1, textAlign: "center", display: "flex", alignItems: "center", flexDirection: "column" }}>
      <Typography variant="h4">Infiltration successful!</Typography>
      <Typography variant="h5" color="primary" width="75%">
        You{" "}
        {isMemberOfInfiltrators ? (
          <>
            have gained {formatNumber(infiltrationRepGain, 2)} rep for {FactionNames.ShadowsOfAnarchy} and{" "}
          </>
        ) : (
          <></>
        )}
        can trade the confidential information you found for money or reputation.
      </Typography>
      <Box sx={{ width: "fit-content" }}>
        <Box sx={{ width: "100%" }}>
          <Select value={faction} onChange={changeDropdown} sx={{ mr: 1 }}>
            <MenuItem key={"none"} value={"none"}>
              {"none"}
            </MenuItem>
            {player.factions
              .filter((f) => Factions[f].getInfo().offersWork())
              .map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
          </Select>
          <Button onClick={trade}>
            Trade for <Reputation reputation={repGain} /> reputation
          </Button>
        </Box>
        <Button onClick={sell} sx={{ width: "100%" }}>
          Sell for&nbsp;
          <Money money={moneyGain} />
        </Button>
      </Box>
      <Button onClick={quitInfiltration} sx={{ width: "100%", mt: 1 }}>
        Quit
      </Button>
    </Paper>
  );
}
