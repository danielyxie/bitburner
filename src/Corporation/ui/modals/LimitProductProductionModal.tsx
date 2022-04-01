import React, { useState } from "react";
import { Product } from "../../Product";
import { LimitProductProduction } from "../../Actions";
import { Modal } from "../../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { KEY } from "../../../utils/helpers/keyCodes";

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
    if (event.key === KEY.ENTER) limitProductProduction();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setLimit(null);
    else setLimit(parseFloat(event.target.value));
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter a limit to the amount of this product you would like to produce per second. Leave the box empty to set no
        limit.
      </Typography>
      <TextField autoFocus={true} placeholder="Limit" type="number" onChange={onChange} onKeyDown={onKeyDown} />
      <Button onClick={limitProductProduction}>Limit production</Button>
    </Modal>
  );
}
