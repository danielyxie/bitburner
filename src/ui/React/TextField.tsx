/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI colors
 */

import React from "react";
import { TextField as MuiTF, TextFieldProps, makeStyles } from "@material-ui/core";
import { colors } from "./Theme";

export const TextField: React.FC<TextFieldProps> = (props: TextFieldProps) => {
  return (
    <MuiTF
      {...props}
      classes={{
        ...props.classes,
      }}
    />
  );
};
