/**
 * React Component for the list of gang members on the management subpage.
 */
import React, { useState } from "react";
import { GangMemberAccordion } from "./GangMemberAccordion";
import { GangMember } from "../GangMember";
import { RecruitButton } from "./RecruitButton";
import { useGang } from "./Context";

export function GangMemberList(): React.ReactElement {
  const gang = useGang();
  const setRerender = useState(false)[1];

  return (
    <>
      <RecruitButton onRecruit={() => setRerender((old) => !old)} />
      <ul>
        {gang.members.map((member: GangMember) => (
          <GangMemberAccordion key={member.name} member={member} />
        ))}
      </ul>
    </>
  );
}
