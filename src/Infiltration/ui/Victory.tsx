import { Factions } from "../../Faction/Factions";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { use } from "../../ui/Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FactionNames } from "../../Faction/data/FactionNames";
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
  const player = use.Player();
  const router = use.Router();
  const [faction, setFaction] = useState("none");

  function quitInfiltration(): void {
    handleInfiltrators();
    router.toCity();
  }

  const repGain = calculateTradeInformationRepReward(player, props.Reward, props.MaxLevel, props.StartingDifficulty);
  const moneyGain = calculateSellInformationCashReward(player, props.Reward, props.MaxLevel, props.StartingDifficulty);
  const infiltrationRepGain = calculateInfiltratorsRepReward(player, props.StartingDifficulty);

  const infiltratorFaction = Factions[FactionNames.Infiltrators];
  const isMemberOfInfiltrators = infiltratorFaction && infiltratorFaction.isMember;

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
    player.hasCompletedAnInfiltration = true;
    if (isMemberOfInfiltrators) {
      infiltratorFaction.playerReputation += infiltrationRepGain;
    }
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Typography variant="h4">Infiltration successful!</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h5" color="primary">
            You{" "}
            {isMemberOfInfiltrators ? (
              <>
                have gained {formatNumber(infiltrationRepGain, 2)} rep for {FactionNames.Infiltrators} and{" "}
              </>
            ) : (
              <></>
            )}
            can trade the confidential information you found for money or reputation.
          </Typography>
          <Select value={faction} onChange={changeDropdown}>
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
        </Grid>
        <Grid item xs={3}>
          <Button onClick={sell}>
            Sell for&nbsp;
            <Money money={moneyGain} />
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button onClick={quitInfiltration}>Quit</Button>
        </Grid>
      </Grid>
    </>
  );
}
