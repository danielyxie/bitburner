/**
 * React Component for the popup used to purchase a new server.
 */
import React, { useState } from "react";
import { purchaseServer } from "../../Server/ServerPurchases";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import { Modal } from "../../ui/React/Modal";
import { use } from "../../ui/Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  ram: number;
  cost: number;
  rerender: () => void;
}

export function PurchaseServerModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const [hostname, setHostname] = useState("");

  function tryToPurchaseServer(): void {
    purchaseServer(hostname, props.ram, props.cost, player);
    props.onClose();
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) tryToPurchaseServer();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setHostname(event.target.value);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Would you like to purchase a new server with {numeralWrapper.formatRAM(props.ram)} of RAM for{" "}
        <Money money={props.cost} player={player} />?
      </Typography>
      <br />
      <br />
      <Typography> Please enter the server hostname below:</Typography>
      <br />

      <TextField
        autoFocus
        onKeyUp={onKeyUp}
        onChange={onChange}
        type="text"
        placeholder="Unique Hostname"
        InputProps={{
          endAdornment: (
            <Button onClick={tryToPurchaseServer} disabled={!player.canAfford(props.cost) || hostname === ""}>
              Buy
            </Button>
          ),
        }}
      />
    </Modal>
  );
}
