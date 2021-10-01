/**
 * React Component for the content of the accordion of gang members on the
 * management subpage.
 */
import React, { useState } from "react";
import { GangMemberStats } from "./GangMemberStats";
import { TaskSelector } from "./TaskSelector";
import { TaskDescription } from "./TaskDescription";
import { GangMember } from "../GangMember";
import Grid from "@mui/material/Grid";

interface IProps {
  member: GangMember;
}

export function GangMemberAccordionContent(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  return (
    <Grid container>
      <Grid item xs={4}>
        <GangMemberStats onAscend={() => setRerender((old) => !old)} member={props.member} />
      </Grid>
      <Grid item xs={4}>
        <TaskSelector onTaskChange={() => setRerender((old) => !old)} member={props.member} />
      </Grid>
      <Grid item xs={4}>
        <TaskDescription member={props.member} />
      </Grid>
    </Grid>
  );
}
