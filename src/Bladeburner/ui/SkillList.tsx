import * as React from "react";
import { SkillElem } from "./SkillElem";
import { Skills } from "../Skills";
import { Bladeburner } from "../Bladeburner";

interface IProps {
  bladeburner: Bladeburner;
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
