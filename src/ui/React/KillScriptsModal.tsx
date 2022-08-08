import React from "react";
import { Modal } from "./Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface IProps {
  open: boolean;
  onClose: () => void;
  killScripts: () => void;
}

export function KillScriptsModal(props: IProps): React.ReactElement {
  function onClick(): void {
    props.killScripts();
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>Do you want to delete all running scripts forcefully?</Typography>
      <Typography sx={{ mb: 2 }}>This will also save your game and reload the game.</Typography>
      <Button onClick={onClick}>Yes</Button>
      <Button sx={{ float: "right" }} onClick={props.onClose}>
        No
      </Button>
    </Modal>
  );
}
