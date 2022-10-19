import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { Modal } from "../ui/React/Modal";

let v2ModalOpen = false;

export const openV2Modal = (): void => {
  v2ModalOpen = true;
};

export const V2Modal = (): React.ReactElement => {
  const [open, setOpen] = useState(v2ModalOpen);
  return (
    <Modal open={open} onClose={() => undefined}>
      <Typography>Welcome to bitburner v2.0.0!</Typography>{" "}
      <Typography>While this version does not change the game a lot, it does have quite a few API breaks.</Typography>{" "}
      <Typography>
        A file was added to your home computer called V2_0_0_API_BREAK.txt and it is highly recommended you take a look
        at this file. It explains where most of the API break have occurred.
      </Typography>{" "}
      <Typography>
        You should also take a look at{" "}
        <a
          target="_"
          href="https://github.com/bitburner-official/bitburner-src/blob/dev/doc/source/v2.0.0_migration.rst"
        >
          {" "}
          the migration guide
        </a>{" "}
        as well as{" "}
        <a target="_" href="https://github.com/bitburner-official/bitburner-src/blob/dev/doc/source/changelog.rst">
          the changelog
        </a>
      </Typography>
      <Button onClick={() => setOpen(false)}>I understand</Button>
    </Modal>
  );
};
