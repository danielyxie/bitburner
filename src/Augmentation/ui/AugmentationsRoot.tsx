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

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { Settings } from "../../Settings/Settings";
import { ConfirmationModal } from "../../ui/React/ConfirmationModal";

interface IProps {
  exportGameFn: () => void;
  installAugmentationsFn: () => void;
}

export function AugmentationsRoot(props: IProps): React.ReactElement {
  const [installOpen, setInstallOpen] = useState(false);
  const player = use.Player();
  const setRerender = useState(false)[1];
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

  function doInstall(): void {
    if (!Settings.SuppressBuyAugmentationConfirmation) {
      setInstallOpen(true);
    } else {
      props.installAugmentationsFn();
    }
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
          <span>
            <Button disabled={player.queuedAugmentations.length === 0} onClick={doInstall}>
              Install Augmentations
            </Button>
          </span>
        </Tooltip>
        <ConfirmationModal
          open={installOpen}
          onClose={() => setInstallOpen(false)}
          onConfirm={props.installAugmentationsFn}
          confirmationText={
            <>
              Installing will reset
              <br />
              <br />- money
              <br />- skill / experience
              <br />- every server except home
              <br />- factions and reputation
              <br />
              <br />
              You will keep:
              <br />
              <br />- All scripts on home
              <br />- home ram and cores
              <br />
              <br />
              It is recommended to install several Augmentations at once. Preferably everything from any faction of your
              choosing.
            </>
          }
        />
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
