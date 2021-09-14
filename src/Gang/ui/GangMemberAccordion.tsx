/**
 * React Component for a gang member on the management subpage.
 */
import React from "react";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";
import { BBAccordion } from "../../ui/React/BBAccordion";
import { GangMemberAccordionContent } from "./GangMemberAccordionContent";

interface IProps {
  gang: Gang;
  member: GangMember;
}

export function GangMemberAccordion(props: IProps): React.ReactElement {
  return (
    <BBAccordion
      panelInitiallyOpened={true}
      headerContent={<>{props.member.name}</>}
      panelContent={<GangMemberAccordionContent gang={props.gang} member={props.member} />}
    />
  );
}
