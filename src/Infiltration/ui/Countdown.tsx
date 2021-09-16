import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";

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
          <h1>Get Ready!</h1>
          <h1>{x}</h1>
        </Grid>
      </Grid>
    </>
  );
}
