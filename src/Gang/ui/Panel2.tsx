import React, { useState, useEffect } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { StatsTable } from "../../ui/React/StatsTable";
import { MoneyRate } from "../../ui/React/MoneyRate";

interface IProps {
    member: any;
    gang: any;
}

export function Panel2(props: IProps): React.ReactElement {
    const [rerender, setRerender] = useState(false);
    const [currentTask, setCurrentTask] = useState(props.member.task);

    useEffect(() => {
        const id = setInterval(() => setRerender(old => !old), 1000);
        return () => clearInterval(id);
    }, []);

    function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const task = event.target.value;
        props.member.assignToTask(task);
        props.gang.updateGangContent();
        setCurrentTask(task);
    }

    const tasks = props.gang.getAllTaskNames();

    const data = [
        [`Money:`, MoneyRate(5*props.member.calculateMoneyGain(props.gang))],
        [`Respect:`, `${numeralWrapper.formatRespect(5*props.member.calculateRespectGain(props.gang))} / sec`],
        [`Wanted Level:`, `${numeralWrapper.formatWanted(5*props.member.calculateWantedLevelGain(props.gang))} / sec`],
        [`Total Respect:`, `${numeralWrapper.formatRespect(props.member.earnedRespect)}`],
    ];

    return (<>
        <select
            onChange={onChange}
            className="dropdown"
            id={`${props.member.name}-gang-member-task-selector`}
            value={currentTask}>
            <option key={0} value={"---"}>---</option>
            {tasks.map((task: any, i: number) => <option key={i+1} value={task}>{task}</option>)}
        </select>
        <div id={`${name}-gang-member-gain-info`}>{StatsTable(data, null)}</div>
    </>);
}