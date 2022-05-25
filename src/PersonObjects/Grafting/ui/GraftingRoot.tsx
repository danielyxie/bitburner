import { CheckBox, CheckBoxOutlineBlank, Construction } from "@mui/icons-material";
import { Box, Button, Container, List, ListItemButton, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Augmentation } from "../../../Augmentation/Augmentation";
import { AugmentationNames } from "../../../Augmentation/data/AugmentationNames";
import { StaticAugmentations } from "../../../Augmentation/StaticAugmentations";
import { CONSTANTS } from "../../../Constants";
import { hasAugmentationPrereqs } from "../../../Faction/FactionHelpers";
import { LocationName } from "../../../Locations/data/LocationNames";
import { Locations } from "../../../Locations/Locations";
import { PurchaseAugmentationsOrderSetting } from "../../../Settings/SettingEnums";
import { Settings } from "../../../Settings/Settings";
import { IMap } from "../../../types";
import { use } from "../../../ui/Context";
import { ConfirmationModal } from "../../../ui/React/ConfirmationModal";
import { Money } from "../../../ui/React/Money";
import { convertTimeMsToTimeElapsedString, formatNumber } from "../../../utils/StringHelperFunctions";
import { IPlayer } from "../../IPlayer";
import { GraftableAugmentation } from "../GraftableAugmentation";
import { calculateGraftingTimeWithBonus, getGraftingAvailableAugs } from "../GraftingHelpers";

const GraftableAugmentations: IMap<GraftableAugmentation> = {};

const canGraft = (player: IPlayer, aug: GraftableAugmentation): boolean => {
  if (player.money < aug.cost) {
    return false;
  }
  return hasAugmentationPrereqs(aug.augmentation);
};

interface IProps {
  player: IPlayer;
  aug: Augmentation;
}

const AugPreReqsChecklist = (props: IProps): React.ReactElement => {
  const aug = props.aug,
    player = props.player;

  return (
    <Typography color={Settings.theme.money}>
      <b>Pre-Requisites:</b>
      <br />
      {aug.prereqs.map((preAug) => (
        <span style={{ display: "flex", alignItems: "center" }}>
          {player.hasAugmentation(preAug) ? <CheckBox sx={{ mr: 1 }} /> : <CheckBoxOutlineBlank sx={{ mr: 1 }} />}
          {preAug}
        </span>
      ))}
    </Typography>
  );
};

export const GraftingRoot = (): React.ReactElement => {
  const player = use.Player();
  const router = use.Router();

  for (const aug of Object.values(StaticAugmentations)) {
    const name = aug.name;
    const graftableAug = new GraftableAugmentation(aug);
    GraftableAugmentations[name] = graftableAug;
  }

  const [selectedAug, setSelectedAug] = useState(getGraftingAvailableAugs(player)[0]);
  const [graftOpen, setGraftOpen] = useState(false);
  const selectedAugmentation = StaticAugmentations[selectedAug];

  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  const getAugsSorted = (): string[] => {
    const augs = getGraftingAvailableAugs(player);
    switch (Settings.PurchaseAugmentationsOrder) {
      case PurchaseAugmentationsOrderSetting.Cost:
        return augs.sort((a, b) => GraftableAugmentations[a].cost - GraftableAugmentations[b].cost);
      default:
        return augs;
    }
  };

  const switchSortOrder = (newOrder: PurchaseAugmentationsOrderSetting): void => {
    Settings.PurchaseAugmentationsOrder = newOrder;
    rerender();
  };

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

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
        <Paper sx={{ p: 1 }}>
          <Typography variant="h5">Graft Augmentations</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Button sx={{ width: "100%" }} onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Cost)}>
              Sort by Cost
            </Button>
            <Button sx={{ width: "100%" }} onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Default)}>
              Sort by Default Order
            </Button>
          </Box>
        </Paper>
        {getGraftingAvailableAugs(player).length > 0 ? (
          <Paper sx={{ mb: 1, width: "fit-content", display: "grid", gridTemplateColumns: "1fr 3fr" }}>
            <List sx={{ height: 400, overflowY: "scroll", borderRight: `1px solid ${Settings.theme.welllight}` }}>
              {getAugsSorted().map((k, i) => (
                <ListItemButton key={i + 1} onClick={() => setSelectedAug(k)} selected={selectedAug === k}>
                  <Typography
                    sx={{
                      color: canGraft(player, GraftableAugmentations[k])
                        ? Settings.theme.primary
                        : Settings.theme.disabled,
                    }}
                  >
                    {k}
                  </Typography>
                </ListItemButton>
              ))}
            </List>
            <Box sx={{ m: 1 }}>
              <Typography variant="h6" sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
                <Construction sx={{ mr: 1 }} /> {selectedAug}
              </Typography>
              <Button
                onClick={() => setGraftOpen(true)}
                sx={{ width: "100%" }}
                disabled={!canGraft(player, GraftableAugmentations[selectedAug])}
              >
                Graft Augmentation (
                <Typography>
                  <Money money={GraftableAugmentations[selectedAug].cost} player={player} />
                </Typography>
                )
              </Button>
              <ConfirmationModal
                open={graftOpen}
                onClose={() => setGraftOpen(false)}
                onConfirm={() => {
                  const graftableAug = GraftableAugmentations[selectedAug];
                  player.loseMoney(graftableAug.cost, "augmentations");
                  player.startGraftAugmentationWork(selectedAug, graftableAug.time);
                  player.startFocusing();
                  router.toWork();
                }}
                confirmationText={
                  <>
                    Cancelling grafting will <b>not</b> save grafting progress, and the money you spend will <b>not</b>{" "}
                    be returned.
                    {!player.hasAugmentation(AugmentationNames.CongruityImplant) && (
                      <>
                        <br />
                        <br />
                        Additionally, grafting an Augmentation will increase the potency of the Entropy virus.
                      </>
                    )}
                  </>
                }
              />
              <Box sx={{ maxHeight: 330, overflowY: "scroll" }}>
                <Typography color={Settings.theme.info}>
                  <b>Time to Graft:</b>{" "}
                  {convertTimeMsToTimeElapsedString(
                    calculateGraftingTimeWithBonus(player, GraftableAugmentations[selectedAug]),
                  )}
                  {/* Use formula so the displayed creation time is accurate to player bonus */}
                </Typography>

                {selectedAugmentation.prereqs.length > 0 && (
                  <AugPreReqsChecklist player={player} aug={selectedAugmentation} />
                )}

                <br />

                <Typography>
                  {(() => {
                    const info =
                      typeof selectedAugmentation.info === "string" ? (
                        <span>{selectedAugmentation.info}</span>
                      ) : (
                        selectedAugmentation.info
                      );
                    const tooltip = (
                      <>
                        {info}
                        <br />
                        <br />
                        {selectedAugmentation.stats}
                      </>
                    );
                    return tooltip;
                  })()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ) : (
          <Typography>All Augmentations owned</Typography>
        )}
      </Box>

      <Box sx={{ my: 3 }}>
        <Typography variant="h5">Entropy Virus</Typography>

        <Paper sx={{ my: 1, p: 1, width: "fit-content" }}>
          <Typography>
            <b>Entropy strength:</b> {player.entropy}
            <br />
            <b>All multipliers decreased by:</b>{" "}
            {formatNumber((1 - CONSTANTS.EntropyEffect ** player.entropy) * 100, 3)}% (multiplicative)
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
