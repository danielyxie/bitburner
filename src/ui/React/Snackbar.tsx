import React, { useState, useEffect } from "react";

import { Snackbar as S } from "@mui/material";
import { EventEmitter } from "../../utils/EventEmitter";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export const GameSavedEvents = new EventEmitter<[]>();

export function Snackbar(): React.ReactElement {
  const [open, setOpen] = useState(false);

  useEffect(() => GameSavedEvents.subscribe(() => setOpen(true)));
  return (
    <S
      open={open}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      autoHideDuration={2000}
      onClose={() => setOpen(false)}
    >
      <Paper sx={{ p: 2 }}>
        <Typography>Game Saved!</Typography>
      </Paper>
    </S>
  );
}
