import { Page, routing } from ".././ui/navigationTracking";
import { Root } from "./ui/Root";
import { IPlayer } from "../PersonObjects/IPlayer";
import { IEngine } from "../IEngine";
import * as React from "react";
import * as ReactDOM from "react-dom";

let container: HTMLElement = document.createElement("div");

(function () {
  function setContainer(): void {
    const c = document.getElementById("infiltration-container");
    if (c === null) throw new Error("huh?");
    container = c;
    document.removeEventListener("DOMContentLoaded", setContainer);
  }

  document.addEventListener("DOMContentLoaded", setContainer);
})();

function calcDifficulty(player: IPlayer, startingDifficulty: number): number {
  const totalStats =
    player.strength +
    player.defense +
    player.dexterity +
    player.agility +
    player.charisma;
  const difficulty =
    startingDifficulty -
    Math.pow(totalStats, 0.9) / 250 -
    player.intelligence / 1600;
  if (difficulty < 0) return 0;
  if (difficulty > 3) return 3;
  return difficulty;
}

export function displayInfiltrationContent(
  engine: IEngine,
  player: IPlayer,
  location: string,
  startingDifficulty: number,
  maxLevel: number,
): void {
  if (!routing.isOn(Page.Infiltration)) return;

  const difficulty = calcDifficulty(player, startingDifficulty);

  ReactDOM.render(
    <Root
      Engine={engine}
      Player={player}
      Location={location}
      StartingDifficulty={startingDifficulty}
      Difficulty={difficulty}
      MaxLevel={maxLevel}
    />,
    container,
  );
}
