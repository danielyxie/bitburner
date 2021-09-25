import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { removePopup } from "../../ui/React/createPopup";
import { ICorporation } from "../ICorporation";
import { Material } from "../Material";
import { SellMaterial } from "../Actions";

function initialPrice(mat: Material): string {
  let val = mat.sCost ? mat.sCost + "" : "";
  if (mat.marketTa2) {
    val += " (Market-TA.II)";
  } else if (mat.marketTa1) {
    val += " (Market-TA.I)";
  }
  return val;
}

interface IProps {
  mat: Material;
  corp: ICorporation;
  popupId: string;
}

// Create a popup that let the player manage sales of a material
export function SellMaterialPopup(props: IProps): React.ReactElement {
  const [amt, setAmt] = useState<string>(props.mat.sllman[1] ? props.mat.sllman[1] + "" : "");
  const [price, setPrice] = useState<string>(initialPrice(props.mat));

  function sellMaterial(): void {
    try {
      SellMaterial(props.mat, amt, price);
    } catch (err) {
      dialogBoxCreate(err + "");
    }

    removePopup(props.popupId);
  }

  function onAmtChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setAmt(event.target.value);
  }

  function onPriceChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setPrice(event.target.value);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) sellMaterial();
  }

  return (
    <>
      <p>
        Enter the maximum amount of {props.mat.name} you would like to sell per second, as well as the price at which
        you would like to sell at.
        <br />
        <br />
        If the sell amount is set to 0, then the material will not be sold. If the sell price if set to 0, then the
        material will be discarded
        <br />
        <br />
        Setting the sell amount to 'MAX' will result in you always selling the maximum possible amount of the material.
        <br />
        <br />
        When setting the sell amount, you can use the 'PROD' variable to designate a dynamically changing amount that
        depends on your production. For example, if you set the sell amount to 'PROD-5' then you will always sell 5 less
        of the material than you produce.
        <br />
        <br />
        When setting the sell price, you can use the 'MP' variable to designate a dynamically changing price that
        depends on the market price. For example, if you set the sell price to 'MP+10' then it will always be sold at
        $10 above the market price.
      </p>
      <br />
      <input
        className="text-input"
        value={amt}
        autoFocus={true}
        type="text"
        placeholder="Sell amount"
        style={{ marginTop: "4px" }}
        onChange={onAmtChange}
        onKeyDown={onKeyDown}
      />
      <input
        className="text-input"
        value={price}
        type="text"
        placeholder="Sell price"
        style={{ marginTop: "4px" }}
        onChange={onPriceChange}
        onKeyDown={onKeyDown}
      />
      <button className="std-button" onClick={sellMaterial}>
        Confirm
      </button>
    </>
  );
}
