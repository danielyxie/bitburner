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

export function ContractElem(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    const isActive = props.bladeburner.action.type === ActionTypes["Contract"] && props.action.name === props.bladeburner.action.name;
    const estimatedSuccessChance = props.action.getSuccessChance(props.bladeburner, {est:true});
    const computedActionTimeCurrent = Math.min(props.bladeburner.actionTimeCurrent+props.bladeburner.actionTimeOverflow, props.bladeburner.actionTimeToComplete);
    const maxLevel = (props.action.level >= props.action.maxLevel);
    const actionTime = props.action.getActionTime(props.bladeburner);
    const autolevelCheckboxId = `bladeburner-${props.action.name}-autolevel-checkbox`;

    function onStart() {
        props.bladeburner.action.type = ActionTypes.Contract;
        props.bladeburner.action.name = props.action.name;
        props.bladeburner.startAction(props.bladeburner.action);
        setRerender(old => !old);
    }

    function increaseLevel() {
        ++props.action.level;
        if (isActive) props.bladeburner.startAction(props.bladeburner.action);
        setRerender(old => !old);
    }

    function decreaseLevel() {
        --props.action.level;
        if (isActive) props.bladeburner.startAction(props.bladeburner.action);
        setRerender(old => !old);
    }

    function onAutolevel(event: React.ChangeEvent<HTMLInputElement>) {
        props.action.autoLevel = event.target.checked;
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
        <pre className="tooltip" style={{display:"inline-block"}}>
            <span className="tooltiptext">
                {props.action.getSuccessesNeededForNextLevel(BladeburnerConstants.ContractSuccessesPerLevel)} successes needed for next level
            </span>
            Level: {props.action.level} / {props.action.maxLevel}
        </pre>
        <a
            onClick={increaseLevel}
            style={{padding:"2px", margin:"2px"}}
            className={`tooltip ${maxLevel ? "a-link-button-inactive" : "a-link-button"}`}>
            {isActive && (<span className="tooltiptext">WARNING: changing the level will restart the Operation</span>)}
            ↑
        </a>
        <a
            onClick={decreaseLevel}
            style={{padding:"2px", margin:"2px"}}
            className={`tooltip ${props.action.level <= 1 ? "a-link-button-inactive" : "a-link-button"}`}>
            {isActive && (<span className="tooltiptext">WARNING: changing the level will restart the Operation</span>)}
            ↓
        </a>
        <br />
        <br />
        <pre style={{display: 'inline-block'}}>
<span dangerouslySetInnerHTML={{__html: props.action.desc}} />
<br /><br />
Estimated success chance: {formatNumber(estimatedSuccessChance*100, 1)}% {props.action.isStealth?stealthIcon:<></>}${props.action.isKill?killIcon:<></>}<br />
Time Required: {convertTimeMsToTimeElapsedString(actionTime*1000)}<br />
Contracts remaining: {Math.floor(props.action.count)}<br />
Successes: {props.action.successes}<br />
Failures: {props.action.failures}
        </pre>
        <br />
        <label
            className="tooltip"
            style={{color: 'white'}}
            htmlFor={autolevelCheckboxId}>
            Autolevel: 
            <span className="tooltiptext">Automatically increase operation level when possible</span>
        </label>
        <input
            type="checkbox"
            id={autolevelCheckboxId}
            checked={props.action.autoLevel}
            onChange={onAutolevel}/>
    </>);
}

/*

// Autolevel Checkbox
el.appendChild(createElement("br"));
var autolevelCheckboxId = "bladeburner-" + action.name + "-autolevel-checkbox";
el.appendChild(createElement("label", {
    for:autolevelCheckboxId, innerText:"Autolevel: ",color:"white",
    tooltip:"Automatically increase contract level when possible",
}));

const checkboxInput = createElement("input", {
  type:"checkbox",
  id: autolevelCheckboxId,
  checked: action.autoLevel,
  changeListener: () => {
    action.autoLevel = checkboxInput.checked;
  },
});

el.appendChild(checkboxInput);

*/