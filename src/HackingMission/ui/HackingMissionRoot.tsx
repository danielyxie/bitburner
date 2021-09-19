import React, { useEffect } from "react";

import { startHackingMission } from "../../Faction/FactionHelpers";
import { Faction } from "../../Faction/Faction";

interface IProps {
  faction: Faction;
}

export function HackingMissionRoot(props: IProps): React.ReactElement {
  useEffect(() => startHackingMission(props.faction));
  return <div id="mission-container"></div>;
}
