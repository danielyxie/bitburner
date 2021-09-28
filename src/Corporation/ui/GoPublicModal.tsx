import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { numeralWrapper } from "../../ui/numeralFormat";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

interface IProps {
  open: boolean;
  onClose: () => void;
  rerender: () => void;
}

// Create a popup that lets the player manage exports
export function GoPublicModal(props: IProps): React.ReactElement {
  const corp = useCorporation();
  const [shares, setShares] = useState("");
  const initialSharePrice = corp.determineValuation() / corp.totalShares;

  function goPublic(): void {
    const numShares = parseFloat(shares);
    const initialSharePrice = corp.determineValuation() / corp.totalShares;
    if (isNaN(numShares)) {
      dialogBoxCreate("Invalid value for number of issued shares");
      return;
    }
    if (numShares > corp.numShares) {
      dialogBoxCreate("Error: You don't have that many shares to issue!");
      return;
    }
    corp.public = true;
    corp.sharePrice = initialSharePrice;
    corp.issuedShares = numShares;
    corp.numShares -= numShares;
    corp.addFunds(numShares * initialSharePrice);
    props.rerender();
    dialogBoxCreate(
      `You took your ${corp.name} public and earned ` +
        `${numeralWrapper.formatMoney(numShares * initialSharePrice)} in your IPO`,
    );
    props.onClose();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) goPublic();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setShares(event.target.value);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter the number of shares you would like to issue for your IPO. These shares will be publicly sold and you will
        no longer own them. Your Corporation will receive {numeralWrapper.formatMoney(initialSharePrice)} per share (the
        IPO money will be deposited directly into your Corporation's funds).
        <br />
        <br />
        You have a total of {numeralWrapper.format(corp.numShares, "0.000a")} of shares that you can issue.
      </Typography>
      <Box display="flex" alignItems="center">
        <TextField
          variant="standard"
          value={shares}
          onChange={onChange}
          autoFocus
          type="number"
          placeholder="Shares to issue"
          onKeyDown={onKeyDown}
        />
        <Button sx={{ mx: 1 }} onClick={goPublic}>
          Go Public
        </Button>
      </Box>
    </Modal>
  );
}
