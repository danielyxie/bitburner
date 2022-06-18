import React, { useState } from "react";

import { ConfirmationModal } from "./ConfirmationModal";
import Button from "@mui/material/Button";
import { Tooltip } from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

interface IProps {
  color?: "primary" | "warning" | "error";
  noConfirmation?: boolean;
  onTriggered: () => void;
}

export function SoftResetButton({
  color = "primary",
  noConfirmation = false,
  onTriggered,
}: IProps): React.ReactElement {
  const [modalOpened, setModalOpened] = useState(false);

  function handleButtonClick(): void {
    if (noConfirmation) {
      onTriggered();
    } else {
      setModalOpened(true);
    }
  }

  return (
    <>
      <Tooltip title="Perform a soft reset. Resets everything as if you had just purchased an Augmentation.">
        <Button startIcon={<RestartAltIcon />} color={color} onClick={handleButtonClick}>
          Soft Reset
        </Button>
      </Tooltip>
      <ConfirmationModal
        onConfirm={onTriggered}
        open={modalOpened}
        onClose={() => setModalOpened(false)}
        confirmationText={"This will perform the same action as installing Augmentations, are you sure?"}
      />
    </>
  );
}
