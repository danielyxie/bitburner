import React, { useState } from "react";
import {
    formatNumber,
    convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { ActionTypes } from "../data/ActionTypes";
import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";
import { stealthIcon, killIcon } from "../data/Icons";
import { createPopup } from "../../ui/React/createPopup";
import { TeamSizePopup } from "./TeamSizePopup";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";

interface IProps {
    bladeburner: IBladeburner;
    player: IPlayer;
    action: any;
}

export function BlackOpElem(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
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

    function onStart(): void {
        props.bladeburner.action.type = ActionTypes.BlackOperation;
        props.bladeburner.action.name = props.action.name;
        props.bladeburner.startAction(props.player, props.bladeburner.action);
        setRerender(old => !old);
    }

    function onTeam(): void {
        const popupId = "bladeburner-operation-set-team-size-popup";
        createPopup(popupId, TeamSizePopup, {
            bladeburner: props.bladeburner,
            action: props.action,
            popupId: popupId,
        });
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