import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

import Typography from "@mui/material/Typography";
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
    setTimeout(() => setX(x - 1), 200);
  });

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Get Ready!</Typography>
          <Typography variant="h4">{x}</Typography>
        </Grid>
      </Grid>
    </>
  );
}
