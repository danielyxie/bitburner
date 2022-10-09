import { Player } from "@player";
import { AugmentationNames } from "./Augmentation/data/AugmentationNames";

import React, { useEffect } from "react";

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
import { Stanek } from "./DevMenu/ui/Stanek";
import { TimeSkip } from "./DevMenu/ui/TimeSkip";
import { SaveFile } from "./DevMenu/ui/SaveFile";
import { Achievements } from "./DevMenu/ui/Achievements";
import { Entropy } from "./DevMenu/ui/Entropy";
import Typography from "@mui/material/Typography";
import { Exploit } from "./Exploits/Exploit";

export function DevMenuRoot(): React.ReactElement {
  useEffect(() => {
    Player.giveExploit(Exploit.YoureNotMeantToAccessThis);
  }, []);
  return (
    <>
      <Typography>Development Menu - Only meant to be used for testing/debugging</Typography>
      <General />
      <Stats />
      <Factions />
      <Augmentations />
      <SourceFiles />
      <Programs />
      <Servers />
      <Companies />

      {Player.bladeburner && <BladeburnerElem />}

      {Player.gang && <Gang />}

      {Player.corporation && <Corporation />}

      <CodingContracts />

      {Player.hasWseAccount && <StockMarket />}

      {Player.sleeves.length > 0 && <Sleeves />}
      {Player.augmentations.some((aug) => aug.name === AugmentationNames.StaneksGift1) && <Stanek />}

      <TimeSkip />
      <Achievements />
      <Entropy />
      <SaveFile />
    </>
  );
}
