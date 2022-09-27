import { Programs } from "./Programs";
import { Program } from "./Program";

import { Player } from "../Player";

//Returns the programs this player can create.
export function getAvailableCreatePrograms(): Program[] {
  const programs: Program[] = [];
  for (const key of Object.keys(Programs)) {
    // Non-creatable program
    const create = Programs[key].create;
    if (create == null) continue;

    // Already has program
    if (Player.hasProgram(Programs[key].name)) continue;

    // Does not meet requirements
    if (!create.req()) continue;

    programs.push(Programs[key]);
  }

  return programs;
}
