import React, { useState } from "react";
import { dialogBoxCreate } from "../../../utils/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { Product } from "../Product";
import { SellProduct } from "../Actions";

function initialPrice(product: Product): string {
  let val = product.sCost ? product.sCost + "" : "";
  if (product.marketTa2) {
    val += " (Market-TA.II)";
  } else if (product.marketTa1) {
    val += " (Market-TA.I)";
  }
  return val;
}

interface IProps {
  product: Product;
  city: string;
  popupId: string;
}

// Create a popup that let the player manage sales of a material
export function SellProductPopup(props: IProps): React.ReactElement {
  const [checked, setChecked] = useState(true);
  const [iQty, setQty] = useState<string>(
    props.product.sllman[props.city][1]
      ? props.product.sllman[props.city][1]
      : "",
  );
  const [px, setPx] = useState<string>(initialPrice(props.product));

  function onCheckedChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setChecked(event.target.checked);
  }

  function sellProduct(): void {
    try {
      SellProduct(props.product, props.city, iQty, px, checked);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    removePopup(props.popupId);
  }

  function onAmtChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setQty(event.target.value);
  }

  function onPriceChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setPx(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) sellProduct();
  }

  return (
    <>
      <p>
        Enter the maximum amount of {props.product.name} you would like to sell
        per second, as well as the price at which you would like to sell it at.
        <br />
        <br />
        If the sell amount is set to 0, then the product will not be sold. If
        the sell price is set to 0, then the product will be discarded.
        <br />
        <br />
        Setting the sell amount to 'MAX' will result in you always selling the
        maximum possible amount of the material.
        <br />
        <br />
        When setting the sell amount, you can use the 'PROD' variable to
        designate a dynamically changing amount that depends on your production.
        For example, if you set the sell amount to 'PROD-1' then you will always
        sell 1 less of the material than you produce.
        <br />
        <br />
        When setting the sell price, you can use the 'MP' variable to set a
        dynamically changing price that depends on the Product's estimated
        market price. For example, if you set it to 'MP*5' then it will always
        be sold at five times the estimated market price.
      </p>
      <br />
      <input
        className="text-input"
        value={iQty}
        autoFocus={true}
        type="text"
        placeholder="Sell amount"
        style={{ marginTop: "4px" }}
        onChange={onAmtChange}
        onKeyDown={onKeyDown}
      />
      <input
        className="text-input"
        value={px}
        type="text"
        placeholder="Sell price"
        style={{ marginTop: "4px" }}
        onChange={onPriceChange}
        onKeyDown={onKeyDown}
      />
      <button className="std-button" onClick={sellProduct}>
        Confirm
      </button>
      <div style={{ border: "1px solid white", display: "inline-block" }}>
        <label htmlFor={props.popupId + "-checkbox"}>
          Use same 'Sell Amount' for all cities
        </label>
        <input
          checked={checked}
          onChange={onCheckedChange}
          id={props.popupId + "-checkbox"}
          style={{ margin: "2px" }}
          type="checkbox"
        />
      </div>
    </>
  );
}
