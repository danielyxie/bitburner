import Typography from "@mui/material/Typography";
import * as React from "react";

import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { IBladeburner } from "../IBladeburner";

import { GeneralActionList } from "./GeneralActionList";

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
