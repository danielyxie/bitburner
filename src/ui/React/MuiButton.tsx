/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI theme
 */

import React from "react";
import { Button, ButtonProps, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  // Tries to emulate StdButton in buttons.scss
  root: {
    backgroundColor: "#555",
    border: "1px solid #333",
    color: "white",
    margin: "5px",
    padding: "3px 5px",
    "&:hover": {
      backgroundColor: "#666",
    },
  },
  textPrimary: {
    color: "rgb( 144, 202, 249)",
  },
  textSecondary: {
    color: "rgb(244, 143, 177)",
  },
  disabled: {
    backgroundColor: "#333",
    color: "#fff",
    cursor: "default",
  },
});

export const MuiButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <Button
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
    />
  );
};
