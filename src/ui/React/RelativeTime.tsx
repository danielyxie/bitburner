import { Tooltip, Typography, TypographyProps } from "@mui/material";
import React, { useEffect, useState } from "react";

const rtf = new Intl.RelativeTimeFormat("en", {
  localeMatcher: "best fit", // other values: "lookup"
  numeric: "always", // other values: "auto"
  style: "long", // other values: "short" or "narrow"
});

type UnitsMs = {
  [key: string]: number;
};

// in miliseconds
const units: UnitsMs = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

// https://stackoverflow.com/a/53800501
export const getRelativeTime = (d1: number, d2 = new Date().getTime()): string => {
  const elapsed: number = d1 - d2;

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units) {
    if (Math.abs(elapsed) > units[u] || u == "second") {
      return rtf.format(Math.round(elapsed / units[u]), u as Intl.RelativeTimeFormatUnit);
    }
  }

  return "n/a";
};

interface IProps extends TypographyProps {
  initial: number;
  hideTooltip?: boolean;
  refresh?: boolean;
}

export function RelativeTime({
  initial,
  hideTooltip = false,
  refresh = true,
  ...otherProps
}: IProps): React.ReactElement {
  const current = new Date().getTime();
  const [relativeTime, setRelativeTime] = useState<string>(getRelativeTime(initial, current));

  useEffect(() => {
    if (!refresh) return;
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(initial, new Date().getTime()));
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (hideTooltip) {
    return <span>{relativeTime}</span>;
  }

  return (
    <Tooltip title={new Date(initial).toLocaleString()}>
      <Typography component="span" {...otherProps}>
        {relativeTime}
      </Typography>
    </Tooltip>
  );
}
