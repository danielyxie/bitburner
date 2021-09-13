/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI theme
 */

import React from "react";
import { Button as MuiButton, ButtonProps, makeStyles } from "@material-ui/core";
import { colors } from "./Theme";

const useStyles = makeStyles({
  // Tries to emulate StdButton in buttons.scss
  root: {
    backgroundColor: "#333",
    border: "1px solid #000",
    color: colors.primary,
    margin: "5px",
    padding: "3px 5px",
    "&:hover": {
      backgroundColor: "#000",
    },

    borderRadius: 0,
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

export const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <MuiButton
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
    />
  );
};
