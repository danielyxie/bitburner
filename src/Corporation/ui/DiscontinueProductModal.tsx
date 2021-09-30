import React from "react";

import { Product } from "../Product";
import { Modal } from "../../ui/React/Modal";
import { useDivision } from "./Context";

interface IProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  rerender: () => void;
}

// Create a popup that lets the player discontinue a product
export function DiscontinueProductModal(props: IProps): React.ReactElement {
  const division = useDivision();
  function discontinue(): void {
    division.discontinueProduct(props.product);
    props.onClose();
    props.rerender();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <p>
        Are you sure you want to do this? Discontinuing a product removes it completely and permanently. You will no
        longer produce this product and all of its existing stock will be removed and left unsold
      </p>
      <button className="popup-box-button" onClick={discontinue}>
        Discontinue
      </button>
    </Modal>
  );
}
