import * as React from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { ActionTypes } from "../data/ActionTypes";
import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";
import { stealthIcon, killIcon } from "../data/Icons";

interface IProps {
    bladeburner: any;
    action: any;
}

export function BlackOpElem(props: IProps): React.ReactElement {
    const isCompleted = (props.bladeburner.blackops[props.action.name] != null);
    if(isCompleted) {
        return (
            <h2 style={{display: 'block'}}>{props.action.name} (COMPLETED)</h2>);
    }

    const isActive = props.bladeburner.action.type === ActionTypes["BlackOperation"] && props.action.name === props.bladeburner.action.name;
    const estimatedSuccessChance = props.action.getSuccessChance(props.bladeburner, {est:true});
    const actionTime = props.action.getActionTime(props.bladeburner);
    const hasReqdRank = props.bladeburner.rank >= props.action.reqdRank;
    const computedActionTimeCurrent = Math.min(props.bladeburner.actionTimeCurrent+props.bladeburner.actionTimeOverflow, props.bladeburner.actionTimeToComplete);

    function onStart() {
        props.bladeburner.action.type = ActionTypes.BlackOperation;
        props.bladeburner.action.name = props.action.name;
        props.bladeburner.startAction(props.bladeburner.action);
        props.bladeburner.updateActionAndSkillsContent();
    }

    function onTeam() {
        // TODO(hydroflame): this needs some changes that are in the Gang conversion.
        // var popupId = "bladeburner-operation-set-team-size-popup";
        // var txt = createElement("p", {
        //     innerText:"Enter the amount of team members you would like to take on this " +
        //               "BlackOp. If you do not have the specified number of team members, " +
        //               "then as many as possible will be used. Note that team members may " +
        //               "be lost during operations.",

        // });
        // var input = createElement("input", {
        //     type:"number", placeholder: "Team size", class: "text-input",
        // });
        // var setBtn = createElement("a", {
        //     innerText:"Confirm", class:"a-link-button",
        //     clickListener:() => {
        //         var num = Math.round(parseFloat(input.value));
        //         if (isNaN(num) || num < 0) {
        //             dialogBoxCreate("Invalid value entered for number of Team Members (must be numeric, positive)")
        //         } else {
        //             action.teamCount = num;
        //             this.updateBlackOpsUIElement(el, action);
        //         }
        //         removeElementById(popupId);
        //         return false;
        //     },
        // });
        // var cancelBtn = createElement("a", {
        //     innerText:"Cancel", class:"a-link-button",
        //     clickListener:() => {
        //         removeElementById(popupId);
        //         return false;
        //     },
        // });
        // createPopup(popupId, [txt, input, setBtn, cancelBtn]);
        // input.focus();
    }

    return (<>
        <h2 style={{display: 'inline-block'}}>
            {isActive ? 
                <>{props.action.name} (IN PROGRESS - {formatNumber(computedActionTimeCurrent, 0)} / {formatNumber(props.bladeburner.actionTimeToComplete, 0)})</> :
                <>{props.action.name}</>
            }
        </h2>
        {isActive ? 
        <p style={{display: 'block'}}>{createProgressBarText({progress: computedActionTimeCurrent / props.bladeburner.actionTimeToComplete})}</p> :
        <>
            <a
                className={hasReqdRank ? "a-link-button" : "a-link-button-inactive"}
                style={{margin:"3px", padding:"3px"}}
                onClick={onStart}
                >Start</a>
            <a
                onClick={onTeam}
                style={{margin:"3px", padding:"3px"}}
                className="a-link-button">
                Set Team Size (Curr Size: {formatNumber(props.action.teamCount, 0)})
            </a>
        </>}
        <br />
        <br />
        <p style={{display:"inline-block"}} dangerouslySetInnerHTML={{__html: props.action.desc}} />
        <br />
        <br />
        <p style={{display:"block", color:hasReqdRank ? "white" : "red"}}>
            Required Rank: {formatNumber(props.action.reqdRank, 0)}
        </p>
        <br />
        <p style={{display:"inline-block"}}>
            Estimated Success Chance: {formatNumber(estimatedSuccessChance*100, 1)}% {props.action.isStealth?stealthIcon:<></>}{props.action.isKill?killIcon:<></>}
            <br />
            Time Required: {convertTimeMsToTimeElapsedString(actionTime*1000)}
        </p>
    </>);
}