import React from "react";
import { CopyableText } from "../../ui/React/CopyableText";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { IBladeburner } from "../IBladeburner";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

interface IProps {
  skill: any;
  bladeburner: IBladeburner;
  onUpgrade: () => void;
}

export function SkillElem(props: IProps): React.ReactElement {
  const skillName = props.skill.name;
  let currentLevel = 0;
  if (props.bladeburner.skills[skillName] && !isNaN(props.bladeburner.skills[skillName])) {
    currentLevel = props.bladeburner.skills[skillName];
  }
  const pointCost = props.skill.calculateCost(currentLevel);

  const canLevel = props.bladeburner.skillPoints >= pointCost;
  const maxLvl = props.skill.maxLvl ? currentLevel >= props.skill.maxLvl : false;

  function onClick(): void {
    if (props.bladeburner.skillPoints < pointCost) return;
    props.bladeburner.skillPoints -= pointCost;
    props.bladeburner.upgradeSkill(props.skill);
    props.onUpgrade();
  }

  return (
    <Paper sx={{ my: 1, p: 1 }}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Typography>
          <CopyableText value={props.skill.name} />
        </Typography>
        {!canLevel || maxLvl ? (
          <IconButton disabled>
            <CloseIcon />
          </IconButton>
        ) : (
          <IconButton onClick={onClick}>
            <AddIcon />
          </IconButton>
        )}
      </Box>
      <br />
      <br />
      <Typography>Level: {currentLevel}</Typography>
      {maxLvl ? (
        <Typography>MAX LEVEL</Typography>
      ) : (
        <Typography>Skill Points required: {formatNumber(pointCost, 0)}</Typography>
      )}
      <Typography>{props.skill.desc}</Typography>
    </Paper>
  );
}
