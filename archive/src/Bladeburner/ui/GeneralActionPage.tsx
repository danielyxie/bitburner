import * as React from "react";
import { GeneralActionList } from "./GeneralActionList";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";
import Typography from "@mui/material/Typography";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function GeneralActionPage(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>These are generic actions that will assist you in your Bladeburner duties.</Typography>
      <GeneralActionList bladeburner={props.bladeburner} player={props.player} />
    </>
  );
}
