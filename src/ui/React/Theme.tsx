import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

export const colors = {
  primarylight: "#0f0",
  primary: "#0c0",
  primarydark: "#090",

  errorlight: "#f00",
  error: "#c00",
  errordark: "#900",

  secondarylight: "#AAA",
  secondary: "#888",
  secondarydark: "#666",

  welllight: "#444",
  well: "#222",
  white: "#fff",
  black: "#000",

  hp: "#dd3434",
  money: "#ffd700",
  hack: "#adff2f",
  combat: "#faffdf",
  cha: "#a671d1",
  int: "#6495ed",
};

export const theme = createMuiTheme({
  palette: {
    primary: {
      light: colors.primarylight,
      main: colors.primary,
      dark: colors.primarydark,
    },
    secondary: {
      light: colors.secondarylight,
      main: colors.secondary,
      dark: colors.secondarydark,
    },
    error: {
      light: colors.errorlight,
      main: colors.error,
      dark: colors.errordark,
    },
    background: {
      paper: colors.well,
    },
  },
  typography: {
    fontFamily: "monospace",
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
          backgroundColor: colors.black,
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
        backgroundColor: colors.black,
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
    MuiSvgIcon: {
      root: {
        color: colors.primary,
      },
    },
    MuiDrawer: {
      paper: {
        "&::-webkit-scrollbar": {
          // webkit
          display: "none",
        },
        scrollbarWidth: "none", // firefox
        backgroundColor: colors.black,
      },
      paperAnchorDockedLeft: {
        borderRight: "1px solid " + colors.welllight,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: colors.welllight,
      },
    },
    MuiFormControlLabel: {
      root: {
        color: colors.primary,
      },
    },
    MuiSwitch: {
      switchBase: {
        color: colors.primarydark,
      },
      track: {
        backgroundColor: colors.welllight,
      },
    },
    MuiPaper: {
      root: {
        backgroundColor: colors.black,
        border: "1px solid " + colors.welllight,
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
