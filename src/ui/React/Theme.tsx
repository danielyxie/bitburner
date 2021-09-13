import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";

import { ThemeProvider } from "@material-ui/core/styles";

export const colors = {
  primarylight: "#0f0",
  primary: "#0c0",
  primarydark: "#090",
  well: "#222",
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: colors.primary,
      dark: colors.primarydark,
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
  overrides: {
    MuiInputBase: {
      root: {
        backgroundColor: colors.well,
      },
    },
  },
});

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

export const Theme = ({ children }: IProps): React.ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
