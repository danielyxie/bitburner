import React from "react";
import { GangMemberTasks } from "../GangMemberTasks";
import { GangMember } from "../GangMember";

interface IProps {
    member: GangMember;
}

export function TaskDescription(props: IProps): React.ReactElement {
    const task = GangMemberTasks[props.member.task];
    const desc = task ? task.desc: GangMemberTasks["Unassigned"].desc;

    return (<>
        <p className="inline"
            id={`${props.member.name}-gang-member-task-description`}
            dangerouslySetInnerHTML={{__html: desc}}>
        </p>
    </>);
}