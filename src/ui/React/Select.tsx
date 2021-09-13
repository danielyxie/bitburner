/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI theme
 */

import React from "react";
import { Select as MuiSelect, SelectProps, makeStyles } from "@material-ui/core";
import { colors } from "./Theme";

const useStyles = makeStyles({
  // Tries to emulate StdButton in buttons.scss
  root: {
    backgroundColor: "#222",
    color: colors.primarydark,
    margin: "5px",
    padding: "3px 5px",
    "&:hover": {
      backgroundColor: "#222",
    },

    borderRadius: 0,
  },
});

export const Select: React.FC<SelectProps> = (props: SelectProps) => {
  return (
    <MuiSelect
      native
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
    />
  );
};
