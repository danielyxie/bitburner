import React from "react";
import { createTheme, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";

declare module "@mui/styles/defaultTheme" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

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

export const theme = createTheme({
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
  components: {
    MuiInputBase: {
      styleOverrides: {
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
    },

    MuiInput: {
      styleOverrides: {
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
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: colors.primarydark, // why is this switched?
          userSelect: "none",
          "&:before": {
            color: colors.primarylight,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: "#333",
          border: "1px solid " + colors.well,
          // color: colors.primary,
          margin: "5px",
          padding: "3px 5px",
          "&:hover": {
            backgroundColor: colors.black,
          },

          borderRadius: 0,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: {
          color: colors.primary,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          backgroundColor: colors.well,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: colors.primary,
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          backgroundColor: "#111",
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          backgroundColor: colors.black,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: colors.primary,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "1em",
          color: colors.primary,
          backgroundColor: colors.well,
          borderRadius: 0,
          border: "2px solid white",
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        valueLabel: {
          color: colors.primary,
          backgroundColor: colors.well,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
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
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: colors.welllight,
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: colors.primary,
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: colors.primarydark,
        },
        track: {
          backgroundColor: colors.welllight,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: colors.black,
          border: "1px solid " + colors.welllight,
        },
      },
    },
  },
});

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

export const TTheme = ({ children }: IProps): React.ReactElement => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);
