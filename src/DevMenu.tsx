import Typography from "@mui/material/Typography";
import React, { useEffect } from "react";

import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { Achievements } from "./DevMenu/ui/Achievements";
import { Augmentations } from "./DevMenu/ui/Augmentations";
import { Bladeburner as BladeburnerElem } from "./DevMenu/ui/Bladeburner";
import { CodingContracts } from "./DevMenu/ui/CodingContracts";
import { Companies } from "./DevMenu/ui/Companies";
import { Corporation } from "./DevMenu/ui/Corporation";
import { Entropy } from "./DevMenu/ui/Entropy";
import { Factions } from "./DevMenu/ui/Factions";
import { Gang } from "./DevMenu/ui/Gang";
import { General } from "./DevMenu/ui/General";
import { Programs } from "./DevMenu/ui/Programs";
import { Servers } from "./DevMenu/ui/Servers";
import { Sleeves } from "./DevMenu/ui/Sleeves";
import { SourceFiles } from "./DevMenu/ui/SourceFiles";
import { Stanek } from "./DevMenu/ui/Stanek";
import { Stats } from "./DevMenu/ui/Stats";
import { StockMarket } from "./DevMenu/ui/StockMarket";
import { TimeSkip } from "./DevMenu/ui/TimeSkip";
import { Exploit } from "./Exploits/Exploit";
import type { IEngine } from "./IEngine";
import type { IPlayer } from "./PersonObjects/IPlayer";
import type { IRouter } from "./ui/Router";

interface IProps {
  player: IPlayer;
  engine: IEngine;
  router: IRouter;
}

export function DevMenuRoot(props: IProps): React.ReactElement {
  useEffect(() => {
    props.player.giveExploit(Exploit.YoureNotMeantToAccessThis);
  }, []);
  return (
    <>
      <Typography>Development Menu - Only meant to be used for testing/debugging</Typography>
      <General player={props.player} router={props.router} />
      <Stats player={props.player} />
      <Factions player={props.player} />
      <Augmentations player={props.player} />
      <SourceFiles player={props.player} />
      <Programs player={props.player} />
      <Servers />
      <Companies />

      {props.player.bladeburner instanceof Bladeburner && <BladeburnerElem player={props.player} />}

      {props.player.inGang() && <Gang player={props.player} />}

      {props.player.hasCorporation() && <Corporation player={props.player} />}

      <CodingContracts />

      {props.player.hasWseAccount && <StockMarket />}

      {props.player.sleeves.length > 0 && <Sleeves player={props.player} />}
      {props.player.augmentations.some((aug) => aug.name === AugmentationNames.StaneksGift1) && <Stanek />}

      <TimeSkip player={props.player} engine={props.engine} />
      <Achievements player={props.player} engine={props.engine} />
      <Entropy player={props.player} engine={props.engine} />
    </>
  );
}
