import React from "react";
import { SourceFile } from "./SourceFile";
import { IMap } from "../types";

export const SourceFiles: IMap<SourceFile> = {};

SourceFiles["SourceFile1"] = new SourceFile(
  1,
  (
    <>
      This Source-File lets the player start with 32GB of RAM on his/her home computer. It also increases all of the
      player's multipliers by:
      <br />
      <br />
      Level 1: 16%
      <br />
      Level 2: 24%
      <br />
      Level 3: 28%
    </>
  ),
);
SourceFiles["SourceFile2"] = new SourceFile(
  2,
  (
    <>
      This Source-File allows you to form gangs in other BitNodes once your karma decreases to a certain value. It also
      increases the player's crime success rate, crime money, and charisma multipliers by:
      <br />
      <br />
      Level 1: 24%
      <br />
      Level 2: 36%
      <br />
      Level 3: 42%
    </>
  ),
);
SourceFiles["SourceFile3"] = new SourceFile(
  3,
  (
    <>
      This Source-File lets you create corporations on other BitNodes (although some BitNodes will disable this
      mechanic). This Source-File also increases your charisma and company salary multipliers by:
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
SourceFiles["SourceFile4"] = new SourceFile(
  4,
  (
    <>
      This Source-File lets you access and use the Singularity Functions in every BitNode. Every level of this
      Source-File opens up more of the Singularity Functions you can use.
    </>
  ),
);
SourceFiles["SourceFile5"] = new SourceFile(
  5,
  (
    <>
      This Source-File grants a special new stat called Intelligence. Intelligence is unique because it is permanent and
      persistent (it never gets reset back to 1). However, gaining Intelligence experience is much slower than other
      stats, and it is also hidden (you won't know when you gain experience and how much). Higher Intelligence levels
      will boost your production for many actions in the game. In addition, this Source-File will unlock the
      getBitNodeMultipliers() and getServer() Netscript functions, as well as the formulas API, and will raise all of
      your hacking-related multipliers by:
      <br />
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
SourceFiles["SourceFile6"] = new SourceFile(
  6,
  (
    <>
      This Source-File allows you to access the NSA's Bladeburner Division in other BitNodes. In addition, this
      Source-File will raise both the level and experience gain rate of all your combat stats by:
      <br />
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
SourceFiles["SourceFile7"] = new SourceFile(
  7,
  (
    <>
      This Source-File allows you to access the Bladeburner Netscript API in other BitNodes. In addition, this
      Source-File will increase all of your Bladeburner multipliers by:
      <br />
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
SourceFiles["SourceFile8"] = new SourceFile(
  8,
  (
    <>
      This Source-File grants the following benefits:
      <br />
      <br />
      Level 1: Permanent access to WSE and TIX API
      <br />
      Level 2: Ability to short stocks in other BitNodes
      <br />
      Level 3: Ability to use limit/stop orders in other BitNodes
      <br />
      <br />
      This Source-File also increases your hacking growth multipliers by:
      <br />
      Level 1: 12%
      <br />
      Level 2: 18%
      <br />
      Level 3: 21%
    </>
  ),
);
SourceFiles["SourceFile9"] = new SourceFile(
  9,
  (
    <>
      This Source-File grants the following benefits:
      <br />
      <br />
      Level 1: Permanently unlocks the Hacknet Server in other BitNodes
      <br />
      Level 2: You start with 128GB of RAM on your home computer when entering a new BitNode
      <br />
      Level 3: Grants a highly-upgraded Hacknet Server when entering a new BitNode
      <br />
      <br />
      (Note that the Level 3 effect of this Source-File only applies when entering a new BitNode, NOT when installing
      Augmentations)
      <br />
      <br />
      This Source-File also increases your hacknet multipliers by:
      <br />
      Level 1: 8%
      <br />
      Level 2: 12%
      <br />
      Level 3: 14%
    </>
  ),
);
SourceFiles["SourceFile10"] = new SourceFile(
  10,
  (
    <>
      This Source-File unlocks Sleeve technology in other BitNodes. Each level of this Source-File also grants you a
      Duplicate Sleeve
    </>
  ),
);
SourceFiles["SourceFile11"] = new SourceFile(
  11,
  (
    <>
      This Source-File makes it so that company favor increases BOTH the player's salary and reputation gain rate at
      that company by 1% per favor (rather than just the reputation gain). This Source-File also increases the player's
      company salary and reputation gain multipliers by:
      <br />
      <br />
      Level 1: 32%
      <br />
      Level 2: 48%
      <br />
      Level 3: 56%
      <br />
      <br />
      It also reduces the price increase for every aug bought by:
      <br />
      <br />
      Level 1: 4%
      <br />
      Level 2: 6%
      <br />
      Level 3: 7%
    </>
  ),
);
SourceFiles["SourceFile12"] = new SourceFile(
  12,
  <>This Source-File lets the player start with Neuroflux Governor equal to the level of this Source-File.</>,
);
SourceFiles["SourceFile13"] = new SourceFile(
  13,
  <>Each level of this Source-File increases the size of Stanek's Gift.</>,
);
