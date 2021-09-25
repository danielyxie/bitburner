import React from "react";
import { CopyableText } from "../../ui/React/CopyableText";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { IBladeburner } from "../IBladeburner";

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
    <>
      <h2 style={{ display: "inline-block" }}>
        <CopyableText value={props.skill.name} />
      </h2>
      <a
        onClick={onClick}
        style={{ display: "inline-block", margin: "3px", padding: "3px" }}
        className={canLevel && !maxLvl ? "a-link-button" : "a-link-button-inactive"}
      >
        Level
      </a>
      <br />
      <br />
      <p style={{ display: "block" }}>Level: {currentLevel}</p>
      {maxLvl ? (
        <p style={{ color: "red", display: "block" }}>MAX LEVEL</p>
      ) : (
        <p style={{ display: "block" }}>Skill Points required: {formatNumber(pointCost, 0)}</p>
      )}
      <p style={{ display: "inline-block" }} dangerouslySetInnerHTML={{ __html: props.skill.desc }} />
    </>
  );
}
