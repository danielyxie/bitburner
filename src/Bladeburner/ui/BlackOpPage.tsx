import * as React from "react";
import { BlackOpList } from "./BlackOpList";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";
import Typography from "@mui/material/Typography";
import { FactionNames } from "../../Faction/data/FactionNames";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function BlackOpPage(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>
        Black Operations (Black Ops) are special, one-time covert operations. Each Black Op must be unlocked
        successively by completing the one before it.
        <br />
        <br />
        <b>
          Your ultimate goal to climb through the ranks of {FactionNames.Bladeburners} is to complete all of the Black
          Ops.
        </b>
        <br />
        <br />
        Like normal operations, you may use a team for Black Ops. Failing a black op will incur heavy HP and rank
        losses.
      </Typography>
      <BlackOpList bladeburner={props.bladeburner} player={props.player} />
    </>
  );
}
