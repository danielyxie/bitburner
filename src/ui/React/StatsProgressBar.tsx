import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import { TableCell, Tooltip } from '@mui/material';
import { characterOverviewStyles } from './CharacterOverview';
import { ISkillProgress } from 'src/PersonObjects/formulas/skill';

interface IProgressProps {
  min: number;
  max: number;
  current: number;
  color?: React.CSSProperties["color"];
}

interface IStatsOverviewCellProps {
  progress: ISkillProgress;
  color?: React.CSSProperties["color"];
}

export function StatsProgressBar({ min, max, current, color }: IProgressProps): React.ReactElement {
  const normalise = (value: number): number => ((value - min) * 100) / (max - min);
  const tooltipText = <>
    Experience: {current.toFixed(2)}/{max.toFixed(2)}
    <br />
    {normalise(current).toFixed(2)}%
  </>;

  return (
    <Tooltip title={tooltipText}>
      <LinearProgress
        variant="determinate"
        value={normalise(current)}
        sx={{
          backgroundColor: '#111111',
          '& .MuiLinearProgress-bar1Determinate': {
            backgroundColor: color,
          },
        }}
      />
    </Tooltip>
  );
}

export function StatsProgressOverviewCell({progress, color}: IStatsOverviewCellProps): React.ReactElement {
  const classes = characterOverviewStyles();
  return (
    <TableCell component="th" scope="row" colSpan={2}
      classes={{ root: classes.cellNone }}
      style={{ paddingBottom: '2px', position: 'relative', top: '-3px' }}>
      <StatsProgressBar
        min={progress.baseExperience}
        max={progress.nextExperience}
        current={progress.experience}
        color={color}
      />
    </TableCell>
  )
}
