/**
 * React Component for the recruitment button and text on the gang main page.
 */
import React from "react";
import { Gang } from "../Gang";
import { RecruitPopup } from "./RecruitPopup";
import { GangConstants } from "../data/Constants";
import { formatNumber } from "../../../utils/StringHelperFunctions";
import { createPopup } from "../../ui/React/createPopup";

interface IProps {
  gang: Gang;
  onRecruit: () => void;
}

export function RecruitButton(props: IProps): React.ReactElement {
  if (props.gang.members.length >= GangConstants.MaximumGangMembers) {
    return <></>;
  }

  if (!props.gang.canRecruitMember()) {
    const respect = props.gang.getRespectNeededToRecruitMember();
    return (
      <>
        <a
          className="a-link-button-inactive"
          style={{ display: "inline-block", margin: "10px" }}
        >
          Recruit Gang Member
        </a>
        <p style={{ margin: "10px", color: "red", display: "inline-block" }}>
          {formatNumber(respect, 2)} respect needed to recruit next member
        </p>
      </>
    );
  }

  function onClick(): void {
    const popupId = "recruit-gang-member-popup";
    createPopup(popupId, RecruitPopup, {
      gang: props.gang,
      popupId: popupId,
      onRecruit: props.onRecruit,
    });
  }

  return (
    <>
      <a
        className="a-link-button"
        onClick={onClick}
        style={{ display: "inline-block", margin: "10px" }}
      >
        Recruit Gang Member
      </a>
    </>
  );
}
