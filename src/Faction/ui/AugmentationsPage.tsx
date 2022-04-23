/**
 * Root React Component for displaying a faction's "Purchase Augmentations" page
 */
import { Box, Button, Tooltip, Typography, Paper, Container } from "@mui/material";
import React, { useState } from "react";
import { getGenericAugmentationPriceMultiplier } from "../../Augmentation/AugmentationHelpers";
import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { PurchaseableAugmentations } from "../../Augmentation/ui/PurchaseableAugmentations";
import { PurchaseAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import { Settings } from "../../Settings/Settings";
import { use } from "../../ui/Context";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Favor } from "../../ui/React/Favor";
import { Reputation } from "../../ui/React/Reputation";
import { FactionNames } from "../data/FactionNames";
import { Faction } from "../Faction";
import { getFactionAugmentationsFiltered, hasAugmentationPrereqs, purchaseAugmentation } from "../FactionHelpers";

type IProps = {
  faction: Faction;
  routeToMainPage: () => void;
};

export function AugmentationsPage(props: IProps): React.ReactElement {
  const player = use.Player();

  const setRerender = useState(false)[1];

  function rerender(): void {
    setRerender((old) => !old);
  }

  function getAugs(): string[] {
    return getFactionAugmentationsFiltered(player, props.faction);
  }

  function getAugsSorted(): string[] {
    switch (Settings.PurchaseAugmentationsOrder) {
      case PurchaseAugmentationsOrderSetting.Cost: {
        return getAugsSortedByCost();
      }
      case PurchaseAugmentationsOrderSetting.Reputation: {
        return getAugsSortedByReputation();
      }
      case PurchaseAugmentationsOrderSetting.Purchasable: {
        return getAugsSortedByPurchasable();
      }
      default:
        return getAugsSortedByDefault();
    }
  }

  function getAugsSortedByCost(): string[] {
    const augs = getAugs();
    augs.sort((augName1, augName2) => {
      const aug1 = Augmentations[augName1],
        aug2 = Augmentations[augName2];
      if (aug1 == null || aug2 == null) {
        throw new Error("Invalid Augmentation Names");
      }

      return aug1.baseCost - aug2.baseCost;
    });

    return augs;
  }

  function getAugsSortedByPurchasable(): string[] {
    const augs = getAugs();
    function canBuy(augName: string): boolean {
      const aug = Augmentations[augName];
      const repCost = aug.baseRepRequirement;
      const hasReq = props.faction.playerReputation >= repCost;
      const hasRep = hasAugmentationPrereqs(aug);
      const hasCost = aug.baseCost !== 0 && player.money > aug.baseCost;
      return hasCost && hasReq && hasRep;
    }
    const buy = augs.filter(canBuy).sort((augName1, augName2) => {
      const aug1 = Augmentations[augName1],
        aug2 = Augmentations[augName2];
      if (aug1 == null || aug2 == null) {
        throw new Error("Invalid Augmentation Names");
      }

      return aug1.baseCost - aug2.baseCost;
    });
    const cantBuy = augs
      .filter((aug) => !canBuy(aug))
      .sort((augName1, augName2) => {
        const aug1 = Augmentations[augName1],
          aug2 = Augmentations[augName2];
        if (aug1 == null || aug2 == null) {
          throw new Error("Invalid Augmentation Names");
        }
        return aug1.baseRepRequirement - aug2.baseRepRequirement;
      });

    return buy.concat(cantBuy);
  }

  function getAugsSortedByReputation(): string[] {
    const augs = getAugs();
    augs.sort((augName1, augName2) => {
      const aug1 = Augmentations[augName1],
        aug2 = Augmentations[augName2];
      if (aug1 == null || aug2 == null) {
        throw new Error("Invalid Augmentation Names");
      }
      return aug1.baseRepRequirement - aug2.baseRepRequirement;
    });

    return augs;
  }

  function getAugsSortedByDefault(): string[] {
    return getAugs();
  }

  function switchSortOrder(newOrder: PurchaseAugmentationsOrderSetting): void {
    Settings.PurchaseAugmentationsOrder = newOrder;
    rerender();
  }

  const augs = getAugsSorted();
  const purchasable = augs.filter(
    (aug: string) =>
      aug === AugmentationNames.NeuroFluxGovernor ||
      (!player.augmentations.some((a) => a.name === aug) && !player.queuedAugmentations.some((a) => a.name === aug)),
  );
  const owned = augs.filter((aug: string) => !purchasable.includes(aug));

  const multiplierComponent =
    props.faction.name !== FactionNames.ShadowsOfAnarchy ? (
      <Typography>
        <b>Price multiplier:</b> x {numeralWrapper.formatMultiplier(getGenericAugmentationPriceMultiplier())}
      </Typography>
    ) : (
      <></>
    );

  return (
    <>
      <Container disableGutters maxWidth="md" sx={{ mx: 0 }}>
        <Button onClick={props.routeToMainPage}>Back</Button>
        <Typography variant="h4">Faction Augmentations</Typography>
        <Paper sx={{ p: 1, mb: 1 }}>
          <Typography>
            These are all of the Augmentations that are available to purchase from <b>{props.faction.name}</b>.
            Augmentations are powerful upgrades that will enhance your abilities.
            <br />
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", justifyItems: "center", my: 1 }}>
            <Tooltip
              title={
                <Typography>
                  The price of every Augmentation increases for every queued Augmentation and it is reset when you
                  install them.
                </Typography>
              }
            >
              {multiplierComponent}
            </Tooltip>
            <Typography>
              <b>Reputation:</b> <Reputation reputation={props.faction.playerReputation} />
            </Typography>
            <Typography>
              <b>Favor:</b> <Favor favor={Math.floor(props.faction.favor)} />
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
            <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Cost)}>Sort by Cost</Button>
            <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Reputation)}>
              Sort by Reputation
            </Button>
            <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Default)}>
              Sort by Default Order
            </Button>
            <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Purchasable)}>
              Sort by Purchasable
            </Button>
          </Box>
        </Paper>
      </Container>

      <PurchaseableAugmentations
        augNames={purchasable}
        ownedAugNames={owned}
        player={player}
        canPurchase={(player, aug) => {
          return (
            hasAugmentationPrereqs(aug) &&
            props.faction.playerReputation >= aug.baseRepRequirement &&
            (aug.baseCost === 0 || player.money > aug.baseCost)
          );
        }}
        purchaseAugmentation={(player, aug, showModal) => {
          if (!Settings.SuppressBuyAugmentationConfirmation) {
            showModal(true);
          } else {
            purchaseAugmentation(aug, props.faction);
            rerender();
          }
        }}
        rep={props.faction.playerReputation}
        faction={props.faction}
      />
    </>
  );
}
