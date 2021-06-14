import * as React from "react";
import { GangMemberAccordionContent } from "./GangMemberAccordionContent"
import { Accordion } from "../../ui/React/Accordion";

interface IProps {
    gang: any;
    member: any;
}

export function GangMemberAccordion(props: IProps): React.ReactElement {
    return (<Accordion
        headerContent={<>{props.member.name}</>}
        panelContent={<GangMemberAccordionContent gang={props.gang} member={props.member} />}
    />);
}
