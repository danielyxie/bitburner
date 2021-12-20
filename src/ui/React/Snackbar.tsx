import React, { useEffect } from "react";
import { useSnackbar, SnackbarProvider as SB } from "notistack";
import { EventEmitter } from "../../utils/EventEmitter";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export function SnackbarProvider(props: IProps): React.ReactElement {
  return (
    <SB dense maxSnack={9} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} autoHideDuration={2000}>
      {props.children}
    </SB>
  );
}

export const SnackbarEvents = new EventEmitter<[string, "success" | "warning" | "error" | "info", number]>();

export function Snackbar(): React.ReactElement {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() =>
    SnackbarEvents.subscribe((s, variant, duration) =>
      enqueueSnackbar(<Alert severity={variant}>{s}</Alert>, {
        content: (k, m) => <Paper key={k}>{m}</Paper>,
        variant: variant,
        autoHideDuration: duration,
      }),
    ),
  );
  return <></>;
}
