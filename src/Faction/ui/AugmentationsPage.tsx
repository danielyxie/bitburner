/**
 * Root React Component for displaying a faction's "Purchase Augmentations" page
 */
import React, { useState } from "react";

import { PurchaseableAugmentation } from "./PurchaseableAugmentation";

import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { PurchaseAugmentationsOrderSetting } from "../../Settings/SettingEnums";
import { Settings } from "../../Settings/Settings";
import { hasAugmentationPrereqs } from "../FactionHelpers";

import { use } from "../../ui/Context";
import { Reputation } from "../../ui/React/Reputation";
import { Favor } from "../../ui/React/Favor";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { CONSTANTS } from "../../Constants";

type IProps = {
  faction: Faction;
  routeToMainPage: () => void;
};

export function AugmentationsPage(props: IProps): React.ReactElement {
  const player = use.Player();
  // Flag for whether the player has a gang with this faction
  const isPlayersGang = player.inGang() && player.getGangName() === props.faction.name;

  const setRerender = useState(false)[1];

  function rerender(): void {
    setRerender((old) => !old);
  }

  function getAugs(): string[] {
    if (isPlayersGang) {
      const augs: string[] = [];
      for (const augName in Augmentations) {
        if (augName === AugmentationNames.NeuroFluxGovernor) continue;
        if (augName === AugmentationNames.TheRedPill && player.bitNodeN !== 2) continue;
        const aug = Augmentations[augName];
        if (!aug.isSpecial) {
          augs.push(augName);
        }
      }

      return augs;
    } else {
      return props.faction.augmentations.slice();
    }
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
      const repCost = aug.baseRepRequirement * props.faction.getInfo().augmentationRepRequirementMult;
      const hasReq = props.faction.playerReputation >= repCost;
      const hasRep = hasAugmentationPrereqs(aug);
      const hasCost = aug.baseCost !== 0 && player.money > aug.baseCost * props.faction.getInfo().augmentationPriceMult;
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

  const purchaseableAugmentation = (aug: string, owned = false): React.ReactNode => {
    return (
      <PurchaseableAugmentation
        augName={aug}
        faction={props.faction}
        key={aug}
        p={player}
        rerender={rerender}
        owned={owned}
      />
    );
  };

  const augListElems = purchasable.map((aug) => purchaseableAugmentation(aug));

  let ownedElem = <></>;
  const owned = augs.filter((aug: string) => !purchasable.includes(aug));
  if (owned.length !== 0) {
    ownedElem = (
      <>
        <br />
        <Typography variant="h4">Purchased Augmentations</Typography>
        <Typography>This faction also offers these augmentations but you already own them.</Typography>
        {owned.map((aug) => purchaseableAugmentation(aug, true))}
      </>
    );
  }
  const mult = Math.pow(
    CONSTANTS.MultipleAugMultiplier * [1, 0.96, 0.94, 0.93][player.sourceFileLvl(11)],
    player.queuedAugmentations.length,
  );
  return (
    <>
      <Button onClick={props.routeToMainPage}>Back</Button>
      <Typography variant="h4">Faction Augmentations</Typography>
      <Typography>
        These are all of the Augmentations that are available to purchase from {props.faction.name}. Augmentations are
        powerful upgrades that will enhance your abilities.
        <br />
        Reputation: <Reputation reputation={props.faction.playerReputation} /> Favor:{" "}
        <Favor favor={Math.floor(props.faction.favor)} />
      </Typography>
      <Box display="flex">
        <Tooltip
          title={
            <Typography>
              The price of every Augmentation increases for every queued Augmentation and it is reset when you install
              them.
            </Typography>
          }
        >
          <Typography>Price multiplier: x {mult.toFixed(3)}</Typography>
        </Tooltip>
      </Box>
      <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Cost)}>Sort by Cost</Button>
      <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Reputation)}>Sort by Reputation</Button>
      <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Default)}>Sort by Default Order</Button>
      <Button onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Purchasable)}>
        Sort by Purchasable
      </Button>
      <br />

      <Table size="small" padding="none">
        <TableBody>{augListElems}</TableBody>
      </Table>

      <Table size="small" padding="none">
        <TableBody>{ownedElem}</TableBody>
      </Table>
    </>
  );
}
