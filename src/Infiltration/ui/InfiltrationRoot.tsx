import { IPlayer } from "../../PersonObjects/IPlayer";
import React, { useState } from "react";
import { Intro } from "./Intro";
import { Game } from "./Game";
import { Location } from "../../Locations/Location";
import { Locations } from "../../Locations/Locations";
import { use } from "../../ui/Context";

interface IProps {
  location: Location;
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

  if (props.location.infiltrationData === undefined) throw new Error("Trying to do infiltration on invalid location.");
  const startingDifficulty = props.location.infiltrationData.startingSecurityLevel;
  const difficulty = calcDifficulty(player, startingDifficulty);

  function cancel(): void {
    router.toCity();
  }

  if (!start) {
    return (
      <Intro
        Location={props.location}
        Difficulty={difficulty}
        MaxLevel={props.location.infiltrationData.maxClearanceLevel}
        start={() => setStart(true)}
        cancel={cancel}
      />
    );
  }

  return (
    <Game
      StartingDifficulty={startingDifficulty}
      Difficulty={difficulty}
      MaxLevel={props.location.infiltrationData.maxClearanceLevel}
    />
  );
}
