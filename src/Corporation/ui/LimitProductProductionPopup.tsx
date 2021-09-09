import React, { useState } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { Product } from "../Product";

interface IProps {
  product: Product;
  city: string;
  popupId: string;
}

// Create a popup that lets the player limit the production of a product
export function LimitProductProductionPopup(props: IProps): React.ReactElement {
  const [limit, setLimit] = useState<number | null>(null);

  function limitProductProduction(): void {
    if (limit === null) {
      props.product.prdman[props.city][0] = false;
      removePopup(props.popupId);
      return;
    }
    const qty = limit;
    if (isNaN(qty)) {
      dialogBoxCreate("Invalid value entered");
      return;
    }
    if (qty < 0) {
      props.product.prdman[props.city][0] = false;
    } else {
      props.product.prdman[props.city][0] = true;
      props.product.prdman[props.city][1] = qty;
    }
    removePopup(props.popupId);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) limitProductProduction();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setLimit(null);
    else setLimit(parseFloat(event.target.value));
  }

  return (
    <>
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
    </>
  );
}
