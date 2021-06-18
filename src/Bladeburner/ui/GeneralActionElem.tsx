import React, { useState } from "react";
import { ActionTypes } from "../data/ActionTypes";
import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { stealthIcon, killIcon } from "../data/Icons";
import { BladeburnerConstants } from "../data/Constants";

interface IProps {
    bladeburner: any;
    action: any;
}

export function GeneralActionElem(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    const isActive = props.action.name === props.bladeburner.action.name;
    const computedActionTimeCurrent = Math.min(props.bladeburner.actionTimeCurrent+props.bladeburner.actionTimeOverflow, props.bladeburner.actionTimeToComplete);

    function onStart() {
        props.bladeburner.action.type = ActionTypes[(props.action.name as string)];
        props.bladeburner.action.name = props.action.name;
        props.bladeburner.startAction(props.bladeburner.action);
        setRerender(old => !old);
    }

    return (<>
        <h2 style={{display: 'inline-block'}}>
            {isActive ? 
                <>{props.action.name} (IN PROGRESS - {formatNumber(computedActionTimeCurrent, 0)} / {formatNumber(props.bladeburner.actionTimeToComplete, 0)})</> :
                <>{props.action.name}</>
            }
        </h2>
        {isActive ? 
        <p style={{display: 'block'}}>{createProgressBarText({progress:computedActionTimeCurrent / props.bladeburner.actionTimeToComplete})}</p> :
        <>
            <a
                onClick={onStart}
                className="a-link-button"
                style={{margin:"3px", padding:"3px"}}>
                Start
            </a>
        </>}
        <br />
        <br />
        <pre style={{display: 'inline-block'}} dangerouslySetInnerHTML={{__html: props.action.desc}}></pre>
    </>);
}