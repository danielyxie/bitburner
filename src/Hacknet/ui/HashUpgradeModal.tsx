/**
 * Create the pop-up for purchasing upgrades with hashes
 */
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import { use } from "../../ui/Context";
import { Hashes } from "../../ui/React/Hashes";
import { Modal } from "../../ui/React/Modal";
import { HashManager } from "../HashManager";
import { HashUpgrades } from "../HashUpgrades";

import { HacknetUpgradeElem } from "./HacknetUpgradeElem";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function HashUpgradeModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(() => setRerender((old) => !old), 200);
    return () => clearInterval(id);
  }, []);

  const hashManager = player.hashManager;
  if (!(hashManager instanceof HashManager)) {
    throw new Error(`Player does not have a HashManager)`);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>Spend your hashes on a variety of different upgrades</Typography>
        <Typography>
          Hashes: <Hashes hashes={player.hashManager.hashes} />
        </Typography>
        {Object.keys(HashUpgrades).map((upgName) => {
          const upg = HashUpgrades[upgName];
          return (
            <HacknetUpgradeElem
              player={player}
              upg={upg}
              hashManager={hashManager}
              key={upg.name}
              rerender={rerender}
            />
          );
        })}
      </>
    </Modal>
  );
}
