import React, { useState } from "react";

import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  text: string;
  placeText: string;
  place: (price: number) => void;
}

export function PlaceOrderModal(props: IProps): React.ReactElement {
  const [price, setPrice] = useState<number | null>(null);
  function onClick(): void {
    if (price === null) return;
    if (isNaN(price)) return;
    props.place(price);
    props.onClose();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    if (event.target.value === "") setPrice(null);
    else setPrice(parseFloat(event.target.value));
  }
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>{props.text}</Typography>
      <TextField
        autoFocus
        type="number"
        onChange={onChange}
        placeholder="price"
        InputProps={{
          endAdornment: <Button onClick={onClick}>{props.placeText}</Button>,
        }}
      />
    </Modal>
  );
}
