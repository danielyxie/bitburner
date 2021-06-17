import React, { useState } from "react";
import { Panel1 } from "./Panel1";
import { Panel2 } from "./Panel2";
import { Panel3 } from "./Panel3";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";

interface IProps {
    gang: Gang;
    member: GangMember;
}

export function GangMemberAccordionContent(props: IProps): React.ReactElement {
    const setRerender = useState(false)[1];
    return (<>
        <div className={"gang-member-info-div tooltip"}>
            <Panel1 gang={props.gang} member={props.member} />
        </div>
        <div className={"gang-member-info-div"}>
            <Panel2 onTaskChange={()=>setRerender(old => !old)} gang={props.gang} member={props.member} />
        </div>
        <div className={"gang-member-info-div"}>
            <Panel3 member={props.member} />
        </div>
    </>);
}
