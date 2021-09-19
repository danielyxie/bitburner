import React, { useState } from "react";

import makeStyles from "@mui/styles/makeStyles";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Fab from "@mui/material/Fab";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const useStyles = makeStyles({
  nobackground: {
    backgroundColor: "#0000",
  },
});

interface IProps {
  children: JSX.Element[] | JSX.Element | React.ReactElement[] | React.ReactElement;
}

export function Overview({ children }: IProps): React.ReactElement {
  const [open, setOpen] = useState(true);
  const classes = useStyles();
  return (
    <div style={{ position: "fixed", top: 0, right: 0, zIndex: 1500 }}>
      <Box display="flex" justifyContent="flex-end" flexDirection={"column"}>
        <Collapse in={open}>{children}</Collapse>
        <Box display="flex" justifyContent="flex-end">
          <Fab classes={{ root: classes.nobackground }} onClick={() => setOpen((old) => !old)}>
            <VisibilityOffIcon color="primary" />
          </Fab>
        </Box>
      </Box>
    </div>
  );
}
