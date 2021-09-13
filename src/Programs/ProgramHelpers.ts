import { Programs } from "./Programs";
import { Program } from "./Program";

import { IPlayer } from "../PersonObjects/IPlayer";

//Returns the programs this player can create.
export function getAvailableCreatePrograms(player: IPlayer): Program[] {
  const programs: Program[] = [];
  for (const key in Programs) {
    // Non-creatable program
    const create = Programs[key].create;
    if (create == null) continue;

    // Already has program
    if (player.hasProgram(Programs[key].name)) continue;

    // Does not meet requirements
    if (!create.req(player)) continue;

    programs.push(Programs[key]);
  }

  return programs;
}
