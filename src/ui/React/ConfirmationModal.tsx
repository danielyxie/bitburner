import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React from "react";

import { Modal } from "./Modal";

interface IProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmationText: string | React.ReactNode;
  additionalButton?: React.ReactNode;
}

export function ConfirmationModal(props: IProps): React.ReactElement {
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>{props.confirmationText}</Typography>
        <Button
          onClick={() => {
            props.onConfirm();
          }}
        >
          Confirm
        </Button>
        {props.additionalButton && <>{props.additionalButton}</>}
      </>
    </Modal>
  );
}
