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

import { StdButton } from "../../ui/React/StdButton";
import { use } from "../../ui/Context";

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

  const purchaseableAugmentation = (aug: string): React.ReactNode => {
    return <PurchaseableAugmentation augName={aug} faction={props.faction} key={aug} p={player} rerender={rerender} />;
  };

  const augListElems = purchasable.map((aug) => purchaseableAugmentation(aug));

  let ownedElem = <></>;
  const owned = augs.filter((aug: string) => !purchasable.includes(aug));
  if (owned.length !== 0) {
    ownedElem = (
      <>
        <br />
        <h2>Purchased Augmentations</h2>
        <p>This factions also offers these augmentations but you already own them.</p>
        {owned.map((aug) => purchaseableAugmentation(aug))}
      </>
    );
  }

  return (
    <div>
      <StdButton onClick={props.routeToMainPage} text={"Back"} />
      <h1>Faction Augmentations</h1>
      <p>
        These are all of the Augmentations that are available to purchase from {props.faction.name}. Augmentations are
        powerful upgrades that will enhance your abilities.
      </p>
      <StdButton onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Cost)} text={"Sort by Cost"} />
      <StdButton
        onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Reputation)}
        text={"Sort by Reputation"}
      />
      <StdButton
        onClick={() => switchSortOrder(PurchaseAugmentationsOrderSetting.Default)}
        text={"Sort by Default Order"}
      />
      <br />
      {augListElems}
      {ownedElem}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}
