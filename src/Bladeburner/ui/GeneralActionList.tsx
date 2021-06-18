import React, { useState, useEffect } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { GeneralActionElem } from "./GeneralActionElem";
import { Action } from "../Action";
import { GeneralActions } from "../GeneralActions";

interface IProps {
    bladeburner: any;
}

export function GeneralActionList(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    const actions: Action[] = [];
    for (const name in GeneralActions) {
        if (GeneralActions.hasOwnProperty(name)) {
            actions.push(GeneralActions[name]);
        }
    }
    return (<>
        {actions.map((action: Action) => 
            <li key={action.name} className="bladeburner-action">
                <GeneralActionElem bladeburner={props.bladeburner} action={action} />
            </li>
        )}
    </>);
}