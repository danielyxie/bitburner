import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { TableCell } from "@mui/material";
import { characterOverviewStyles } from "./CharacterOverview";
import { ISkillProgress } from "src/PersonObjects/formulas/skill";

interface IProgressProps {
  progress: number;
  color?: React.CSSProperties["color"];
}

interface IStatsOverviewCellProps {
  progress: ISkillProgress;
  color?: React.CSSProperties["color"];
}

export function StatsProgressBar({ progress, color }: IProgressProps): React.ReactElement {
  return (
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
        progress={skill.progress}
        color={color}
      />
    </TableCell>
  );
}
