import React, { useState, useEffect } from "react";
import { GangMemberTasks } from "../GangMemberTasks";

interface IProps {
    member: any;
}

export function Panel3(props: IProps): React.ReactElement {
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    const task = GangMemberTasks[props.member.task];
    const desc = task ? task.desc: GangMemberTasks["Unassigned"].desc;

    return (<>
        <p className="inline"
            id={`${props.member.name}-gang-member-task-description`}
            dangerouslySetInnerHTML={{__html: desc}}>
        </p>
    </>);
}