import { Programs } from "./Programs";

import { Player } from "../Player";
import { createElement } from "../../utils/uiHelpers/createElement";

//Returns the number of programs that are currently available to be created
function getNumAvailableCreateProgram() {
  var count = 0;
  for (const key in Programs) {
    // Non-creatable program
    if (Programs[key].create == null) {
      continue;
    }

    // Already has program
    if (Player.hasProgram(Programs[key].name)) {
      continue;
    }

    // Does not meet requirements
    if (!Programs[key].create.req(Player)) {
      continue;
    }

    count++;
  }

  if (Player.firstProgramAvailable === false && count > 0) {
    Player.firstProgramAvailable = true;
    document.getElementById("hacking-menu-header").click();
    document.getElementById("hacking-menu-header").click();
  }
  return count;
}

export { getNumAvailableCreateProgram };
