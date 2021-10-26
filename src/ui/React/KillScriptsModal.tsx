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
      <Typography>Forcefully kill all running scripts? This will also save your game and reload the game.</Typography>
      <Button onClick={onClick}>KILL</Button>
    </Modal>
  );
}
