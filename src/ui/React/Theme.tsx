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
      input: {
        color: colors.primary,
        "&::placeholder": {
          userSelect: "none",
          color: colors.primarydark,
        },
      },
    },
    MuiInput: {
      root: {
        backgroundColor: colors.well,
        borderBottomColor: "#fff",
      },
      underline: {
        "&:hover:before": {
          borderBottomColor: colors.primarydark,
        },
        "&:before": {
          borderBottomColor: colors.primary,
        },
        "&:after": {
          borderBottomColor: colors.primarylight,
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: colors.primarydark, // why is this switched?
        userSelect: "none",
        "&:before": {
          color: colors.primarylight,
        },
      },
    },
    MuiSelect: {
      icon: {
        color: colors.primary,
      },
    },
    MuiMenu: {
      list: {
        backgroundColor: colors.well,
      },
    },
    MuiMenuItem: {
      root: {
        color: colors.primary,
      },
    },
    MuiAccordionSummary: {
      root: {
        backgroundColor: "#111",
      },
    },
    MuiAccordionDetails: {
      root: {
        backgroundColor: "#000",
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
