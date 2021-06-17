/**
 * React Component for a gang member on the management subpage.
 */
import React from "react";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";
import { Accordion } from "../../ui/React/Accordion";
import { GangMemberAccordionContent } from "./GangMemberAccordionContent";

interface IProps {
    gang: Gang;
    member: GangMember;
}

export function GangMemberAccordion(props: IProps): React.ReactElement {
    return <Accordion
            panelInitiallyOpened={true}
            headerContent={<>{props.member.name}</>}
            panelContent={<GangMemberAccordionContent
                gang={props.gang}
                member={props.member} />} />
}