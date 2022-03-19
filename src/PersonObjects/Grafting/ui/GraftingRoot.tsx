import React, { useState } from "react";

import {
  Typography,
  Container,
  Box,
  Paper,
  List,
  ListItemButton,
  Button
} from "@mui/material";
import {
  Construction
} from "@mui/icons-material";

import { use } from "../../../ui/Context";
import { Money } from "../../../ui/React/Money";
import { Augmentations } from "../../../Augmentation/Augmentations";
import { AugmentationNames } from "../../../Augmentation/data/AugmentationNames"
import { Settings } from "../../../Settings/Settings";
import { IMap } from "../../../types";
import { convertTimeMsToTimeElapsedString } from "../../../utils/StringHelperFunctions";

import { IPlayer } from "../../IPlayer";

import { CraftableAugmentation } from "../CraftableAugmentation";

const CraftableAugmentations: IMap<CraftableAugmentation> = {}

const getAvailableAugs = (player: IPlayer): string[] => {
  const augs: string[] = [];

  for (const [augName, aug] of Object.entries(Augmentations)) {
    if (
      augName === AugmentationNames.NeuroFluxGovernor ||
      augName === AugmentationNames.TheRedPill ||
      aug.isSpecial
    ) continue;
    augs.push(augName);
  }

  return augs.filter(
    (augmentation: string) => !player.hasAugmentation(augmentation)
  );
}

export const GraftingRoot = (): React.ReactElement => {
  const player = use.Player();
  const router = use.Router();

  for (const aug of Object.values(Augmentations)) {
    const name = aug.name;
    const craftableAug = new CraftableAugmentation(aug);
    CraftableAugmentations[name] = craftableAug;
  }

  const [selectedAug, setSelectedAug] = useState(getAvailableAugs(player)[0]);

  return <>
    <Container disableGutters maxWidth="lg" sx={{ mx: 0 }}>
      <Typography variant="h4">Grafting Laboratory</Typography>
      <Typography>
        blah blah blah exposition that isn't important right now <br />
        Lorem ipsum dolor sit amet et et sed et et sanctus duo vero.
        Stet amet iriure consetetur elit in magna et diam dolores invidunt ipsum gubergren nihil.
        Diam et et ipsum consectetuer voluptua et clita lorem sit.
        Et et lorem id no suscipit wisi.
        Illum velit takimata et aliquyam takimata labore vel dolor dolores duo amet lorem elitr facer invidunt.
      </Typography>

      <Box sx={{ my: 5 }}>
        <Typography variant="h5">Craft Augmentations</Typography>
        <Typography>
          here goes a list with available augmentations with a purchase button (with price shown) to the side of it <br />
          getAvailableAugs function to the rescue
        </Typography>
        <Paper sx={{ my: 1, width: 'fit-content', display: 'grid', gridTemplateColumns: '1fr 3fr' }}>
          <List sx={{ maxHeight: 400, overflowY: 'scroll', borderRight: `1px solid ${Settings.theme.welllight}` }}>
            {getAvailableAugs(player).map((k, i) => (
              <ListItemButton key={i + 1} onClick={() => setSelectedAug(k)} selected={selectedAug === k}>
                <Typography>
                  {k}
                </Typography>
              </ListItemButton>
            ))}
          </List>
          <Box sx={{ m: 1 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
              <Construction sx={{ mr: 1 }} /> {selectedAug}
            </Typography>
            <Button
              onClick={event => {
                if (!event.isTrusted) return;
                const craftableAug = CraftableAugmentations[selectedAug];
                player.loseMoney(craftableAug.cost, "augmentations");
                player.startCraftAugmentationWork(selectedAug, craftableAug.time);
                player.startFocusing();
                router.toWork();
              }}
              sx={{ width: '100%' }}
              disabled={player.money < CraftableAugmentations[selectedAug].cost}
            >
              Craft Augmentation (
              <Typography color={Settings.theme.money}>
                <Money money={CraftableAugmentations[selectedAug].cost} player={player} />
              </Typography>)
            </Button>
            <Typography color={Settings.theme.info}>
              <b>Time to Craft:</b> {convertTimeMsToTimeElapsedString(CraftableAugmentations[selectedAug].time)}
            </Typography>
            <Typography sx={{ maxHeight: 305, overflowY: 'scroll' }}>
              {(() => {
                const aug = Augmentations[selectedAug];

                const info = typeof aug.info === "string" ? <span>{aug.info}</span> : aug.info
                const tooltip = (<>{info}<br /><br />{aug.stats}</>);
                return tooltip;
              })()}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ my: 5 }}>
        <Typography variant="h5">name tbd</Typography>
        <Typography>
          probably some info about the cumulative negative effects here
        </Typography>
      </Box>
    </Container>
  </>
}
