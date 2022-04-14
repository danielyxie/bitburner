/**
 * React Component for the content of the accordion of gang members on the
 * management subpage.
 */
import HelpIcon from "@mui/icons-material/Help";
import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";

import { StaticModal } from "../../ui/React/StaticModal";
import type { GangMember } from "../GangMember";

import { AscensionModal } from "./AscensionModal";
import { GangMemberStats } from "./GangMemberStats";
import { TaskSelector } from "./TaskSelector";

interface IProps {
  member: GangMember;
}

export function GangMemberCardContent(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  const [helpOpen, setHelpOpen] = useState(false);
  const [ascendOpen, setAscendOpen] = useState(false);

  return (
    <>
      {props.member.canAscend() && (
        <Box sx={{ display: "flex", justifyContent: "space-between", my: 1 }}>
          <Button onClick={() => setAscendOpen(true)} style={{ flexGrow: 1, borderRightWidth: 0 }}>
            Ascend
          </Button>
          <AscensionModal
            open={ascendOpen}
            onClose={() => setAscendOpen(false)}
            member={props.member}
            onAscend={() => setRerender((old) => !old)}
          />
          <Button onClick={() => setHelpOpen(true)} style={{ width: "fit-content", borderLeftWidth: 0 }}>
            <HelpIcon />
          </Button>
          <StaticModal open={helpOpen} onClose={() => setHelpOpen(false)}>
            <Typography>
              Ascending a Gang Member resets the member's progress and stats in exchange for a permanent boost to their
              stat multipliers.
              <br />
              <br />
              The additional stat multiplier that the Gang Member gains upon ascension is based on the amount of exp
              they have.
              <br />
              <br />
              Upon ascension, the member will lose all of its non-Augmentation Equipment and your gang will lose respect
              equal to the total respect earned by the member.
            </Typography>
          </StaticModal>
        </Box>
      )}
      <Box display="grid" sx={{ gridTemplateColumns: "1fr 1fr", width: "100%", gap: 1 }}>
        <GangMemberStats member={props.member} />
        <TaskSelector onTaskChange={() => setRerender((old) => !old)} member={props.member} />
      </Box>
    </>
  );
}
