/**
 * React Component for displaying a list of the player's Source-Files
 * on the Augmentations UI
 */
import * as React from "react";

import { Player } from "../../Player";
import { Exploit, ExploitName } from "../../Exploits/Exploit";

import { Accordion } from "../../ui/React/Accordion";

export function SourceFileMinus1(): React.ReactElement {
  const exploits = Player.exploits;

  if (exploits.length === 0) {
    return <></>;
  }

  return (
    <li key={-1}>
      <Accordion
        headerContent={
          <>
            Source-File -1: Exploits in the BitNodes
            <br />
            Level {exploits.length} / ?
          </>
        }
        panelContent={
          <>
            <p>
              This Source-File can only be acquired with obscure knowledge of the game, javascript, and the web
              ecosystem.
            </p>
            <p>It increases all of the player's multipliers by 0.1%</p>
            <br />

            <p>You have found the following exploits:</p>
            <ul>
              {exploits.map((c: Exploit) => (
                <li key={c}>* {ExploitName(c)}</li>
              ))}
            </ul>
          </>
        }
      />
    </li>
  );
}
