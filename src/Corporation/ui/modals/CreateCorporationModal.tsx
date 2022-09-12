import React, { useState } from "react";

import { Money } from "../../../ui/React/Money";
import { Modal } from "../../../ui/React/Modal";
import { Router } from "../../../ui/GameRoot";
import { Player } from "../../../Player";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCorporationModal(props: IProps): React.ReactElement {
  const canSelfFund = Player.canAfford(150e9);
  if (!Player.canAccessCorporation() || Player.hasCorporation()) {
    props.onClose();
    return <></>;
  }

  const [name, setName] = useState("");
  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  function selfFund(): void {
    if (!canSelfFund) {
      return;
    }

    if (name == "") {
      return;
    }

    Player.startCorporation(name);
    Player.loseMoney(150e9, "corporation");

    props.onClose();
    Router.toCorporation();
  }

  function seed(): void {
    if (name == "") {
      return;
    }

    Player.startCorporation(name, 500e6);

    props.onClose();
    Router.toCorporation();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Would you like to start a corporation? This will require $150b for registration and initial funding.{" "}
        {Player.bitNodeN === 3 &&
          `This $150b
        can either be self-funded, or you can obtain the seed money from the government in exchange for 500 million
        shares`}
        <br />
        <br />
        If you would like to start one, please enter a name for your corporation below:
      </Typography>
      <TextField autoFocus={true} placeholder="Corporation Name" onChange={onChange} value={name} />
      {Player.bitNodeN === 3 && (
        <Button onClick={seed} disabled={name == ""}>
          Use seed money
        </Button>
      )}
      <Button onClick={selfFund} disabled={name == "" || !canSelfFund}>
        Self-Fund (<Money money={150e9} forPurchase={true} />)
      </Button>
    </Modal>
  );
}
