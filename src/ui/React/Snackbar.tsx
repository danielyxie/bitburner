import React, { useEffect } from "react";
import { useSnackbar, SnackbarProvider as SB } from "notistack";
import makeStyles from "@mui/styles/makeStyles";
import { EventEmitter } from "../../utils/EventEmitter";
import Alert, { AlertColor } from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import { logBoxBaseZIndex } from "./LogBoxManager";

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export type ToastVariant = AlertColor;

const useStyles = makeStyles(() => ({
  snackbar: {
    // Log popup z-index increments, so let's add a padding to be well above them.
    zIndex: `${logBoxBaseZIndex + 1000} !important` as any,

    "& .MuiAlert-icon": {
      alignSelf: "center",
    },
  },
}));

export function SnackbarProvider(props: IProps): React.ReactElement {
  const classes = useStyles();
  return (
    <SB
      dense
      maxSnack={9}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      autoHideDuration={2000}
      classes={{ containerRoot: classes.snackbar }}
    >
      {props.children}
    </SB>
  );
}

export const SnackbarEvents = new EventEmitter<[string | React.ReactNode, ToastVariant, number | null]>();

export function Snackbar(): React.ReactElement {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() =>
    SnackbarEvents.subscribe((s, variant, duration) => {
      const id = enqueueSnackbar(<Alert severity={variant}>{s}</Alert>, {
        content: (k, m) => <Paper key={k}>{m}</Paper>,
        variant: variant,
        autoHideDuration: duration,
        onClick: () => closeSnackbar(id),
      });
    }),
  );
  return <></>;
}
