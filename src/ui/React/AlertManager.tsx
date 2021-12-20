import React, { useState, useEffect } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const AlertEvents = new EventEmitter<[string | JSX.Element]>();

interface Alert {
  id: string;
  text: string | JSX.Element;
}

let i = 0;
export function AlertManager(): React.ReactElement {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(
    () =>
      AlertEvents.subscribe((text: string | JSX.Element) => {
        const id = i + "";
        i++;
        setAlerts((old) => {
          return [
            ...old,
            {
              id: id,
              text: text,
            },
          ];
        });
      }),
    [],
  );

  useEffect(() => {
    function handle(this: Document, event: KeyboardEvent): void {
      if (event.code === "Escape") {
        setAlerts([]);
      }
    }
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, []);

  function close(): void {
    setAlerts((old) => {
      return old.slice(1, 1e99);
    });
  }

  return (
    <>
      {alerts.length > 0 && (
        <Modal open={true} onClose={close}>
          <Box overflow="scroll" sx={{ overflowWrap: "break-word", whiteSpace: "pre-line" }}>
            <Typography>{alerts[0].text}</Typography>
          </Box>
        </Modal>
      )}
    </>
  );
}
