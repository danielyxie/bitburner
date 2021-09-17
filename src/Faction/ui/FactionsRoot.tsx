import React, { useState } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { Factions } from "../Factions";
import { Faction } from "../Faction";
import { joinFaction } from "../FactionHelpers";

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function FactionsRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];

  function openFaction(faction: Faction): void {
    props.router.toFaction(faction);
  }

  function acceptInvitation(event: React.MouseEvent<HTMLElement>, faction: string): void {
    if (!event.isTrusted) return;
    joinFaction(Factions[faction]);
    setRerender((x) => !x);
  }

  return (
    <>
      <h1>Factions</h1>
      <p>Lists all factions you have joined</p>
      <br />
      <ul>
        {props.player.factions.map((faction: string) => (
          <li key={faction}>
            <a
              className="a-link-button"
              onClick={() => openFaction(Factions[faction])}
              style={{ padding: "4px", margin: "4px", display: "inline-block" }}
            >
              {faction}
            </a>
          </li>
        ))}
      </ul>
      <br />
      <h1>Outstanding Faction Invitations</h1>
      <p style={{ width: "70%" }}>
        Lists factions you have been invited to. You can accept these faction invitations at any time.
      </p>
      <ul>
        {props.player.factionInvitations.map((faction: string) => (
          <li key={faction} style={{ padding: "6px", margin: "6px" }}>
            <p style={{ display: "inline", margin: "4px", padding: "4px" }}>{faction}</p>
            <a
              className="a-link-button"
              onClick={(e) => acceptInvitation(e, faction)}
              style={{ display: "inline", margin: "4px", padding: "4px" }}
            >
              Accept Faction Invitation
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
