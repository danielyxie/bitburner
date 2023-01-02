/**
 * Root React component for the Augmentations UI page that display all of your
 * owned and purchased Augmentations and Source-Files.
 */
import React, { useState, useEffect } from "react";

import { InstalledAugmentations } from "./InstalledAugmentations";
import { PlayerMultipliers } from "./PlayerMultipliers";
import { PurchasedAugmentations } from "./PurchasedAugmentations";
import { SourceFilesElement } from "./SourceFiles";

import { canGetBonus } from "../../ExportBonus";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import { Settings } from "../../Settings/Settings";
import { ConfirmationModal } from "../../ui/React/ConfirmationModal";
import { Player } from "@player";
import { AugmentationNames } from "../data/AugmentationNames";
import { StaticAugmentations } from "../StaticAugmentations";
import { CONSTANTS } from "../../Constants";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { Info } from "@mui/icons-material";
import { Link } from "@mui/material";
import { AlertEvents } from "../../ui/React/AlertManager";

const NeuroFluxDisplay = (): React.ReactElement => {
  const level = Player.augmentations.find((e) => e.name === AugmentationNames.NeuroFluxGovernor)?.level ?? 0;

  const openBloodDonation = () => {
    AlertEvents.emit(
      <>
        <Typography variant="h5">Bitburner blood donation community program</Typography>
        <Typography>
          The blood donation program is a continuous real life event started on 2022-04-01. To participate simply go
          donate blood, plasma, or platelets to your local organization and take a picture as proof (hide your personal
          information). Then send the proof to hydroflame on reddit or discord.
        </Typography>
        <Typography>Currently accumulated {CONSTANTS.Donations} donations.</Typography>
      </>,
    );
  };
  return level > 0 ? (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h5" color={Settings.theme.info}>
        NeuroFlux Governor - Level {level}
      </Typography>
      <Typography color={Settings.theme.info}>
        {StaticAugmentations[AugmentationNames.NeuroFluxGovernor].stats}
      </Typography>
      <Typography color={Settings.theme.info}>
        The power of {AugmentationNames.NeuroFluxGovernor} increases with blood donations from players in real life.
        Learn more <Link onClick={openBloodDonation}>here</Link>
      </Typography>
    </Paper>
  ) : (
    <></>
  );
};

const EntropyDisplay = (): React.ReactElement => {
  return Player.entropy > 0 ? (
    <Paper sx={{ p: 1 }}>
      <Typography variant="h5" color={Settings.theme.error}>
        Entropy Virus - Level {Player.entropy}
      </Typography>
      <Typography color={Settings.theme.error}>
        <b>All multipliers decreased by:</b> {formatNumber((1 - CONSTANTS.EntropyEffect ** Player.entropy) * 100, 3)}%
        (multiplicative)
      </Typography>
    </Paper>
  ) : (
    <></>
  );
};

interface IProps {
  exportGameFn: () => void;
  installAugmentationsFn: () => void;
}

export function AugmentationsRoot(props: IProps): React.ReactElement {
  const [installOpen, setInstallOpen] = useState(false);
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
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Typography variant="h4">Augmentations</Typography>
      <Box sx={{ mb: 1 }}>
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5" color="primary" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            Purchased Augmentations
            <Tooltip
              title={
                <>
                  <Typography>
                    Below is a list of all Augmentations you have purchased but not yet installed. Click the button
                    below to install them.
                  </Typography>
                  <Typography>
                    WARNING: Installing your Augmentations resets most of your progress, including:
                  </Typography>
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
                    Installing Augmentations lets you start over with the perks and benefits granted by all of the
                    Augmentations you have ever installed. Also, you will keep any scripts and RAM/Core upgrades on your
                    home computer (but you will lose all programs besides NUKE.exe)
                  </Typography>
                </>
              }
            >
              <Info sx={{ ml: 1, mb: 0.5 }} color="info" />
            </Tooltip>
          </Typography>
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
                It is recommended to install several Augmentations at once. Preferably everything from any faction of
                your choosing.
              </>
            }
          />
          <Box sx={{ display: "grid", width: "100%", gridTemplateColumns: "1fr 1fr" }}>
            <Tooltip title={<Typography>'I never asked for this'</Typography>}>
              <span>
                <Button sx={{ width: "100%" }} disabled={Player.queuedAugmentations.length === 0} onClick={doInstall}>
                  Install Augmentations
                </Button>
              </span>
            </Tooltip>
            <Tooltip title={<Typography>It's always a good idea to backup/export your save!</Typography>}>
              <Button sx={{ width: "100%", color: Settings.theme.successlight }} onClick={doExport}>
                Backup Save {exportBonusStr()}
              </Button>
            </Tooltip>
          </Box>
        </Paper>
        {Player.queuedAugmentations.length > 0 ? (
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 3fr" }}>
            <PurchasedAugmentations />
            <PlayerMultipliers />
          </Box>
        ) : (
          <Paper sx={{ p: 1 }}>
            <Typography>No Augmentations have been purchased yet</Typography>
          </Paper>
        )}
      </Box>

      <Box
        sx={{
          my: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${
            +!!((Player.augmentations.find((e) => e.name === AugmentationNames.NeuroFluxGovernor)?.level ?? 0) > 0) +
            +!!(Player.entropy > 0)
          }, 1fr)`,
          gap: 1,
        }}
      >
        <NeuroFluxDisplay />
        <EntropyDisplay />
      </Box>

      <Box>
        <InstalledAugmentations />
      </Box>
      <SourceFilesElement />
    </Container>
  );
}
