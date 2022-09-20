import { Container, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { PurchasableAugmentations } from "../../../Augmentation/ui/PurchasableAugmentations";
import { Player } from "../../../Player";
import { Modal } from "../../../ui/React/Modal";
import { Sleeve } from "../Sleeve";

interface IProps {
  open: boolean;
  onClose: () => void;
  sleeve: Sleeve;
}

export function SleeveAugmentationsModal(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 150);
    return () => clearInterval(id);
  }, []);

  // Array of all owned Augmentations. Names only
  const ownedAugNames = props.sleeve.augmentations.map((e) => e.name);

  // You can only purchase Augmentations that are actually available from
  // your factions. I.e. you must be in a faction that has the Augmentation
  // and you must also have enough rep in that faction in order to purchase it.
  const availableAugs = props.sleeve.findPurchasableAugs();

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Container component={Paper} disableGutters maxWidth="lg" sx={{ mx: 0, mb: 1, p: 1 }}>
        <Typography>
          You can purchase Augmentations for your Duplicate Sleeves. These Augmentations have the same effect as they
          would for you. You can only purchase Augmentations that you have unlocked through Factions.
          <br />
          <br />
          When purchasing an Augmentation for a Duplicate Sleeve, they are immediately installed. This means that the
          Duplicate Sleeve will immediately lose all of its stat experience.
          <br />
          <br />
          Augmentations will appear below as they become available.
        </Typography>
      </Container>
      <PurchasableAugmentations
        augNames={availableAugs.map((aug) => aug.name)}
        ownedAugNames={ownedAugNames}
        canPurchase={(aug) => {
          return Player.money > aug.baseCost;
        }}
        purchaseAugmentation={(aug) => {
          props.sleeve.tryBuyAugmentation(aug);
          rerender();
        }}
        sleeveAugs
      />
    </Modal>
  );
}
