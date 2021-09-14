import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

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
        "&:hover": {
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
    MuiButton: {
      root: {
        backgroundColor: "#333",
        border: "1px solid " + colors.well,
        color: colors.primary,
        margin: "5px",
        padding: "3px 5px",
        "&:hover": {
          backgroundColor: "#000",
        },

        borderRadius: 0,
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
    MuiIconButton: {
      root: {
        color: colors.primary,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
        color: colors.primary,
        backgroundColor: colors.well,
        borderRadius: 0,
        border: "2px solid white",
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
