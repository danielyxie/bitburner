import * as React from "react";
import { SkillElem } from "./SkillElem";
import { Skills } from "../Skills";

interface IProps {
    bladeburner: any;
    onUpgrade: () => void;
}

export function SkillList(props: IProps): React.ReactElement {
    return (<>
        {Object.keys(Skills).map((skill: string) => 
            <li key={skill} className="bladeburner-action">
                <SkillElem bladeburner={props.bladeburner} skill={Skills[skill]} onUpgrade={props.onUpgrade} />
            </li>
        )}
    </>);
}