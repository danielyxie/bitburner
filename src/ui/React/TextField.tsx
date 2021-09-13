/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI colors
 */

import React from "react";
import { TextField as MuiTF, TextFieldProps, makeStyles } from "@material-ui/core";
import { colors } from "./Theme";

const useStyles = makeStyles({
  // Tries to emulate StdButton in buttons.scss
  root: {
    backgroundColor: "#222",
    color: "white",
    borderRadius: 0,
    "& .MuiInputBase-input": {
      color: colors.primary, // Text color
    },
    "& .MuiInputBase-input::placeholder::before": {
      color: colors.primarydarker,
      userSelect: "none",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: colors.primarydarker,
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: colors.primarydark,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.primary,
    },
    "& .MuiInputLabel-root::before": {
      color: colors.primarydark,
    },
    "& .MuiInputLabel-root": {
      // The little label on the top-right
      color: colors.primarydark, // unfocused
      userSelect: "none",
      "&.Mui-focused": {
        color: colors.primary, // focused
      },
    },
  },
});

export const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  return (
    <MuiTF
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
    />
  );
};
