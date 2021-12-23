import React, { useState, useEffect } from "react";
import { EventEmitter } from "../../utils/EventEmitter";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

export const PromptEvent = new EventEmitter<[Prompt]>();

interface Prompt {
  txt: string;
  resolve: (result: boolean) => void;
}

export function PromptManager(): React.ReactElement {
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  useEffect(
    () =>
      PromptEvent.subscribe((p: Prompt) => {
        setPrompt(p);
      }),
    [],
  );

  function close(): void {
    if (prompt === null) return;
    prompt.resolve(false);
    setPrompt(null);
  }

  function yes(): void {
    if (prompt === null) return;
    prompt.resolve(true);
    setPrompt(null);
  }
  function no(): void {
    if (prompt === null) return;
    prompt.resolve(false);
    setPrompt(null);
  }

  return (
    <>
      {prompt != null && (
        <Modal open={true} onClose={close}>
          <Typography>{prompt.txt}</Typography>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '10px' }}>
            <Button style={{ marginRight: 'auto' }} onClick={yes}>Yes</Button>
            <Button onClick={no}>No</Button>
          </div>
        </Modal>
      )}
    </>
  );
}
