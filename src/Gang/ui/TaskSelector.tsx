/**
 * React Component for the middle part of the gang member accordion. Contains
 * the task selector as well as some stats.
 */
import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { StatsTable } from "../../ui/React/StatsTable";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { Gang } from "../Gang";
import { GangMember } from "../GangMember";

interface IProps {
    member: GangMember;
    gang: Gang;
    onTaskChange: () => void;
}

export function TaskSelector(props: IProps): React.ReactElement {
    const [currentTask, setCurrentTask] = useState(props.member.task);

    function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const task = event.target.value;
        props.member.assignToTask(task);
        setCurrentTask(task);
        props.onTaskChange();
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
            {tasks.map((task: string, i: number) => <option key={i+1} value={task}>{task}</option>)}
        </select>
        <div id={`${name}-gang-member-gain-info`}>{StatsTable(data, null)}</div>
    </>);
}