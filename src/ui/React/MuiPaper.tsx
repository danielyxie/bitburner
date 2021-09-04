/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI theme
 */

import React from "react";
import { Paper, PaperProps, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    backgroundColor: "rgb(30, 30, 30)",
    border: "2px solid #000",
    borderRadius: "10px",
    display: "inline-block",
    flexWrap: "wrap",
    padding: "10px",
  },
});

export const MuiPaper: React.FC<PaperProps> = (props: PaperProps) => {
  return (
    <Paper
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
    />
  );
};
