import React from "react";

import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from "@mui/material";

import { AchievementEntry } from "./AchievementEntry";
import { Achievement,  PlayerAchievement} from "./Achievements";
import { Settings } from "../Settings/Settings"
import { getFiltersFromHex } from "../ThirdParty/colorUtils";
import { CorruptableText } from "../ui/React/CorruptableText";

interface IProps {
  achievements: Achievement[];
  playerAchievements: PlayerAchievement[];
}

export function AchievementList({ achievements, playerAchievements }: IProps): JSX.Element {
  // Need to transform the primary color into css filters to change the color of the SVG.
  const cssPrimary = getFiltersFromHex(Settings.theme.primary);
  const cssSecondary = getFiltersFromHex(Settings.theme.secondary);

  const data = achievements.map(achievement => ({
    achievement,
    unlockedOn: playerAchievements.find(playerAchievement => playerAchievement.ID === achievement.ID)?.unlockedOn,
  })).sort((a, b) => (b.unlockedOn ?? 0) - (a.unlockedOn ?? 0));

  const unlocked = data.filter(entry => entry.unlockedOn);

  // Hidden achievements
  const secret = data.filter(entry => !entry.unlockedOn && entry.achievement.Secret)

  // Locked behind locked content (bitnode x)
  const unavailable = data.filter(entry => !entry.unlockedOn && !entry.achievement.Secret && entry.achievement.Visible && entry.achievement.Visible());

  // Remaining achievements
  const locked = data
    .filter(entry => !unlocked.map(u => u.achievement.ID).includes(entry.achievement.ID))
    .filter(entry => !secret.map(u => u.achievement.ID).includes(entry.achievement.ID))
    .filter(entry => !unavailable.map(u => u.achievement.ID).includes(entry.achievement.ID));

  return (
    <Box sx={{ pr: 18, my: 2 }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
      }}>
        {unlocked.length > 0 && (
          <Accordion defaultExpanded disableGutters square>
            <AccordionSummary>
              <Typography variant="h5" sx={{ my: 1 }}>
                Acquired ({unlocked.length}/{data.length})
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
              {unlocked.map(item => (
                <AchievementEntry key={item.achievement.ID}
                  achievement={item.achievement}
                  unlockedOn={item.unlockedOn}
                  cssFiltersUnlocked={cssPrimary}
                  cssFiltersLocked={cssSecondary} />
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {locked.length > 0 && (
          <Accordion disableGutters square>
            <AccordionSummary>
              <Typography variant="h5" color="secondary">
                Locked ({locked.length} remaining)
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 2 }}>
              {locked.map(item => (
                <AchievementEntry key={item.achievement.ID}
                  achievement={item.achievement}
                  cssFiltersUnlocked={cssPrimary}
                  cssFiltersLocked={cssSecondary} />
              ))}
            </AccordionDetails>
          </Accordion>
        )}

        {unavailable.length > 0 && (
          <Accordion disableGutters square>
            <AccordionSummary>
              <Typography variant="h5" color="secondary">
                Unavailable ({unavailable.length} remaining)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
            <Typography sx={{ mt: 1 }}>
                {unavailable.length} additional achievements hidden behind content you don't have access to.
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}

        {secret.length > 0 && (
          <Accordion disableGutters square>
            <AccordionSummary>
              <Typography variant="h5" color="secondary">
                Secret ({secret.length} remaining)
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="secondary" sx={{ mt: 1 }}>
                {secret.map(item => (
                  <>
                    <CorruptableText content={item.achievement.ID}></CorruptableText>
                    <br />
                  </>
                ))}
              </Typography>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Box>
  );
}
