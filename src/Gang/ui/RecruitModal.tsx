/**
 * React Component for the popup used to recruit new gang members.
 */
import React, { useState } from "react";
import { Modal } from "../../ui/React/Modal";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { useGang } from "./Context";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface IRecruitPopupProps {
  open: boolean;
  onClose: () => void;
  onRecruit: () => void;
}

export function RecruitModal(props: IRecruitPopupProps): React.ReactElement {
  const gang = useGang();
  const [name, setName] = useState("");

  const disabled = name === "" || !gang.canRecruitMember();
  function recruit(): void {
    if (disabled) return;
    // At this point, the only way this can fail is if you already
    // have a gang member with the same name
    if (!gang.recruitMember(name)) {
      dialogBoxCreate("You already have a gang member with this name!");
      return;
    }

    props.onRecruit();
    props.onClose();
  }

  function onKeyUp(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.keyCode === 13) recruit();
  }

  function onChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setName(event.target.value);
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>Enter a name for your new Gang member:</Typography>
      <br />
      <TextField
        autoFocus
        onKeyUp={onKeyUp}
        onChange={onChange}
        type="text"
        placeholder="unique name"
        InputProps={{
          endAdornment: (
            <Button disabled={disabled} onClick={recruit}>
              Recruit
            </Button>
          ),
        }}
      />
    </Modal>
  );
}
