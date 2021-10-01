/**
 * React Component for the middle part of the gang member accordion. Contains
 * the task selector as well as some stats.
 */
import React, { useState } from "react";
import { numeralWrapper } from "../../ui/numeralFormat";
import { StatsTable } from "../../ui/React/StatsTable";
import { MoneyRate } from "../../ui/React/MoneyRate";
import { useGang } from "./Context";
import { GangMember } from "../GangMember";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  member: GangMember;
  onTaskChange: () => void;
}

export function TaskSelector(props: IProps): React.ReactElement {
  const gang = useGang();
  const [currentTask, setCurrentTask] = useState(props.member.task);

  function onChange(event: SelectChangeEvent<string>): void {
    const task = event.target.value;
    props.member.assignToTask(task);
    setCurrentTask(task);
    props.onTaskChange();
  }

  const tasks = gang.getAllTaskNames();

  const data = [
    [`Money:`, <MoneyRate money={5 * props.member.calculateMoneyGain(gang)} />],
    [`Respect:`, `${numeralWrapper.formatRespect(5 * props.member.calculateRespectGain(gang))} / sec`],
    [`Wanted Level:`, `${numeralWrapper.formatWanted(5 * props.member.calculateWantedLevelGain(gang))} / sec`],
    [`Total Respect:`, `${numeralWrapper.formatRespect(props.member.earnedRespect)}`],
  ];

  return (
    <>
      <Select onChange={onChange} value={currentTask}>
        <MenuItem key={0} value={"Unassigned"}>
          Unassigned
        </MenuItem>
        {tasks.map((task: string, i: number) => (
          <MenuItem key={i + 1} value={task}>
            {task}
          </MenuItem>
        ))}
      </Select>

      <StatsTable rows={data} />
    </>
  );
}
