import React, { useState, useEffect } from "react";
import { Typography, Paper } from "@mui/material";

interface IProps {
  onFinish: () => void;
}

export function Countdown(props: IProps): React.ReactElement {
  const [x, setX] = useState(3);
  useEffect(() => {
    if (x === 0) {
      props.onFinish();
      return;
    }
    setTimeout(() => setX(x - 1), 300);
  });

  return (
    <Paper sx={{ p: 1, textAlign: "center" }}>
      <Typography variant="h4">Get Ready!</Typography>
      <Typography variant="h4">{x}</Typography>
    </Paper>
  );
}
