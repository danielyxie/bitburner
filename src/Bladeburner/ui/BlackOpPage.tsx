import * as React from "react";
import { BlackOpList } from "./BlackOpList";
import { IBladeburner } from "../IBladeburner";
import { IPlayer } from "../../PersonObjects/IPlayer";
import Typography from "@mui/material/Typography";
import { FactionNames } from "../../Faction/data/FactionNames";
import { use } from "../../ui/Context";
import { BlackOperationNames } from "../data/BlackOperationNames";
import { Button } from "@mui/material";
import { CorruptableText } from "../../ui/React/CorruptableText";

interface IProps {
  bladeburner: IBladeburner;
  player: IPlayer;
}

export function BlackOpPage(props: IProps): React.ReactElement {
  const router = use.Router();
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
      {props.bladeburner.blackops[BlackOperationNames.OperationDaedalus] ? (
        <Button sx={{ my: 1, p: 1 }} onClick={() => router.toBitVerse(false, false)}>
          <CorruptableText content="Destroy w0rld_d34mon"></CorruptableText>
        </Button>
      ) : (
        <BlackOpList bladeburner={props.bladeburner} player={props.player} />
      )}
    </>
  );
}
