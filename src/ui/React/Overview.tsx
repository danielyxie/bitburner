import React, { useState } from "react";

import makeStyles from "@mui/styles/makeStyles";
import Collapse from "@mui/material/Collapse";
import Fab from "@mui/material/Fab";
import Paper from "@mui/material/Paper";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { use } from "../Context";
import { Page } from "../Router";

const useStyles = makeStyles({
  visibilityToggle: {
    backgroundColor: "transparent",
    position: "absolute",
    top: "100%",
    right: 0,
  },
  overviewContainer: {
    position: "fixed",
    top: 0,
    right: 0,
    zIndex: 1500,
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
  },
});

interface IProps {
  children: JSX.Element[] | JSX.Element | React.ReactElement[] | React.ReactElement;
}

export function Overview({ children }: IProps): React.ReactElement {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  const router = use.Router();
  if (router.page() === Page.BitVerse || router.page() === Page.Loading) return <></>;
  let icon;
  if (open) {
    icon = <VisibilityOffIcon color="primary" />;
  } else {
    icon = <VisibilityIcon color="primary" />;
  }

  return (
    <Paper square classes={{ root: classes.overviewContainer }}>
      <Collapse in={open}>{children}</Collapse>
      <Fab size="small" classes={{ root: classes.visibilityToggle }} onClick={() => setOpen((old) => !old)}>
        {icon}
      </Fab>
    </Paper>
  );
}