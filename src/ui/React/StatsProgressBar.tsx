import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { TableCell, Tooltip, Typography } from "@mui/material";
import { characterOverviewStyles } from "./CharacterOverview";
import { ISkillProgress } from "src/PersonObjects/formulas/skill";
import { numeralWrapper } from "../numeralFormat";

interface IProgressProps {
  min: number;
  max: number;
  current: number;
  progress: number;
  color?: React.CSSProperties["color"];
}

interface IStatsOverviewCellProps {
  progress: ISkillProgress;
  color?: React.CSSProperties["color"];
}

export function StatsProgressBar({ min, max, current, progress, color }: IProgressProps): React.ReactElement {
  const tooltip = (
    <Typography sx={{ textAlign: 'right' }}>
      <strong>Progress:</strong>&nbsp;
      {numeralWrapper.formatExp(current - min)} / {numeralWrapper.formatExp(max - min)}
      <br />
      <strong>Remaining:</strong>&nbsp;
      {numeralWrapper.formatExp(max - current)} ({progress.toFixed(2)}%)
    </Typography>
  );

  return (
    <Tooltip title={tooltip}>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: "#111111",
          "& .MuiLinearProgress-bar1Determinate": {
            backgroundColor: color,
          },
        }}
      />
    </Tooltip>
  );
}

export function StatsProgressOverviewCell({ progress: skill, color }: IStatsOverviewCellProps): React.ReactElement {
  const classes = characterOverviewStyles();
  return (
    <TableCell
      component="th"
      scope="row"
      colSpan={2}
      classes={{ root: classes.cellNone }}
      style={{ paddingBottom: "2px", position: "relative", top: "-3px" }}
    >
      <StatsProgressBar
        min={skill.baseExperience}
        max={skill.nextExperience}
        current={skill.experience}
        progress={skill.progress}
        color={color}
      />
    </TableCell>
  );
}
