import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import { use } from "../../ui/Context";
import { Modal } from "../../ui/React/Modal";
import { EventEmitter } from "../../utils/EventEmitter";
import type { Faction } from "../Faction";
import { joinFaction } from "../FactionHelpers";

export const InvitationEvent = new EventEmitter<[Faction]>();

export function InvitationModal(): React.ReactElement {
  const [faction, setFaction] = useState<Faction | null>(null);
  const player = use.Player();
  function join(): void {
    if (faction === null) return;
    //Remove from invited factions
    const i = player.factionInvitations.findIndex((facName) => facName === faction.name);
    if (i === -1) {
      console.error("Could not find faction in Player.factionInvitations");
    }
    joinFaction(faction);
    setFaction(null);
  }

  useEffect(() => InvitationEvent.subscribe((faction) => setFaction(faction)), []);

  return (
    <Modal open={faction !== null} onClose={() => setFaction(null)}>
      <Typography variant="h4">You have received a faction invitation.</Typography>
      <Typography>
        Would you like to join {(faction || { name: "" }).name}? <br />
        <br />
        Warning: Joining this faction may prevent you from joining other factions during this run!
      </Typography>
      <Button onClick={join}>Join!</Button>
      <Button onClick={() => setFaction(null)}>Decide later</Button>
    </Modal>
  );
}
