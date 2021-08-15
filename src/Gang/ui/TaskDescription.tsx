/**
 * React Component for left side of the gang member accordion, contains the
 * description of the task that member is currently doing.
 */
import React from "react";
import { GangMemberTasks } from "../GangMemberTasks";
import { GangMember } from "../GangMember";

interface IProps {
    member: GangMember;
}

export function TaskDescription(props: IProps): React.ReactElement {
    const task = GangMemberTasks[props.member.task];
    const desc = task ? task.desc: GangMemberTasks["Unassigned"].desc;

    return (<p className="inline noselect" dangerouslySetInnerHTML={{__html: desc}} />);
}