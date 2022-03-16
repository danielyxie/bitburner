import React from "react";

import Typography from "@mui/material/Typography";

import { Modal } from "../../ui/React/Modal";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export const TerritoryInfoModal = ({ open, onClose }: IProps): React.ReactElement => {
  return (
    <Modal open={open} onClose={onClose}>
      <>
        <Typography variant='h4'>
          Clashing
        </Typography>
        <Typography>
          Every ~20 seconds, your gang has a chance to 'clash' with other gangs. Your chance to win a clash depends on
          your gang's power, which is listed in the display below. Your gang's power slowly accumulates over time. The
          accumulation rate is determined by the stats of all Gang members you have assigned to the 'Territory Warfare'
          task. Gang members that are not assigned to this task do not contribute to your gang's power. Your gang also
          loses a small amount of power whenever you lose a clash.
          <br />
          <br />
          NOTE: Gang members assigned to 'Territory Warfare' can be killed during clashes. This can happen regardless of
          whether you win or lose the clash. A gang member being killed results in both respect and power loss for your
          gang.
        </Typography>
        <br />
        <Typography variant='h4'>
          Territory
        </Typography>
        <Typography>
          The amount of territory you have affects all aspects of your Gang members' production, including money, respect,
          and wanted level. It is very beneficial to have high territory control.
          <br />
          <br />
          To increase your chances of winning territory assign gang members to "Territory Warfare", this will build your
          gang power. Then enable "Engage in Territory Warfare" to start fighting over territory.
        </Typography>
        <br />
        <Typography variant='h4'>
          Territory Clash Chance
        </Typography>
        <Typography>
          This percentage represents the chance you have of 'clashing' with with another gang. If you do not wish to
          gain/lose territory, then keep this percentage at 0% by not engaging in territory warfare.
        </Typography>
      </>
    </Modal >
  );
}
