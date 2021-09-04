import React, { useState } from "react";
import { ActionTypes } from "../data/ActionTypes";
import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";
import {
  formatNumber,
  convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { stealthIcon, killIcon } from "../data/Icons";
import { BladeburnerConstants } from "../data/Constants";
import { createPopup } from "../../ui/React/createPopup";
import { TeamSizePopup } from "./TeamSizePopup";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { SuccessChance } from "./SuccessChance";
import { CopyableText } from "../../ui/React/CopyableText";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
  action: any;
}

export function OperationElem(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const isActive =
    props.bladeburner.action.type === ActionTypes["Operation"] &&
    props.action.name === props.bladeburner.action.name;
  const estimatedSuccessChance = props.action.getEstSuccessChance(
    props.bladeburner,
  );
  const computedActionTimeCurrent = Math.min(
    props.bladeburner.actionTimeCurrent + props.bladeburner.actionTimeOverflow,
    props.bladeburner.actionTimeToComplete,
  );
  const maxLevel = props.action.level >= props.action.maxLevel;
  const actionTime = props.action.getActionTime(props.bladeburner);
  const autolevelCheckboxId = `bladeburner-${props.action.name}-autolevel-checkbox`;

  function onStart(): void {
    props.bladeburner.action.type = ActionTypes.Operation;
    props.bladeburner.action.name = props.action.name;
    props.bladeburner.startAction(props.player, props.bladeburner.action);
    setRerender((old) => !old);
  }

  function onTeam(): void {
    const popupId = "bladeburner-operation-set-team-size-popup";
    createPopup(popupId, TeamSizePopup, {
      bladeburner: props.bladeburner,
      action: props.action,
      popupId: popupId,
    });
  }

  function increaseLevel(): void {
    ++props.action.level;
    if (isActive)
      props.bladeburner.startAction(props.player, props.bladeburner.action);
    setRerender((old) => !old);
  }

  function decreaseLevel(): void {
    --props.action.level;
    if (isActive)
      props.bladeburner.startAction(props.player, props.bladeburner.action);
    setRerender((old) => !old);
  }

  function onAutolevel(event: React.ChangeEvent<HTMLInputElement>): void {
    props.action.autoLevel = event.target.checked;
    setRerender((old) => !old);
  }

  return (
    <>
      <h2 style={{ display: "inline-block" }}>
        {isActive ? (
          <>
            <CopyableText value={props.action.name} /> (IN PROGRESS -{" "}
            {formatNumber(computedActionTimeCurrent, 0)} /{" "}
            {formatNumber(props.bladeburner.actionTimeToComplete, 0)})
          </>
        ) : (
          <CopyableText value={props.action.name} />
        )}
      </h2>
      {isActive ? (
        <p style={{ display: "block" }}>
          {createProgressBarText({
            progress:
              computedActionTimeCurrent /
              props.bladeburner.actionTimeToComplete,
          })}
        </p>
      ) : (
        <>
          <a
            onClick={onStart}
            className="a-link-button"
            style={{ margin: "3px", padding: "3px" }}
          >
            Start
          </a>
          <a
            onClick={onTeam}
            style={{ margin: "3px", padding: "3px" }}
            className="a-link-button"
          >
            Set Team Size (Curr Size: {formatNumber(props.action.teamCount, 0)})
          </a>
        </>
      )}
      <br />
      <br />
      <pre className="tooltip" style={{ display: "inline-block" }}>
        <span className="tooltiptext">
          {props.action.getSuccessesNeededForNextLevel(
            BladeburnerConstants.OperationSuccessesPerLevel,
          )}{" "}
          successes needed for next level
        </span>
        Level: {props.action.level} / {props.action.maxLevel}
      </pre>
      <a
        onClick={increaseLevel}
        style={{ padding: "2px", margin: "2px" }}
        className={`tooltip ${
          maxLevel ? "a-link-button-inactive" : "a-link-button"
        }`}
      >
        {isActive && (
          <span className="tooltiptext">
            WARNING: changing the level will restart the Operation
          </span>
        )}
        ↑
      </a>
      <a
        onClick={decreaseLevel}
        style={{ padding: "2px", margin: "2px" }}
        className={`tooltip ${
          props.action.level <= 1 ? "a-link-button-inactive" : "a-link-button"
        }`}
      >
        {isActive && (
          <span className="tooltiptext">
            WARNING: changing the level will restart the Operation
          </span>
        )}
        ↓
      </a>
      <br />
      <br />
      <pre style={{ display: "inline-block" }}>
        <span dangerouslySetInnerHTML={{ __html: props.action.desc }} />
        <br />
        <br />
        Estimated success chance:{" "}
        <SuccessChance chance={estimatedSuccessChance} />{" "}
        {props.action.isStealth ? stealthIcon : <></>}
        {props.action.isKill ? killIcon : <></>}
        <br />
        Time Required: {convertTimeMsToTimeElapsedString(actionTime * 1000)}
        <br />
        Operations remaining: {Math.floor(props.action.count)}
        <br />
        Successes: {props.action.successes}
        <br />
        Failures: {props.action.failures}
      </pre>
      <br />
      <label
        className="tooltip"
        style={{ color: "white" }}
        htmlFor={autolevelCheckboxId}
      >
        Autolevel:
        <span className="tooltiptext">
          Automatically increase operation level when possible
        </span>
      </label>
      <input
        type="checkbox"
        id={autolevelCheckboxId}
        checked={props.action.autoLevel}
        onChange={onAutolevel}
      />
    </>
  );
}
