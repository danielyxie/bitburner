import React from "react";

import { Box, Typography } from "@mui/material";

import { Achievement } from "./Achievements";
import { Settings } from "../Settings/Settings"
import { AchievementIcon } from "./AchievementIcon";

interface IProps {
  achievement: Achievement;
  unlockedOn?: number;
  cssFiltersUnlocked: string;
  cssFiltersLocked: string;
}

export function AchievementEntry({ achievement, unlockedOn, cssFiltersUnlocked, cssFiltersLocked }: IProps): JSX.Element {
  if (!achievement) return <></>;
  const isUnlocked = !!unlockedOn;

  const mainColor = isUnlocked ? Settings.theme.primary : Settings.theme.secondarylight;

  let achievedOn = '';
  if (unlockedOn) {
    achievedOn = new Date(unlockedOn).toLocaleString();
  }

  return (
    <Box sx={{
      border: `1px solid ${Settings.theme.well}`, mb: 2
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
        <AchievementIcon
          achievement={achievement} unlocked={isUnlocked} size="72px"
          colorFilters={isUnlocked ? cssFiltersUnlocked: cssFiltersLocked} />
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 1
        }}>
          <Typography variant="h6" sx={{ color: mainColor}}>
            {achievement.Name}
          </Typography>
          <Typography variant="body2" sx={{ maxWidth: '500px', color: mainColor}}>
            {achievement.Description}
          </Typography>
          {isUnlocked && (
            <Typography variant="caption" sx={{ fontSize: '12px', color: Settings.theme.primarydark }}>
              Acquired on {achievedOn}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
