import { IPlayer } from "../../PersonObjects/IPlayer";
import React, { useState } from "react";
import { Intro } from "./Intro";
import { Game } from "./Game";
import { Location } from "../../Locations/Location";
import { use } from "../../ui/Context";
import { calculateSkill } from "../../PersonObjects/formulas/skill";

interface IProps {
  location: Location;
}

function calcRawDiff(player: IPlayer, stats: number, startingDifficulty: number): number {
  const difficulty = startingDifficulty - Math.pow(stats, 0.9) / 250 - player.intelligence / 1600;
  if (difficulty < 0) return 0;
  if (difficulty > 3) return 3;
  return difficulty;
}

function calcDifficulty(player: IPlayer, startingDifficulty: number): number {
  const totalStats = player.strength + player.defense + player.dexterity + player.agility + player.charisma;
  return calcRawDiff(player, totalStats, startingDifficulty);
}

function calcReward(player: IPlayer, startingDifficulty: number): number {
  const xpMult = 10 * 60 * 15;
  const total =
    calculateSkill(player.strength_exp_mult * xpMult, player.strength_mult) +
    calculateSkill(player.defense_exp_mult * xpMult, player.defense_mult) +
    calculateSkill(player.agility_exp_mult * xpMult, player.agility_mult) +
    calculateSkill(player.dexterity_exp_mult * xpMult, player.dexterity_mult) +
    calculateSkill(player.charisma_exp_mult * xpMult, player.charisma_mult);
  return calcRawDiff(player, total, startingDifficulty);
}

export function InfiltrationRoot(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const [start, setStart] = useState(false);

  if (props.location.infiltrationData === undefined) throw new Error("Trying to do infiltration on invalid location.");
  const startingDifficulty = props.location.infiltrationData.startingSecurityLevel;
  const difficulty = calcDifficulty(player, startingDifficulty);
  const reward = calcReward(player, startingDifficulty);
  console.log(`${difficulty} ${reward}`);

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
      Reward={reward}
      MaxLevel={props.location.infiltrationData.maxClearanceLevel}
    />
  );
}
