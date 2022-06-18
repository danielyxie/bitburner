/**
 * React Component for a gang member on the management subpage.
 */
import React from "react";
import { GangMember } from "../GangMember";
import { GangMemberCardContent } from "./GangMemberCardContent";

import Box from "@mui/material/Box";

import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";

interface IProps {
  member: GangMember;
}

export function GangMemberCard(props: IProps): React.ReactElement {
  return (
    <Box component={Paper} sx={{ width: "auto" }}>
      <Box sx={{ m: 1 }}>
        <ListItemText primary={<b>{props.member.name}</b>} />
        <GangMemberCardContent member={props.member} />
      </Box>
    </Box>
  );
}
