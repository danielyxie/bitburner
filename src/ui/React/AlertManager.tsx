import React, { useState, useEffect } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";

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

  function close(): void {
    console.log("close");
    setAlerts((old) => {
      return old.slice(0, -1);
    });
  }

  return (
    <>
      {alerts.length > 0 && (
        <Modal open={true} onClose={close}>
          <Typography>{alerts[0].text}</Typography>
        </Modal>
      )}
    </>
  );
}
