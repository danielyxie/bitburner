import * as React from "react";
import { OperationList } from "./OperationList";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";
import Typography from "@mui/material/Typography";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function OperationPage(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>
        Carry out operations for the Bladeburner division. Failing an operation will reduce your Bladeburner rank. It
        will also cause you to lose HP, which can lead to hospitalization. In general, operations are harder and more
        punishing than contracts, but are also more rewarding.
        <br />
        <br />
        Operations can affect the chaos level and Synthoid population of your current city. The exact effects vary
        between different Operations.
        <br />
        <br />
        For operations, you can use a team. You must first recruit team members. Having a larger team will improves your
        chances of success.
        <br />
        <br />
        You can unlock higher-level operations by successfully completing them. Higher-level operations are more
        difficult, but grant more rank and experience.
      </Typography>
      <OperationList bladeburner={props.bladeburner} player={props.player} />
    </>
  );
}
