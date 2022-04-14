import Typography from "@mui/material/Typography";
import * as React from "react";

import { FactionNames } from "../../Faction/data/FactionNames";
import type { IPlayer } from "../../PersonObjects/IPlayer";
import type { IBladeburner } from "../IBladeburner";

import { BlackOpList } from "./BlackOpList";

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
