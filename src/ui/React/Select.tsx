/**
 * Wrapper around material-ui's Button component that styles it with
 * Bitburner's UI theme
 */

import React from "react";
import { Select as MuiSelect, SelectProps } from "@mui/material";
import { Theme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.dark,
      margin: "5px",
      padding: "3px 5px",
      "&:after": {
        backgroundColor: theme.palette.background.paper,
      },

      borderRadius: 0,
    },
  }),
);

export const Select: React.FC<SelectProps> = (props: SelectProps) => {
  return (
    <MuiSelect
      {...props}
      classes={{
        ...useStyles(),
        ...props.classes,
      }}
    />
  );
};
