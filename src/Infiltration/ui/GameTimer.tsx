import LinearProgress from "@mui/material/LinearProgress";
import React, { useState, useEffect } from "react";
import withStyles from "@mui/styles/withStyles";
import { Theme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import { use } from "../../ui/Context";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";

const TimerProgress = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  bar: {
    transition: "none",
    backgroundColor: theme.palette.primary.main,
  },
}))(LinearProgress);

interface IProps {
  millis: number;
  onExpire: () => void;
}

export function GameTimer(props: IProps): React.ReactElement {
  const player = use.Player();
  const [v, setV] = useState(100);
  const totalMillis = (player.hasAugmentation(AugmentationNames.WKSharmonizer, true) ? 1.3 : 1) * props.millis;

  const tick = 200;
  useEffect(() => {
    const intervalId = setInterval(() => {
      setV((old) => {
        if (old <= 0) props.onExpire();
        return old - (tick / totalMillis) * 100;
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
      <TimerProgress variant="determinate" value={v} color="primary" />
    </Grid>
  );
}
