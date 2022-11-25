import { Box, Button, MenuItem, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
import React, { useState } from "react";
import { FactionNames } from "../../Faction/data/FactionNames";
import { inviteToFaction } from "../../Faction/FactionHelpers";
import { Factions } from "../../Faction/Factions";
import { Router } from "../../ui/GameRoot";
import { Player } from "@player";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { formatNumber } from "../../utils/StringHelperFunctions";
import {
  calculateInfiltratorsRepReward,
  calculateSellInformationCashReward,
  calculateTradeInformationRepReward,
} from "../formulas/victory";

interface IProps {
  StartingDifficulty: number;
  Difficulty: number;
  Reward: number;
  MaxLevel: number;
}

export function Victory(props: IProps): React.ReactElement {
  const [faction, setFaction] = useState("none");

  function quitInfiltration(): void {
    handleInfiltrators();
    Router.toCity();
  }

  const soa = Factions[FactionNames.ShadowsOfAnarchy];
  const repGain = calculateTradeInformationRepReward(props.Reward, props.MaxLevel, props.StartingDifficulty);
  const moneyGain = calculateSellInformationCashReward(props.Reward, props.MaxLevel, props.StartingDifficulty);
  const infiltrationRepGain = calculateInfiltratorsRepReward(soa, props.StartingDifficulty);

  const isMemberOfInfiltrators = Player.factions.includes(FactionNames.ShadowsOfAnarchy);

  function sell(): void {
    handleInfiltrators();
    Player.gainMoney(moneyGain, "infiltration");
    quitInfiltration();
  }

  function trade(): void {
    if (faction === "none") return;
    handleInfiltrators();
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
            {Player.factions
              .filter((f) => Factions[f].getInfo().offersWork())
              .map((f) => (
                <MenuItem key={f} value={f}>
                  {f}
                </MenuItem>
              ))}
          </Select>
          <Button onClick={trade}>
            Trade for&nbsp;
            <Reputation reputation={repGain} />
            &nbsp;reputation
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
