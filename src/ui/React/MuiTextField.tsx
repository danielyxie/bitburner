/**
 * Wrapper around material-ui's TextField component that styles it with
 * Bitburner's UI theme
 */

import React from "react";
import { TextField, TextFieldProps } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const backgroundColorStyles = {
  backgroundColor: "rgba(57, 54, 54, 0.9)",
  "&:hover": {
    backgroundColor: "rgba(70, 70, 70, 0.9)",
  },
};

const formControlStyles = {
  border: "1px solid #e2e2e1",
  overflow: "hidden",
  borderRadius: 4,
  color: "white",
  ...backgroundColorStyles,
};

const useStyles = makeStyles({
  root: {
    ...formControlStyles,
  },
});

const useInputStyles = makeStyles({
  root: {
    ...backgroundColorStyles,
    color: "white",
  },
  focused: {
    backgroundColor: "rgba(70, 70, 70, 0.9)",
  },
  disabled: {
    color: "white",
  },
});

const useLabelStyles = makeStyles({
  root: {
    color: "white",
  },
  focused: {
    color: "white !important", // Need important to override styles from FormLabel
  },
  disabled: {
    color: "white !important", // Need important to override styles from FormLabel
  },
});

export const MuiTextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
      InputProps={{
        classes: {
          ...useInputStyles(),
          ...props.InputProps?.classes,
        },
        ...props.InputProps,
      }}
      InputLabelProps={{
        classes: {
          ...useLabelStyles(),
          ...props.InputLabelProps?.classes,
        },
        ...props.InputLabelProps,
      }}
    />
  );
};
