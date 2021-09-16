import React from "react";
import { Modal } from "./Modal";

import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

interface IProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    confirmationText: string;
  }
  
  export function ConfirmationModal(props: IProps): React.ReactElement {
    return (
      <Modal open={props.open} onClose={props.onClose}>
        <>
          <Typography>
            {props.confirmationText}
          </Typography>
          <Button onClick={() => {
            props.onConfirm();
          }}>Confirm</Button>
        </>
      </Modal>
    );
  }
  