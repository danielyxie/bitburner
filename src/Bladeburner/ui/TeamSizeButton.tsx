import Button from "@mui/material/Button";
import React, { useState } from "react";

import { formatNumber } from "../../utils/StringHelperFunctions";
import type { IBladeburner } from "../IBladeburner";
import type { Operation } from "../Operation";

import { TeamSizeModal } from "./TeamSizeModal";
interface IProps {
  action: Operation;
  bladeburner: IBladeburner;
}
export function TeamSizeButton(props: IProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button disabled={props.bladeburner.teamSize === 0} onClick={() => setOpen(true)}>
        Set Team Size (Curr Size: {formatNumber(props.action.teamCount, 0)})
      </Button>
      <TeamSizeModal open={open} onClose={() => setOpen(false)} action={props.action} bladeburner={props.bladeburner} />
    </>
  );
}
