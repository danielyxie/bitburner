import Typography from "@mui/material/Typography";
import * as React from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { IBladeburner } from "../IBladeburner";

import { ContractList } from "./ContractList";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function ContractPage(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>
        Complete contracts in order to increase your Bladeburner rank and earn money. Failing a contract will cause you
        to lose HP, which can lead to hospitalization.
        <br />
        <br />
        You can unlock higher-level contracts by successfully completing them. Higher-level contracts are more
        difficult, but grant more rank, experience, and money.
      </Typography>
      <ContractList bladeburner={props.bladeburner} player={props.player} />
    </>
  );
}
