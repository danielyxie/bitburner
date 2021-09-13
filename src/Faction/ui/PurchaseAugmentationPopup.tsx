import React from "react";

import { Augmentation } from "../../Augmentation/Augmentation";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { purchaseAugmentation } from "../FactionHelpers";
import { isRepeatableAug } from "../../Augmentation/AugmentationHelpers";
import { Money } from "../../ui/React/Money";
import { removePopup } from "../../ui/React/createPopup";

interface IProps {
  player: IPlayer;
  faction: Faction;
  aug: Augmentation;
  popupId: string;
}

export function PurchaseAugmentationPopup(props: IProps): React.ReactElement {
  const factionInfo = props.faction.getInfo();

  function buy(): void {
    if (!isRepeatableAug(props.aug) && props.player.hasAugmentation(props.aug)) {
      return;
    }

    purchaseAugmentation(props.aug, props.faction);
    removePopup(props.popupId);
  }

  return (
    <>
      <h2>{props.aug.name}</h2>
      <br />
      {props.aug.info}
      <br />
      <br />
      {props.aug.stats}
      <br />
      <br />
      Would you like to purchase the {props.aug.name} Augmentation for&nbsp;
      <Money money={props.aug.baseCost * factionInfo.augmentationPriceMult} />?
      <br />
      <br />
      <button autoFocus={true} className="std-button" onClick={buy}>
        Purchase
      </button>
    </>
  );
}
