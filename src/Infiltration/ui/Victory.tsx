import { Factions } from "../../Faction/Factions";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { BitNodeMultipliers } from "../../BitNode/BitNodeMultipliers";
import { use } from "../../ui/Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
    router.toCity();
  }

  const levelBonus = props.MaxLevel * Math.pow(1.01, props.MaxLevel);

  const repGain =
    Math.pow(props.Reward + 1, 1.1) *
    Math.pow(props.StartingDifficulty, 1.2) *
    30 *
    levelBonus *
    BitNodeMultipliers.InfiltrationRep;

  const moneyGain =
    Math.pow(props.Reward + 1, 2) *
    Math.pow(props.StartingDifficulty, 3) *
    3e3 *
    levelBonus *
    BitNodeMultipliers.InfiltrationMoney;

  function sell(): void {
    player.gainMoney(moneyGain, "infiltration");
    quitInfiltration();
  }

  function trade(): void {
    if (faction === "none") return;
    Factions[faction].playerReputation += repGain;
    quitInfiltration();
  }

  function changeDropdown(event: SelectChangeEvent<string>): void {
    setFaction(event.target.value);
  }

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={10}>
          <Typography variant="h4">Infiltration successful!</Typography>
        </Grid>
        <Grid item xs={10}>
          <Typography variant="h5" color="primary">
            You can trade the confidential information you found for money or reputation.
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
