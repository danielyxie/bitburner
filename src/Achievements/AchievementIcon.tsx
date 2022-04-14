import { Box } from "@mui/material";
import React, { useState } from "react";

import { Settings } from "../Settings/Settings";

import type { Achievement } from "./Achievements";

interface IProps {
  achievement: Achievement;
  unlocked: boolean;
  colorFilters: string;
  size: string;
}

export function AchievementIcon({ achievement, unlocked, colorFilters, size }: IProps): JSX.Element {
  const [imgLoaded, setImgLoaded] = useState(false);
  const mainColor = unlocked ? Settings.theme.primarydark : Settings.theme.secondarydark;

  if (!achievement.Icon) return <></>;
  return (
    <Box
      sx={{
        border: `1px solid ${mainColor}`,
        width: size,
        height: size,
        m: 1,
        visibility: imgLoaded ? "visible" : "hidden",
      }}
    >
      <img
        src={`dist/icons/achievements/${encodeURI(achievement.Icon)}.svg`}
        style={{ filter: colorFilters, width: size, height: size }}
        onLoad={() => setImgLoaded(true)}
        alt={achievement.Name}
      />
    </Box>
  );
}
