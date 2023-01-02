import React, { useState, useEffect } from "react";
import { Modal } from "../../ui/React/Modal";
import { use } from "../../ui/Context";
import { EventEmitter } from "../../utils/EventEmitter";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const BitFlumeEvent = new EventEmitter<[]>();

export function BitFlumeModal(): React.ReactElement {
  const router = use.Router();
  const [open, setOpen] = useState(false);
  function flume(): void {
    router.toBitVerse(true, false);
    setOpen(false);
  }

  useEffect(() => BitFlumeEvent.subscribe(() => setOpen(true)), []);

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Typography>
        WARNING: USING THIS PROGRAM WILL CAUSE YOU TO LOSE ALL OF YOUR PROGRESS ON THE CURRENT BITNODE.
        <br />
        <br />
        Do you want to travel to the BitNode Nexus? This allows you to reset the current BitNode and select a new one.
      </Typography>
      <br />
      <br />
      <Button onClick={flume}>Travel to the BitVerse</Button>
    </Modal>
  );
}
