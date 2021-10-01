/**
 * React Component for the recruitment button and text on the gang main page.
 */
import React, { useState } from "react";
import { RecruitModal } from "./RecruitModal";
import { GangConstants } from "../data/Constants";
import { formatNumber } from "../../utils/StringHelperFunctions";
import { useGang } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

interface IProps {
  onRecruit: () => void;
}

export function RecruitButton(props: IProps): React.ReactElement {
  const gang = useGang();
  const [open, setOpen] = useState(false);
  if (gang.members.length >= GangConstants.MaximumGangMembers) {
    return <></>;
  }

  if (!gang.canRecruitMember()) {
    const respect = gang.getRespectNeededToRecruitMember();
    return (
      <Box display="flex" alignItems="center">
        <Button sx={{ mx: 1 }} disabled>
          Recruit Gang Member
        </Button>
        <Typography>{formatNumber(respect, 2)} respect needed to recruit next member</Typography>
      </Box>
    );
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Recruit Gang Member</Button>
      <RecruitModal open={open} onClose={() => setOpen(false)} onRecruit={props.onRecruit} />
    </>
  );
}
