import React, { useState } from "react";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { Action } from "../Action";
import { IBladeburner } from "../IBladeburner";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface IProps {
  bladeburner: IBladeburner;
  action: Action;
  open: boolean;
  onClose: () => void;
}

export function TeamSizeModal(props: IProps): React.ReactElement {
  const [teamSize, setTeamSize] = useState<number | undefined>();

  function confirmTeamSize(): void {
    if (teamSize === undefined) return;
    const num = Math.round(teamSize);
    if (isNaN(num) || num < 0) {
      dialogBoxCreate("Invalid value entered for number of Team Members (must be numeric, positive)");
    } else {
      props.action.teamCount = num;
    }
    props.onClose();
  }

  function onTeamSize(event: React.ChangeEvent<HTMLInputElement>): void {
    const x = parseFloat(event.target.value);
    if (x > props.bladeburner.teamSize) setTeamSize(props.bladeburner.teamSize);
    else setTeamSize(x);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        Enter the amount of team members you would like to take on this Op. If you do not have the specified number of
        team members, then as many as possible will be used. Note that team members may be lost during operations.
      </Typography>
      <TextField
        autoFocus
        variant="standard"
        type="number"
        placeholder="Team size"
        value={teamSize}
        onChange={onTeamSize}
      />
      <Button sx={{ mx: 2 }} onClick={confirmTeamSize}>
        Confirm
      </Button>
    </Modal>
  );
}
