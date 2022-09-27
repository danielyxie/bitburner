import React from "react";

import { Augmentation } from "../Augmentation";
import { Faction } from "../../Faction/Faction";
import { purchaseAugmentation } from "../../Faction/FactionHelpers";
import { isRepeatableAug } from "../AugmentationHelpers";
import { Money } from "../../ui/React/Money";
import { Modal } from "../../ui/React/Modal";
import { Player } from "../../Player";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  faction?: Faction;
  aug?: Augmentation;
}

export function PurchaseAugmentationModal(props: IProps): React.ReactElement {
  if (!props.aug || !props.faction) {
    return <></>;
  }

  function buy(): void {
    if (!props.aug || (!isRepeatableAug(props.aug) && Player.hasAugmentation(props.aug.name))) {
      return;
    }

    purchaseAugmentation(props.aug as Augmentation, props.faction as Faction);
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h4">{props.aug.name}</Typography>
      <Typography>
        {props.aug.info}
        <br />
        <br />
        {props.aug.stats}
        <br />
        <br />
        Would you like to purchase the {props.aug.name} Augmentation for&nbsp;
        <Money money={props.aug.getCost().moneyCost} />?
        <br />
        <br />
      </Typography>
      <Button autoFocus onClick={buy}>
        Purchase
      </Button>
    </Modal>
  );
}
