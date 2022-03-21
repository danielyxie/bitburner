import React, { useState } from "react";

import { Typography, Container, Box, Paper, List, ListItemButton, Button } from "@mui/material";
import { Construction } from "@mui/icons-material";

import { use } from "../../../ui/Context";
import { Money } from "../../../ui/React/Money";
import { Augmentations } from "../../../Augmentation/Augmentations";
import { AugmentationNames } from "../../../Augmentation/data/AugmentationNames";
import { Settings } from "../../../Settings/Settings";
import { IMap } from "../../../types";
import { convertTimeMsToTimeElapsedString, formatNumber } from "../../../utils/StringHelperFunctions";
import { LocationName } from "../../../Locations/data/LocationNames";
import { Locations } from "../../../Locations/Locations";
import { CONSTANTS } from "../../../Constants";

import { IPlayer } from "../../IPlayer";

import { CraftableAugmentation } from "../CraftableAugmentation";

const CraftableAugmentations: IMap<CraftableAugmentation> = {};

const getAvailableAugs = (player: IPlayer): string[] => {
  const augs: string[] = [];

  for (const [augName, aug] of Object.entries(Augmentations)) {
    if (augName === AugmentationNames.NeuroFluxGovernor || augName === AugmentationNames.TheRedPill || aug.isSpecial)
      continue;
    augs.push(augName);
  }

  return augs.filter((augmentation: string) => !player.hasAugmentation(augmentation));
};

export const GraftingRoot = (): React.ReactElement => {
  const player = use.Player();
  const router = use.Router();

  for (const aug of Object.values(Augmentations)) {
    const name = aug.name;
    const craftableAug = new CraftableAugmentation(aug);
    CraftableAugmentations[name] = craftableAug;
  }

  const [selectedAug, setSelectedAug] = useState(getAvailableAugs(player)[0]);

  return (
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Button onClick={() => router.toLocation(Locations[LocationName.NewTokyoVitaLife])}>Back</Button>
      <Typography variant="h4">Grafting Laboratory</Typography>
      <Typography>
        You find yourself in a secret laboratory, owned by a mysterious researcher.
        <br />
        The scientist explains that they've been studying Augmentation grafting, the process of applying Augmentations
        without requiring a body reset.
        <br />
        <br />
        Through legally questionable connections, the scientist has access to a vast array of Augmentation blueprints,
        even private designs. They offer to build and graft the Augmentations to you, in exchange for both a hefty sum
        of money, and being a lab rat.
      </Typography>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5">Craft Augmentations</Typography>
        <Paper sx={{ my: 1, width: "fit-content", display: "grid", gridTemplateColumns: "1fr 3fr" }}>
          <List sx={{ maxHeight: 400, overflowY: "scroll", borderRight: `1px solid ${Settings.theme.welllight}` }}>
            {getAvailableAugs(player).map((k, i) => (
              <ListItemButton key={i + 1} onClick={() => setSelectedAug(k)} selected={selectedAug === k}>
                <Typography>{k}</Typography>
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ m: 1 }}>
            <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
              <Construction sx={{ mr: 1 }} /> {selectedAug}
            </Typography>
            <Button
              onClick={(event) => {
                if (!event.isTrusted) return;
                const craftableAug = CraftableAugmentations[selectedAug];
                player.loseMoney(craftableAug.cost, "augmentations");
                player.startCraftAugmentationWork(selectedAug, craftableAug.time);
                player.startFocusing();
                router.toWork();
              }}
              sx={{ width: "100%" }}
              disabled={player.money < CraftableAugmentations[selectedAug].cost}
            >
              Craft Augmentation (
              <Typography color={Settings.theme.money}>
                <Money money={CraftableAugmentations[selectedAug].cost} player={player} />
              </Typography>
              )
            </Button>
            <Typography color={Settings.theme.info}>
              <b>Time to Craft:</b> {convertTimeMsToTimeElapsedString(CraftableAugmentations[selectedAug].time)}
            </Typography>
            <Typography sx={{ maxHeight: 305, overflowY: "scroll" }}>
              {(() => {
                const aug = Augmentations[selectedAug];

                const info = typeof aug.info === "string" ? <span>{aug.info}</span> : aug.info;
                const tooltip = (
                  <>
                    {info}
                    <br />
                    <br />
                    {aug.stats}
                  </>
                );
                return tooltip;
              })()}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5">Entropy Accumulation</Typography>

        <Paper sx={{ my: 1, p: 1, width: "fit-content" }}>
          <Typography>
            <b>Accumulated Entropy:</b> {player.entropyStacks}
            <br />
            <b>All multipliers decreased by:</b>{" "}
            {formatNumber((1 - CONSTANTS.EntropyEffect ** player.entropyStacks) * 100, 3)}% (multiplicative)
          </Typography>
        </Paper>

        <Typography>
          When installed on an unconscious individual, Augmentations are scanned by the body on awakening, eliminating
          hidden malware. However, grafted Augmentations do not provide this security measure.
          <br />
          <br />
          Individuals who tested Augmentation grafting have reported symptoms of an unknown virus, which they've dubbed
          "Entropy". This virus seems to grow more potent with each grafted Augmentation...
        </Typography>
      </Box>
    </Container>
  );
};
