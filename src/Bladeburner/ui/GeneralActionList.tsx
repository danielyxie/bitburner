import React, { useState, useEffect } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { GeneralActionElem } from "./GeneralActionElem";
import { Action } from "../Action";
import { GeneralActions } from "../GeneralActions";
import { IBladeburner } from "../IBladeburner";

interface IProps {
    bladeburner: IBladeburner;
}

export function GeneralActionList(props: IProps): React.ReactElement {
    const actions: Action[] = [];
    for (const name in GeneralActions) {
        if (GeneralActions.hasOwnProperty(name)) {
            actions.push(GeneralActions[name]);
        }
    }
    return (<>
        {actions.map((action: Action) => <li key={action.name} className="bladeburner-action">
                <GeneralActionElem bladeburner={props.bladeburner} action={action} />
            </li>,
        )}
    </>);
}