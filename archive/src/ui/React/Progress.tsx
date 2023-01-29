import LinearProgress from "@mui/material/LinearProgress";
import { Theme } from "@mui/material/styles";
import withStyles from "@mui/styles/withStyles";

export const ProgressBar = withStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  bar: {
    transition: "none",
    backgroundColor: theme.palette.primary.main,
  },
}))(LinearProgress);
