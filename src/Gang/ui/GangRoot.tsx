/**
 * React Component for all the gang stuff.
 */
import React, { useState, useEffect } from "react";
import { ManagementSubpage } from "./ManagementSubpage";
import { TerritorySubpage } from "./TerritorySubpage";
import { use } from "../../ui/Context";
import { Factions } from "../../Faction/Factions";
import { Gang } from "../Gang";

export function GangRoot(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const gang = (function () {
    if (player.gang === null) throw new Error("Gang should not be null");
    return player.gang;
  })();
  const [management, setManagement] = useState(true);
  const setRerender = useState(false)[1];

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => clearInterval(id);
  }, []);

  function back(): void {
    router.toFaction(Factions[gang.facName]);
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
      {management ? <ManagementSubpage gang={gang} player={player} /> : <TerritorySubpage gang={gang} />}
    </div>
  );
}
