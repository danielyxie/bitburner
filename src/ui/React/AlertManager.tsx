import React, { useState, useEffect } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { Modal } from "./Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { sha256 } from "js-sha256";

export const AlertEvents = new EventEmitter<[string | JSX.Element]>();

interface Alert {
  id: string;
  text: string | JSX.Element;
  hash: string;
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
          const hash = getMessageHash(text);
          if (old.some((a) => a.hash === hash)) {
            console.log("Duplicate message");
            return old;
          }
          return [
            ...old,
            {
              id: id,
              text: text,
              hash: hash,
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

  function getMessageHash(text: string | JSX.Element): string {
    if (typeof text === "string") return sha256(text);
    return sha256(JSON.stringify(text.props));
  }

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
            <Typography component={'span'}>{alerts[0].text}</Typography>
          </Box>
        </Modal>
      )}
    </>
  );
}
