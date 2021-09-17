/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import * as React from "react";

import { getNextNeurofluxLevel, hasAugmentationPrereqs, purchaseAugmentation } from "../FactionHelpers";
import { PurchaseAugmentationPopup } from "./PurchaseAugmentationPopup";

import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { createPopup } from "../../ui/React/createPopup";
import { IMap } from "../../types";

import { StdButton } from "../../ui/React/StdButton";
import { Augmentation as AugFormat } from "../../ui/React/Augmentation";

type IProps = {
  augName: string;
  faction: Faction;
  p: IPlayer;
  rerender: () => void;
};

export function PurchaseableAugmentation(props: IProps): React.ReactElement {
  const aug = Augmentations[props.augName];
  if (aug == null) throw new Error(`aug ${props.augName} does not exists`);

  function getMoneyCost(): number {
    return aug.baseCost * props.faction.getInfo().augmentationPriceMult;
  }

  function getRepCost(): number {
    return aug.baseRepRequirement * props.faction.getInfo().augmentationRepRequirementMult;
  }

  function handleClick(): void {
    if (!Settings.SuppressBuyAugmentationConfirmation) {
      const popupId = "purchase-augmentation-popup";
      createPopup(popupId, PurchaseAugmentationPopup, {
        aug: aug,
        faction: props.faction,
        player: props.p,
        rerender: props.rerender,
        popupId: popupId,
      });
    } else {
      purchaseAugmentation(aug, props.faction);
      props.rerender();
    }
  }

  // Whether the player has the prerequisite Augmentations
  function hasPrereqs(): boolean {
    return hasAugmentationPrereqs(aug);
  }

  // Whether the player has enough rep for this Augmentation
  function hasReputation(): boolean {
    return props.faction.playerReputation >= getRepCost();
  }

  // Whether the player has this augmentations (purchased OR installed)
  function owned(): boolean {
    let owned = false;
    for (const queuedAug of props.p.queuedAugmentations) {
      if (queuedAug.name === props.augName) {
        owned = true;
        break;
      }
    }

    for (const installedAug of props.p.augmentations) {
      if (installedAug.name === props.augName) {
        owned = true;
        break;
      }
    }

    return owned;
  }

  if (aug == null) {
    console.error(
      `Invalid Augmentation when trying to create PurchaseableAugmentation display element: ${props.augName}`,
    );
    return <></>;
  }

  const moneyCost = getMoneyCost();
  const repCost = getRepCost();

  // Determine UI properties
  let disabled = false;
  let status: JSX.Element = <></>;
  let color = "";
  if (!hasPrereqs()) {
    disabled = true;
    status = <>LOCKED (Requires {aug.prereqs.map((aug) => AugFormat(aug))} as prerequisite)</>;
    color = "red";
  } else if (aug.name !== AugmentationNames.NeuroFluxGovernor && (aug.owned || owned())) {
    disabled = true;
  } else if (hasReputation()) {
    status = (
      <>
        UNLOCKED (at {Reputation(repCost)} faction reputation) - <Money money={moneyCost} player={props.p} />
      </>
    );
  } else {
    disabled = true;
    status = (
      <>
        LOCKED (Requires {Reputation(repCost)} faction reputation - <Money money={moneyCost} player={props.p} />)
      </>
    );
    color = "red";
  }

  const txtStyle: IMap<string> = {
    display: "inline-block",
  };
  if (color !== "") {
    txtStyle.color = color;
  }

  // Determine button txt
  let btnTxt = aug.name;
  if (aug.name === AugmentationNames.NeuroFluxGovernor) {
    btnTxt += ` - Level ${getNextNeurofluxLevel()}`;
  }

  let tooltip = <></>;
  if (typeof aug.info === "string")
    tooltip = (
      <>
        <span dangerouslySetInnerHTML={{ __html: aug.info }} />
        <br />
        <br />
        {aug.stats}
      </>
    );
  else
    tooltip = (
      <>
        {aug.info}
        <br />
        <br />
        {aug.stats}
      </>
    );

  return (
    <li key={aug.name}>
      <span
        style={{
          margin: "4px",
          padding: "4px",
        }}
      >
        <StdButton
          disabled={disabled}
          onClick={handleClick}
          style={{
            display: "inline-block",
          }}
          text={btnTxt}
          tooltip={tooltip}
        />
        <p style={txtStyle}>{status}</p>
      </span>
    </li>
  );
}
