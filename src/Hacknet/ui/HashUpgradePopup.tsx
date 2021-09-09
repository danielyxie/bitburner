/**
 * Create the pop-up for purchasing upgrades with hashes
 */
import React, { useState, useEffect } from "react";

import { HashManager } from "../HashManager";
import { HashUpgrades } from "../HashUpgrades";

import { IPlayer } from "../../PersonObjects/IPlayer";

import { Hashes } from "../../ui/React/Hashes";
import { HacknetUpgradeElem } from "./HacknetUpgradeElem";

interface IProps {
  player: IPlayer;
}

export function HashUpgradePopup(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 1000);
    return () => clearInterval(id);
  }, []);

  const hashManager = props.player.hashManager;
  if (!(hashManager instanceof HashManager)) {
    throw new Error(`Player does not have a HashManager)`);
  }

  const upgradeElems = Object.keys(HashUpgrades).map((upgName) => {
    const upg = HashUpgrades[upgName];
    return (
      <HacknetUpgradeElem
        player={props.player}
        upg={upg}
        hashManager={hashManager}
        key={upg.name}
        rerender={rerender}
      />
    );
  });

  return (
    <div>
      <p>Spend your hashes on a variety of different upgrades</p>
      <p>Hashes: {Hashes(props.player.hashManager.hashes)}</p>
      {upgradeElems}
    </div>
  );
}
