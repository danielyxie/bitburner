import { IPlayer } from "./PersonObjects/IPlayer";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { IEngine } from "./IEngine";
import { IRouter } from "./ui/Router";

import React from "react";

import { General } from "./DevMenu/ui/General";
import { Stats } from "./DevMenu/ui/Stats";
import { Factions } from "./DevMenu/ui/Factions";
import { Augmentations } from "./DevMenu/ui/Augmentations";
import { SourceFiles } from "./DevMenu/ui/SourceFiles";
import { Programs } from "./DevMenu/ui/Programs";
import { Servers } from "./DevMenu/ui/Servers";
import { Companies } from "./DevMenu/ui/Companies";
import { Bladeburner as BladeburnerElem } from "./DevMenu/ui/Bladeburner";
import { Gang } from "./DevMenu/ui/Gang";
import { Corporation } from "./DevMenu/ui/Corporation";
import { CodingContracts } from "./DevMenu/ui/CodingContracts";
import { StockMarket } from "./DevMenu/ui/StockMarket";
import { Sleeves } from "./DevMenu/ui/Sleeves";
import { TimeSkip } from "./DevMenu/ui/TimeSkip";

interface IProps {
  player: IPlayer;
  engine: IEngine;
  router: IRouter;
}

export function DevMenuRoot(props: IProps): React.ReactElement {
  return (
    <>
      <h1>Development Menu - Only meant to be used for testing/debugging</h1>
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

      <TimeSkip player={props.player} engine={props.engine} />
    </>
  );
}
