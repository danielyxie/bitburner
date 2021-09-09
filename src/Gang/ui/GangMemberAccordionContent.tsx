/**
 * React Component for the content of the accordion of gang members on the
 * management subpage.
 */
import React, { useState } from "react";
import { GangMemberStats } from "./GangMemberStats";
import { TaskSelector } from "./TaskSelector";
import { TaskDescription } from "./TaskDescription";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";

interface IProps {
  gang: Gang;
  member: GangMember;
}

export function GangMemberAccordionContent(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  return (
    <>
      <div className={"gang-member-info-div tooltip"}>
        <GangMemberStats onAscend={() => setRerender((old) => !old)} gang={props.gang} member={props.member} />
      </div>
      <div className={"gang-member-info-div"}>
        <TaskSelector onTaskChange={() => setRerender((old) => !old)} gang={props.gang} member={props.member} />
      </div>
      <div className={"gang-member-info-div"}>
        <TaskDescription member={props.member} />
      </div>
    </>
  );
}
