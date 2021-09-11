/**
 * React Component for all the gang stuff.
 */
import React, { useState, useEffect } from "react";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { ManagementSubpage } from "./ManagementSubpage";
import { TerritorySubpage } from "./TerritorySubpage";
import { IEngine } from "../../IEngine";
import { Gang } from "../Gang";
import { displayFactionContent } from "../../Faction/FactionHelpers";

interface IProps {
  gang: Gang;
  player: IPlayer;
  engine: IEngine;
}

export function Root(props: IProps): React.ReactElement {
  const [management, setManagement] = useState(true);
  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => clearInterval(id);
  }, []);

  function back(): void {
    props.engine.loadFactionContent();
    displayFactionContent(props.gang.facName);
  }

  return (
    <div className="gang-container">
      <a className="a-link-button" style={{ display: "inline-block" }} onClick={back}>
        Back
      </a>
      <a
        className={management ? "a-link-button-inactive" : "a-link-button"}
        style={{ display: "inline-block" }}
        onClick={() => setManagement(true)}
      >
        Gang Management
      </a>
      <a
        className={!management ? "a-link-button-inactive" : "a-link-button"}
        style={{ display: "inline-block" }}
        onClick={() => setManagement(false)}
      >
        Gang Territory
      </a>
      {management ? (
        <ManagementSubpage gang={props.gang} player={props.player} />
      ) : (
        <TerritorySubpage gang={props.gang} />
      )}
    </div>
  );
}
