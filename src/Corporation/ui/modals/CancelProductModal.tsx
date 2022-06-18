import React from "react";

import { Product } from "../../Product";
import { Modal } from "../../../ui/React/Modal";
import { useDivision } from "../Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  rerender: () => void;
}

// Create a popup that lets the player cancel a product
export function CancelProductModal(props: IProps): React.ReactElement {
  const division = useDivision();
  function cancel(): void {
    division.discontinueProduct(props.product);
    props.onClose();
    props.rerender();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Are you sure you want to do this? Canceling a product removes it completely and permanently. You will receive no
        money back by doing so
      </Typography>
      <Button onClick={cancel}>Cancel</Button>
    </Modal>
  );
}
