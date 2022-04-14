import * as React from "react";

import type { IBladeburner } from "../IBladeburner";
import { Skills } from "../Skills";

import { SkillElem } from "./SkillElem";

interface IProps {
  bladeburner: IBladeburner;
  onUpgrade: () => void;
}

export function SkillList(props: IProps): React.ReactElement {
  return (
    <>
      {Object.keys(Skills).map((skill: string) => (
        <SkillElem key={skill} bladeburner={props.bladeburner} skill={Skills[skill]} onUpgrade={props.onUpgrade} />
      ))}
    </>
  );
}
