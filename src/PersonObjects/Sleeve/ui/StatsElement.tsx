import { Sleeve } from "../Sleeve";
import { numeralWrapper } from "../../../ui/numeralFormat";
import React from "react";

import { StatsTable } from "../../../ui/React/StatsTable";

interface IProps {
  sleeve: Sleeve;
}

export function StatsElement(props: IProps): React.ReactElement {
  const rows = [
    [
      "HP: ",
      <>
        {numeralWrapper.formatHp(props.sleeve.hp)} / {numeralWrapper.formatHp(props.sleeve.max_hp)}
      </>,
    ],
    ["City: ", <>{props.sleeve.city}</>],
    ["Hacking: ", <>{numeralWrapper.formatSkill(props.sleeve.hacking_skill)}</>],
    ["Strength: ", <>{numeralWrapper.formatSkill(props.sleeve.strength)}</>],
    ["Defense: ", <>{numeralWrapper.formatSkill(props.sleeve.defense)}</>],
    ["Dexterity: ", <>{numeralWrapper.formatSkill(props.sleeve.dexterity)}</>],
    ["Agility: ", <>{numeralWrapper.formatSkill(props.sleeve.agility)}</>],
    ["Charisma: ", <>{numeralWrapper.formatSkill(props.sleeve.charisma)}</>],
    ["Shock: ", <>{numeralWrapper.formatSleeveShock(100 - props.sleeve.shock)}</>],
    ["Sync: ", <>{numeralWrapper.formatSleeveSynchro(props.sleeve.sync)}</>],
    ["Memory: ", <>{numeralWrapper.formatSleeveMemory(props.sleeve.memory)}</>],
  ];
  return <StatsTable rows={rows} />;
}
