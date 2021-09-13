import React from "react";
import { createMuiTheme } from "@material-ui/core/styles";

import { ThemeProvider } from "@material-ui/core/styles";

export const colors = {
  primary: "#0f0",
  primarydark: "#090",
  primarydarker: "#030",
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
});

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

export const Theme = ({ children }: IProps): React.ReactElement => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
);
