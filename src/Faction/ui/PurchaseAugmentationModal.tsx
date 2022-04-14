import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";

import type { Augmentation } from "../../Augmentation/Augmentation";
import { isRepeatableAug } from "../../Augmentation/AugmentationHelpers";
import { use } from "../../ui/Context";
import { Modal } from "../../ui/React/Modal";
import { Money } from "../../ui/React/Money";
import type { Faction } from "../Faction";
import { purchaseAugmentation } from "../FactionHelpers";

interface IProps {
  open: boolean;
  onClose: () => void;
  faction: Faction;
  aug: Augmentation;
  rerender: () => void;
}

export function PurchaseAugmentationModal(props: IProps): React.ReactElement {
  const player = use.Player();

  function buy(): void {
    if (!isRepeatableAug(props.aug) && player.hasAugmentation(props.aug)) {
      return;
    }

    purchaseAugmentation(props.aug, props.faction);
    props.rerender();
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
        <Money money={props.aug.baseCost} />?
        <br />
        <br />
      </Typography>
      <Button autoFocus onClick={buy}>
        Purchase
      </Button>
    </Modal>
  );
}
