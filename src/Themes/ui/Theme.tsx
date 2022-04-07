import React from "react";
import { createTheme, ThemeProvider, Theme, StyledEngineProvider } from "@mui/material/styles";
import { EventEmitter } from "../../utils/EventEmitter";
import { Settings } from "../../Settings/Settings";

export const ThemeEvents = new EventEmitter<[]>();

declare module "@mui/material/styles" {
  interface Theme {
    colors: {
      hp: React.CSSProperties["color"];
      money: React.CSSProperties["color"];
      hack: React.CSSProperties["color"];
      combat: React.CSSProperties["color"];
      cha: React.CSSProperties["color"];
      int: React.CSSProperties["color"];
      rep: React.CSSProperties["color"];
      backgroundprimary: React.CSSProperties["color"];
      backgroundsecondary: React.CSSProperties["color"];
      button: React.CSSProperties["color"];
      successlight: React.CSSProperties["color"];
      success: React.CSSProperties["color"];
      successdark: React.CSSProperties["color"];
      white: React.CSSProperties["color"];
      black: React.CSSProperties["color"];
    };
  }
  interface ThemeOptions {
    colors: {
      hp: React.CSSProperties["color"];
      money: React.CSSProperties["color"];
      hack: React.CSSProperties["color"];
      combat: React.CSSProperties["color"];
      cha: React.CSSProperties["color"];
      int: React.CSSProperties["color"];
      rep: React.CSSProperties["color"];
      backgroundprimary: React.CSSProperties["color"];
      backgroundsecondary: React.CSSProperties["color"];
      button: React.CSSProperties["color"];
      successlight: React.CSSProperties["color"];
      success: React.CSSProperties["color"];
      successdark: React.CSSProperties["color"];
      white: React.CSSProperties["color"];
      black: React.CSSProperties["color"];
    };
  }
}

let theme: Theme;

export function refreshTheme(): void {
  theme = createTheme({
    colors: {
      hp: Settings.theme.hp,
      money: Settings.theme.money,
      hack: Settings.theme.hack,
      combat: Settings.theme.combat,
      cha: Settings.theme.cha,
      int: Settings.theme.int,
      rep: Settings.theme.rep,
      backgroundprimary: Settings.theme.backgroundprimary,
      backgroundsecondary: Settings.theme.backgroundsecondary,
      button: Settings.theme.button,
      successlight: Settings.theme.successlight,
      success: Settings.theme.success,
      successdark: Settings.theme.successdark,
      white: Settings.theme.white,
      black: Settings.theme.black,
    },
    palette: {
      primary: {
        light: Settings.theme.primarylight,
        main: Settings.theme.primary,
        dark: Settings.theme.primarydark,
      },
      secondary: {
        light: Settings.theme.secondarylight,
        main: Settings.theme.secondary,
        dark: Settings.theme.secondarydark,
      },
      error: {
        light: Settings.theme.errorlight,
        main: Settings.theme.error,
        dark: Settings.theme.errordark,
      },
      info: {
        light: Settings.theme.infolight,
        main: Settings.theme.info,
        dark: Settings.theme.infodark,
      },
      warning: {
        light: Settings.theme.warninglight,
        main: Settings.theme.warning,
        dark: Settings.theme.warningdark,
      },
      success: {
        light: Settings.theme.successlight,
        main: Settings.theme.success,
        dark: Settings.theme.successdark,
      },
      background: {
        default: Settings.theme.backgroundprimary,
        paper: Settings.theme.well,
      },
      action: {
        disabled: Settings.theme.disabled,
      },
    },
    typography: {
      fontFamily: Settings.styles.fontFamily,
      button: {
        textTransform: "none",
      },
    },
    components: {
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: Settings.theme.well,
            color: Settings.theme.primary,
          },
          input: {
            "&::placeholder": {
              userSelect: "none",
              color: Settings.theme.primarydark,
            },
          },
        },
      },

      MuiInput: {
        styleOverrides: {
          root: {
            backgroundColor: Settings.theme.well,
            borderBottomColor: "#fff",
          },
          underline: {
            "&:hover": {
              borderBottomColor: Settings.theme.primarydark,
            },
            "&:before": {
              borderBottomColor: Settings.theme.primary,
            },
            "&:after": {
              borderBottomColor: Settings.theme.primarylight,
            },
          },
        },
      },

      MuiInputLabel: {
        styleOverrides: {
          root: {
            color: Settings.theme.primarydark, // why is this switched?
            userSelect: "none",
            "&:before": {
              color: Settings.theme.primarylight,
            },
          },
        },
      },

      MuiButtonGroup: {
        styleOverrides: {
          root: {
            "& .MuiButton-root:not(:last-of-type)": {
              marginRight: "1px",
            },
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: Settings.theme.button,
            border: "1px solid " + Settings.theme.well,
            // color: Settings.theme.primary,
            "&:hover": {
              backgroundColor: Settings.theme.backgroundsecondary,
            },

            borderRadius: 0,
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          icon: {
            color: Settings.theme.primary,
          },
        },
        defaultProps: {
          variant: "standard",
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: "standard",
        },
      },
      MuiTypography: {
        defaultProps: {
          color: "primary",
        },
        styleOverrides: {
          root: {
            lineHeight: Settings.styles.lineHeight,
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          list: {
            backgroundColor: Settings.theme.well,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: Settings.theme.primary,
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
            backgroundColor: Settings.theme.backgroundsecondary,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: Settings.theme.primary,
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            fontSize: "1em",
            color: Settings.theme.primary,
            backgroundColor: Settings.theme.well,
            borderRadius: 0,
            border: "2px solid white",
            maxWidth: "100vh",
          },
        },
        defaultProps: {
          disableInteractive: true,
        },
      },
      MuiSlider: {
        styleOverrides: {
          valueLabel: {
            color: Settings.theme.primary,
            backgroundColor: Settings.theme.well,
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
            backgroundColor: Settings.theme.backgroundsecondary,
          },
          paperAnchorDockedLeft: {
            borderRight: "1px solid " + Settings.theme.welllight,
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            backgroundColor: Settings.theme.welllight,
          },
        },
      },
      MuiFormControlLabel: {
        styleOverrides: {
          root: {
            color: Settings.theme.primary,
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          switchBase: {
            color: Settings.theme.primarydark,
          },
          track: {
            backgroundColor: Settings.theme.welllight,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 0,
            backgroundColor: Settings.theme.backgroundsecondary,
            border: "1px solid " + Settings.theme.welllight,
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          select: {
            color: Settings.theme.primary,
          },
          selectLabel: {
            color: Settings.theme.primary,
          },
          displayedRows: {
            color: Settings.theme.primary,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          textColorPrimary: {
            color: Settings.theme.secondary,
            "&.Mui-selected": {
              color: Settings.theme.primary,
            },
          },
          root: {
            backgroundColor: Settings.theme.backgroundsecondary,
            border: "1px solid " + Settings.theme.well,
            margin: "3px",

            "&.Mui-selected": {
              backgroundColor: Settings.theme.button,
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          scrollButtons: {
            backgroundColor: Settings.theme.backgroundsecondary,
            color: Settings.theme.secondary,
            margin: "3px",
            opacity: 1,
            width: "fit-content",

            "&.Mui-disabled": {
              opacity: 0.5,
            },
          },
        },
        defaultProps: {
          TabIndicatorProps: {
            style: {
              display: "none",
            },
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            backgroundColor: Settings.theme.black,
            borderRadius: 0,
            border: "1px solid " + Settings.theme.well,
          },
          standardSuccess: {
            color: Settings.theme.successlight,
          },
          standardError: {
            color: Settings.theme.errorlight,
          },
          standardWarning: {
            color: Settings.theme.warninglight,
          },
          standardInfo: {
            color: Settings.theme.infolight,
          },
        },
      },
    },
  });

  document.body.style.backgroundColor = theme.colors.backgroundprimary?.toString() ?? "black";
}
refreshTheme();

interface IProps {
  children: JSX.Element[] | JSX.Element;
}

export const TTheme = ({ children }: IProps): React.ReactElement => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </StyledEngineProvider>
);
