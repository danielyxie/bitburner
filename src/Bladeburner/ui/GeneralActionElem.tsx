import React, { useState } from "react";
import { ActionTypes } from "../data/ActionTypes";
import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";
import {
  formatNumber,
  convertTimeMsToTimeElapsedString,
} from "../../../utils/StringHelperFunctions";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { CopyableText } from "../../ui/React/CopyableText";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
  action: any;
}

export function GeneralActionElem(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const isActive = props.action.name === props.bladeburner.action.name;
  const computedActionTimeCurrent = Math.min(
    props.bladeburner.actionTimeCurrent + props.bladeburner.actionTimeOverflow,
    props.bladeburner.actionTimeToComplete,
  );
  const actionTime = (function (): number {
    switch (props.action.name) {
      case "Training":
      case "Field Analysis":
        return 30;
      case "Diplomacy":
      case "Hyperbolic Regeneration Chamber":
        return 60;
      case "Recruitment":
        return props.bladeburner.getRecruitmentTime(props.player);
    }
    return -1; // dead code
  })();
  const successChance =
    props.action.name === "Recruitment"
      ? Math.max(
          0,
          Math.min(
            props.bladeburner.getRecruitmentSuccessChance(props.player),
            1,
          ),
        )
      : -1;

  function onStart(): void {
    props.bladeburner.action.type = ActionTypes[props.action.name as string];
    props.bladeburner.action.name = props.action.name;
    props.bladeburner.startAction(props.player, props.bladeburner.action);
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
        </>
      )}
      <br />
      <br />
      <pre
        style={{ display: "inline-block" }}
        dangerouslySetInnerHTML={{ __html: props.action.desc }}
      ></pre>
      <br />
      <br />
      <pre style={{ display: "inline-block" }}>
        Time Required: {convertTimeMsToTimeElapsedString(actionTime * 1000)}
        {successChance !== -1 && (
          <>
            <br />
            Estimated success chance: {formatNumber(successChance * 100, 1)}%
          </>
        )}
      </pre>
    </>
  );
}
