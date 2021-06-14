import * as React from "react";
import { Panel1 } from "./Panel1";
import { Panel2 } from "./Panel2";
import { Panel3 } from "./Panel3";

interface IProps {
    gang: any;
    member: any;
}

export function GangMemberAccordionContent(props: IProps): React.ReactElement {
    return (<>
        <div className={"gang-member-info-div tooltip"}>
            <Panel1 gang={props.gang} member={props.member} />
        </div>
        <div className={"gang-member-info-div"}>
            <Panel2 gang={props.gang} member={props.member} />
        </div>
        <div className={"gang-member-info-div"}>
            <Panel3 member={props.member} />
        </div>
    </>);
}
