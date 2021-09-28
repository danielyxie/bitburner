import React, { useState } from "react";

import { Money } from "../../ui/React/Money";
import { Modal } from "../../ui/React/Modal";
import { use } from "../../ui/Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCorporationModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const canSelfFund = player.canAfford(150e9);
  if (!player.canAccessCorporation() || player.hasCorporation()) {
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

    player.startCorporation(name);
    player.loseMoney(150e9);

    props.onClose();
    router.toCorporation();
  }

  function seed(): void {
    if (name == "") {
      return;
    }

    player.startCorporation(name, 500e6);

    props.onClose();
    router.toCorporation();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Would you like to start a corporation? This will require $150b for registration and initial funding. This $150b
        can either be self-funded, or you can obtain the seed money from the government in exchange for 500 million
        shares
        <br />
        <br />
        If you would like to start one, please enter a name for your corporation below:
      </Typography>
      <TextField autoFocus={true} variant="standard" placeholder="Corporation Name" onChange={onChange} value={name} />
      <Button onClick={seed} disabled={name == ""}>
        Use seed money
      </Button>
      <Button onClick={selfFund} disabled={name == "" || !canSelfFund}>
        Self-Fund (<Money money={150e9} player={player} />)
      </Button>
    </Modal>
  );
}
