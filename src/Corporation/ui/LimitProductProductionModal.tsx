import React, { useState } from "react";
import { Product } from "../Product";
import { LimitProductProduction } from "../Actions";
import { Modal } from "../../ui/React/Modal";

interface IProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  city: string;
}

// Create a popup that lets the player limit the production of a product
export function LimitProductProductionModal(props: IProps): React.ReactElement {
  const [limit, setLimit] = useState<number | null>(null);

  function limitProductProduction(): void {
    let qty = limit;
    if (qty === null) qty = -1;
    LimitProductProduction(props.product, props.city, qty);
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) limitProductProduction();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setLimit(null);
    else setLimit(parseFloat(event.target.value));
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <p>
        Enter a limit to the amount of this product you would like to product per second. Leave the box empty to set no
        limit.
      </p>
      <input
        autoFocus={true}
        className="text-input"
        style={{ margin: "5px" }}
        placeholder="Limit"
        type="number"
        onChange={onChange}
        onKeyDown={onKeyDown}
      />
      <button
        className="std-button"
        style={{ margin: "5px", display: "inline-block" }}
        onClick={limitProductProduction}
      >
        Limit production
      </button>
    </Modal>
  );
}
