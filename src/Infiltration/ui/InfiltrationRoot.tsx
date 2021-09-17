import { IPlayer } from "../../PersonObjects/IPlayer";
import React, { useState } from "react";
import { Intro } from "./Intro";
import { Game } from "./Game";
import { LocationName } from "../../Locations/data/LocationNames";
import { Locations } from "../../Locations/Locations";
import { use } from "../../ui/Context";

interface IProps {
  location: LocationName;
}
function calcDifficulty(player: IPlayer, startingDifficulty: number): number {
  const totalStats = player.strength + player.defense + player.dexterity + player.agility + player.charisma;
  const difficulty = startingDifficulty - Math.pow(totalStats, 0.9) / 250 - player.intelligence / 1600;
  if (difficulty < 0) return 0;
  if (difficulty > 3) return 3;
  return difficulty;
}

export function InfiltrationRoot(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [start, setStart] = useState(false);

  const loc = Locations[props.location];
  if (loc.infiltrationData === undefined) throw new Error("Trying to do infiltration on invalid location.");
  const startingDifficulty = loc.infiltrationData.startingSecurityLevel;
  const difficulty = calcDifficulty(player, startingDifficulty);

  function cancel(): void {
    router.toCity();
  }

  if (!start) {
    return (
      <Intro
        Location={props.location}
        Difficulty={difficulty}
        MaxLevel={loc.infiltrationData.maxClearanceLevel}
        start={() => setStart(true)}
        cancel={cancel}
      />
    );
  }

  return (
    <Game
      StartingDifficulty={startingDifficulty}
      Difficulty={difficulty}
      MaxLevel={loc.infiltrationData.maxClearanceLevel}
    />
  );
}
