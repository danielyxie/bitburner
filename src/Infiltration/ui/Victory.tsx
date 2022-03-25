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
import { FactionNames } from "../../Faction/data/FactionNames";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { LocationsMetadata } from "../../Locations/data/LocationsMetadata";
import { formatNumber } from "../../utils/StringHelperFunctions";

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

  const levelBonus = props.MaxLevel * Math.pow(1.01, props.MaxLevel);

  const repGain =
    Math.pow(props.Reward + 1, 1.1) *
    Math.pow(props.StartingDifficulty, 1.2) *
    30 *
    levelBonus *
    BitNodeMultipliers.InfiltrationRep;

  const infiltratorFaction = Factions[FactionNames.Infiltrators];
  const isMemberOfInfiltrators = infiltratorFaction && infiltratorFaction.isMember;

  const moneyGain =
    Math.pow(props.Reward + 1, 2) *
    Math.pow(props.StartingDifficulty, 3) *
    3e3 *
    levelBonus *
    BitNodeMultipliers.InfiltrationMoney;

  function calculateInfiltratorsRepReward(): number {
    const bionicFingersRepGain = player.hasAugmentation(AugmentationNames.BionicFingers, true) ? 5 : 0;
    const CorporationManagementImplantRepMultiplier = player.hasAugmentation(
      AugmentationNames.CorporationManagementImplant,
      true,
    )
      ? 2.5
      : 1;
    const maxStartingSecurityLevel = LocationsMetadata.reduce((acc, data): number => {
      const startingSecurityLevel = data.infiltrationData?.startingSecurityLevel || 0;
      return acc > startingSecurityLevel ? acc : startingSecurityLevel;
    }, 0);
    const baseRepGain = (props.StartingDifficulty / maxStartingSecurityLevel) * 10;

    return (baseRepGain + bionicFingersRepGain) * CorporationManagementImplantRepMultiplier;
  }

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
      infiltratorFaction.playerReputation += calculateInfiltratorsRepReward();
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
                have gained {formatNumber(calculateInfiltratorsRepReward(), 2)} rep for {FactionNames.Infiltrators} and{" "}
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
