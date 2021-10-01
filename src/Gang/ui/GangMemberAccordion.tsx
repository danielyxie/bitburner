/**
 * React Component for a gang member on the management subpage.
 */
import React, { useState } from "react";
import { GangMember } from "../GangMember";
import { GangMemberAccordionContent } from "./GangMemberAccordionContent";

import Box from "@mui/material/Box";

import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
interface IProps {
  member: GangMember;
}

export function GangMemberAccordion(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(true);
  return (
    <Box component={Paper}>
      <ListItemButton onClick={() => setOpen((old) => !old)}>
        <ListItemText primary={<Typography>{props.member.name}</Typography>} />
        {open ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
      </ListItemButton>
      <Collapse in={open} unmountOnExit>
        <Box sx={{ mx: 4 }}>
          <GangMemberAccordionContent member={props.member} />
        </Box>
      </Collapse>
    </Box>
  );
}
