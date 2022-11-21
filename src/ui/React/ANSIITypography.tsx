import { Typography } from "@mui/material";
import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import { Theme } from "@mui/material/styles";
import { Settings } from "../../Settings/Settings";

// This particular eslint-disable is correct.
// In this super specific weird case we in fact do want a regex on an ANSII character.
// eslint-disable-next-line no-control-regex
const ANSI_ESCAPE = new RegExp("\u{001b}\\[(?<code>.*?)m", "ug");

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    success: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.colors.success,
      "--padForFlushBg": (Settings.styles.lineHeight - 1) / 2 + "em",
    },
    error: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.error.main,
      "--padForFlushBg": (Settings.styles.lineHeight - 1) / 2 + "em",
    },
    primary: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.primary.main,
      "--padForFlushBg": (Settings.styles.lineHeight - 1) / 2 + "em",
    },
    info: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.info.main,
      "--padForFlushBg": (Settings.styles.lineHeight - 1) / 2 + "em",
    },
    warning: {
      whiteSpace: "pre-wrap",
      overflowWrap: "anywhere",
      margin: theme.spacing(0),
      color: theme.palette.warning.main,
      "--padForFlushBg": (Settings.styles.lineHeight - 1) / 2 + "em",
    },
  }),
);

const lineClass = (classes: Record<string, string>, s: string): string => {
  const lineClassMap: Record<string, string> = {
    error: classes.error,
    success: classes.success,
    info: classes.info,
    warn: classes.warning,
  };
  return lineClassMap[s] || classes.primary;
};

interface IProps {
  text: unknown;
  color: "primary" | "error" | "success" | "info" | "warn";
}

export const ANSIITypography = React.memo((props: IProps): React.ReactElement => {
  const text = String(props.text);
  const classes = useStyles();
  const parts = [];

  // Build a look-alike regex match to place at the front of the matches list
  const INITIAL = {
    0: "",
    index: 0,
    groups: { code: null },
  };
  const matches = [INITIAL, ...text.matchAll(ANSI_ESCAPE), null];
  if (matches.length > 2) {
    matches.slice(0, -1).forEach((m, i) => {
      const n = matches[i + 1];
      if (!m || m.index === undefined || m.groups === undefined) {
        return;
      }
      const startIndex = m.index + m[0].length;
      const stopIndex = n ? n.index : text.length;
      const partText = text.slice(startIndex, stopIndex);
      if (startIndex !== stopIndex) {
        // Don't generate "empty" spans
        parts.push({ code: m.groups.code, text: partText });
      }
    });
  }
  if (parts.length === 0) {
    // For example, if the string was empty or there were no escape sequence matches
    parts.push({ code: null, text: text });
  }
  return (
    <Typography classes={{ root: lineClass(classes, props.color) }} paragraph={false}>
      {parts.map((part, i) => (
        <span key={i} style={ansiCodeStyle(part.code)}>
          {part.text}
        </span>
      ))}
    </Typography>
  );
});

function ansiCodeStyle(code: string | null): Record<string, any> {
  // The ANSI colors actually have the dark color set as default and require extra work to get
  //  bright colors.  But these are rarely used or, if they are, are often re-mapped by the
  //  terminal emulator to brighter colors.  So for foreground colors we use the bright color set
  //  and for background colors we use the dark color set.  Of course, all colors are available
  //  via the longer ESC[n8;5;c] sequence (n={3,4}, c=color).  Ideally, these 8-bit maps could
  //  be managed in the user preferences/theme.
  const COLOR_MAP_BRIGHT: Record<number, string> = {
    0: "#404040",
    1: "#ff0000",
    2: "#00ff00",
    3: "#ffff00",
    4: "#0000ff",
    5: "#ff00ff",
    6: "#00ffff",
    7: "#ffffff",
  };
  const COLOR_MAP_DARK: Record<number, string> = {
    8: "#000000",
    9: "#800000",
    10: "#008000",
    11: "#808000",
    12: "#000080",
    13: "#800080",
    14: "#008080",
    15: "#c0c0c0",
  };

  const ansi2rgb = (code: number): string => {
    /* eslint-disable yoda */
    if (0 <= code && code < 8) {
      // x8 RGB
      return COLOR_MAP_BRIGHT[code];
    }
    if (8 <= code && code < 16) {
      // x8 RGB - "High Intensity" (but here, actually the dark set)
      return COLOR_MAP_DARK[code];
    }
    if (16 <= code && code < 232) {
      // x216 RGB
      const base = code - 16;
      const ir = Math.floor(base / 36);
      const ig = Math.floor((base % 36) / 6);
      const ib = Math.floor((base % 6) / 1);
      const r = ir <= 0 ? 0 : 55 + ir * 40;
      const g = ig <= 0 ? 0 : 55 + ig * 40;
      const b = ib <= 0 ? 0 : 55 + ib * 40;
      return `rgb(${r}, ${g}, ${b})`;
    }
    if (232 <= code && code < 256) {
      // x32 greyscale
      const base = code - 232;
      const grey = base * 10 + 8;
      return `rgb(${grey}, ${grey}, ${grey})`;
    }
    // shouldn't get here (under normal circumstances), but just in case
    return "initial";
  };

  type styleKey = "fontWeight" | "textDecoration" | "color" | "backgroundColor" | "padding";
  const style: {
    fontWeight?: string;
    textDecoration?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
  } = {};

  if (code === null || code === "0") {
    return style;
  }

  const codeParts = code
    .split(";")
    .map((p) => parseInt(p))
    .filter(
      (p, i, arr) =>
        // If the sequence is 38;5 (x256 foreground color) or 48;5 (x256 background color),
        //  filter out the 5 so the next codePart after {38,48} is the color code.
        p != 5 || i == 0 || (arr[i - 1] != 38 && arr[i - 1] != 48),
    );

  let nextStyleKey: styleKey | null = null;
  codeParts.forEach((codePart) => {
    /* eslint-disable yoda */
    if (nextStyleKey !== null) {
      style[nextStyleKey] = ansi2rgb(codePart);
      nextStyleKey = null;
    }
    // Decorations
    else if (codePart == 1) {
      style.fontWeight = "bold";
    } else if (codePart == 4) {
      style.textDecoration = "underline";
    }
    // Foreground Color (x8)
    else if (30 <= codePart && codePart < 38) {
      if (COLOR_MAP_BRIGHT[codePart % 10]) {
        style.color = COLOR_MAP_BRIGHT[codePart % 10];
      }
    }
    // Background Color (x8)
    else if (40 <= codePart && codePart < 48) {
      if (COLOR_MAP_DARK[codePart % 10]) {
        style.backgroundColor = COLOR_MAP_DARK[codePart % 10];
      }
    }
    // Foreground Color (x256)
    else if (codePart == 38) {
      nextStyleKey = "color";
    }
    // Background Color (x256)
    else if (codePart == 48) {
      nextStyleKey = "backgroundColor";
    }
  });
  // If a background color is set, add slight padding to increase the background fill area.
  // This was previously display:inline-block, but that has display errors when line breaks are used.
  if (style.backgroundColor) {
    style.padding = "var(--padForFlushBg) 0px";
  }
  return style;
}
