import React, { useEffect, useRef, useState } from "react";
import { ICrossWindowMessageCommand, ICrossWindowMessageUpdate, makeMessage, retrieveMessage } from "../messaging";
import CircularProgress from "@mui/material/CircularProgress";
import { LogWindowContent } from "../LogWindowContent";

export function ForeignLogWindow(): React.ReactElement {
  const ignoredRef = useRef(null);
  const [state, setState] = useState<ICrossWindowMessageUpdate | null>(null);

  useEffect(() => {
    const listener = (e: MessageEvent): void => {
      const data = retrieveMessage<ICrossWindowMessageUpdate>(e.data);
      data && setState(data);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  });

  function messageSender(type: ICrossWindowMessageCommand["command"]): () => void {
    const message: ICrossWindowMessageCommand = { command: type };
    return () => window.opener?.postMessage(makeMessage(message));
  }

  function close(): void {
    messageSender("close")();
    window.close();
  }

  if (!state) {
    return <CircularProgress size={150} color="primary" />;
  }
  return (
    <LogWindowContent
      draggableRef={ignoredRef}
      showLogs={true}
      filename={state.filename}
      args={state.args}
      running={state.running}
      logs={state.logs}
      run={messageSender("run")}
      kill={messageSender("kill")}
      close={close}
    />
  );
}
