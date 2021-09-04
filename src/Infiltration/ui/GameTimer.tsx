import LinearProgress from "@material-ui/core/LinearProgress";
import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

const TimerProgress = withStyles(() => ({
  bar: {
    transition: "none",
    backgroundColor: "#adff2f",
  },
}))(LinearProgress);

interface IProps {
  millis: number;
  onExpire: () => void;
}

export function GameTimer(props: IProps): React.ReactElement {
  const [v, setV] = useState(100);

  const tick = 200;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setV((old) => {
        if (old <= 0) props.onExpire();
        return old - (tick / props.millis) * 100;
      });
    }, tick);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // https://stackoverflow.com/questions/55593367/disable-material-uis-linearprogress-animation
  // TODO(hydroflame): there's like a bug where it triggers the end before the
  // bar physically reaches the end
  return (
    <Grid item xs={12}>
      <TimerProgress variant="determinate" value={v} />
    </Grid>
  );
}
