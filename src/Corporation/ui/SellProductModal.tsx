import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Product } from "../Product";
import { SellProduct } from "../Actions";
import { Modal } from "../../ui/React/Modal";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

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
  open: boolean;
  onClose: () => void;
  product: Product;
  city: string;
}

// Create a popup that let the player manage sales of a material
export function SellProductModal(props: IProps): React.ReactElement {
  const [checked, setChecked] = useState(true);
  const [iQty, setQty] = useState<string>(
    props.product.sllman[props.city][1] ? props.product.sllman[props.city][1] : "",
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

    props.onClose();
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
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter the maximum amount of {props.product.name} you would like to sell per second, as well as the price at
        which you would like to sell it at.
        <br />
        <br />
        If the sell amount is set to 0, then the product will not be sold. If the sell price is set to 0, then the
        product will be discarded.
        <br />
        <br />
        Setting the sell amount to 'MAX' will result in you always selling the maximum possible amount of the material.
        <br />
        <br />
        When setting the sell amount, you can use the 'PROD' variable to designate a dynamically changing amount that
        depends on your production. For example, if you set the sell amount to 'PROD-1' then you will always sell 1 less
        of the material than you produce.
        <br />
        <br />
        When setting the sell price, you can use the 'MP' variable to set a dynamically changing price that depends on
        the Product's estimated market price. For example, if you set it to 'MP*5' then it will always be sold at five
        times the estimated market price.
      </Typography>
      <br />
      <TextField
        value={iQty}
        autoFocus={true}
        type="text"
        placeholder="Sell amount"
        onChange={onAmtChange}
        onKeyDown={onKeyDown}
      />
      <TextField value={px} type="text" placeholder="Sell price" onChange={onPriceChange} onKeyDown={onKeyDown} />
      <Button onClick={sellProduct}>Confirm</Button>
      <FormControlLabel
        control={<Switch checked={checked} onChange={onCheckedChange} />}
        label={<Typography>Use same 'Sell Amount' for all cities</Typography>}
      />
    </Modal>
  );
}
