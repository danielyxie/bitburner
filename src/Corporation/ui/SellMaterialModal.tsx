import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Material } from "../Material";
import { SellMaterial } from "../Actions";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

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
  open: boolean;
  onClose: () => void;
  mat: Material;
}

// Create a popup that let the player manage sales of a material
export function SellMaterialModal(props: IProps): React.ReactElement {
  const [amt, setAmt] = useState<string>(props.mat.sllman[1] ? props.mat.sllman[1] + "" : "");
  const [price, setPrice] = useState<string>(initialPrice(props.mat));

  function sellMaterial(): void {
    try {
      SellMaterial(props.mat, amt, price);
    } catch (err) {
      dialogBoxCreate(err + "");
    }
    props.onClose();
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
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
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
      </Typography>
      <br />
      <TextField
        value={amt}
        autoFocus={true}
        type="text"
        placeholder="Sell amount"
        onChange={onAmtChange}
        onKeyDown={onKeyDown}
      />
      <TextField value={price} type="text" placeholder="Sell price" onChange={onPriceChange} onKeyDown={onKeyDown} />
      <Button onClick={sellMaterial}>Confirm</Button>
    </Modal>
  );
}
