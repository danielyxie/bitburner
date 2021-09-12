import React from "react";
import { joinFaction } from "../../Faction/FactionHelpers";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  player: IPlayer;
  faction: Faction;
  popupId: string;
}

export function InvitationPopup(props: IProps): React.ReactElement {
  function join(): void {
    //Remove from invited factions
    const i = props.player.factionInvitations.findIndex((facName) => facName === props.faction.name);
    if (i === -1) {
      console.error("Could not find faction in Player.factionInvitations");
    }
    joinFaction(props.faction);
    removePopup(props.popupId);
  }

  return (
    <>
      <h1>You have received a faction invitation.</h1>
      <p>
        Would you like to join {props.faction.name}? <br />
        <br />
        Warning: Joining this faction may prevent you from joining other factions during this run!
      </p>
      <button className="std-button" onClick={join}>
        Join!
      </button>
      <button className="std-button" onClick={() => removePopup(props.popupId)}>
        Decide later
      </button>
    </>
  );
}
