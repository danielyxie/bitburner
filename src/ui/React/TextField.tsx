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
    backgroundColor: colors.well,
    color: "white",
    borderRadius: 0,
    "& .MuiInputBase-input": {
      color: colors.primarylight, // Text color
    },
    "& .MuiInputBase-input::placeholder::before": {
      color: colors.primarydark,
      userSelect: "none",
    },
    "& .MuiInput-underline:before": {
      borderBottomColor: colors.primarydark,
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: colors.primary,
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: colors.primarylight,
    },
    "& .MuiInputLabel-root::before": {
      color: colors.primary,
    },
    "& .MuiInputLabel-root": {
      // The little label on the top-right
      color: colors.primary, // unfocused
      userSelect: "none",
      "&.Mui-focused": {
        color: colors.primarylight, // focused
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
