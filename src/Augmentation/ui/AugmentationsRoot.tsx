/**
 * Root React component for the Augmentations UI page that display all of your
 * owned and purchased Augmentations and Source-Files.
 */
import React, { useState, useEffect } from "react";

import { InstalledAugmentations } from "./InstalledAugmentations";
import { PlayerMultipliers } from "./PlayerMultipliers";
import { PurchasedAugmentations } from "./PurchasedAugmentations";
import { SourceFiles } from "./SourceFiles";

import { canGetBonus } from "../../ExportBonus";
import { use } from "../../ui/Context";
import { Modal } from "../../ui/React/Modal";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";

interface IProps {
  exportGameFn: () => void;
  installAugmentationsFn: () => void;
}

export function AugmentationsRoot(props: IProps): React.ReactElement {
  const player = use.Player();
  const setRerender = useState(false)[1];
  const [isInstallationOpen, setInstallationOpen] = useState(false);
  function rerender(): void {
    setRerender((o) => !o);
  }
  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  function doExport(): void {
    props.exportGameFn();
    rerender();
  }

  function exportBonusStr(): string {
    if (canGetBonus()) return "(+1 favor to all factions)";
    return "";
  }

  return (
    <>
      <Typography variant="h4">Augmentations</Typography>
      <Box mx={2}>
        <Typography>
          Below is a list of all Augmentations you have purchased but not yet installed. Click the button below to
          install them.
        </Typography>
        <Typography>WARNING: Installing your Augmentations resets most of your progress, including:</Typography>
        <br />
        <Typography>- Stats/Skill levels and Experience</Typography>
        <Typography>- Money</Typography>
        <Typography>- Scripts on every computer but your home computer</Typography>
        <Typography>- Purchased servers</Typography>
        <Typography>- Hacknet Nodes</Typography>
        <Typography>- Faction/Company reputation</Typography>
        <Typography>- Stocks</Typography>
        <br />
        <Typography>
          Installing Augmentations lets you start over with the perks and benefits granted by all of the Augmentations
          you have ever installed. Also, you will keep any scripts and RAM/Core upgrades on your home computer (but you
          will lose all programs besides NUKE.exe)
        </Typography>
      </Box>
      <Typography variant="h4" color="primary">
        Purchased Augmentations
      </Typography>
      <Box mx={2}>
        <Tooltip title={<Typography>'I never asked for this'</Typography>}>
          <>
            <Button disabled={player.queuedAugmentations.length === 0} onClick={() => setInstallationOpen(true)}>
              Install Augmentations
            </Button>
            <Modal open={isInstallationOpen} onClose={() => setInstallationOpen(false)}>
              <Typography>
                WARNING: THIS WILL PARTIALLY RESET YOUR PROGRESS
                <br />
                <br />
                For your first installation, it is recommended to purchase most of the CSEC augmentations.
                <br />
                If you are unsure, you should EXPORT your save game as a backup before!
                <br />
                <br />
                <Typography variant="subtitle2"><em>This is the first prestige mechanism.</em></Typography>
              </Typography>
              <br />

              <ButtonGroup>
                <Button onClick={() => setInstallationOpen(false)}>
                  No, Cancel Installation
                </Button>
                <Button color="error" disabled={player.queuedAugmentations.length === 0} onClick={props.installAugmentationsFn}>
                  Yes, Install Augmentations
                </Button>
              </ButtonGroup>
            </Modal>
          </>
        </Tooltip>
        <Tooltip title={<Typography>It's always a good idea to backup/export your save!</Typography>}>
          <Button sx={{ mx: 2 }} onClick={doExport} color="error">
            Backup Save {exportBonusStr()}
          </Button>
        </Tooltip>
        <PurchasedAugmentations />
      </Box>
      <Typography variant="h4">Installed Augmentations</Typography>
      <Box mx={2}>
        <Typography>
          List of all Augmentations that have been installed. You have gained the effects of these.
        </Typography>
        <InstalledAugmentations />
      </Box>
      <PlayerMultipliers />
      <SourceFiles />
    </>
  );
}
