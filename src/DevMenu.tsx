import { AugmentationNames } from "./Augmentation/data/AugmentationNames";
import { CodingContractTypes } from "./CodingContracts";
import { generateContract, generateRandomContract, generateRandomContractOnHome } from "./CodingContractGenerator";
import { IPlayer } from "./PersonObjects/IPlayer";
import { Bladeburner } from "./Bladeburner/Bladeburner";
import { IEngine } from "./IEngine";
import { saveObject } from "./SaveObject";

import { dialogBoxCreate } from "../utils/DialogBox";
import { Money } from "./ui/React/Money";
import { TextField } from "./ui/React/TextField";
import { Button } from "./ui/React/Button";
import { Select } from "./ui/React/Select";

import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import IconButton from "@material-ui/core/IconButton";
import ExposureZeroIcon from "@material-ui/icons/ExposureZero";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import DoubleArrowIcon from "@material-ui/icons/DoubleArrow";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ReplyIcon from "@material-ui/icons/Reply";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import { Theme } from "./ui/React/Theme";

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
}

export function DevMenuRoot(props: IProps): React.ReactElement {
  return (
    <Theme>
      <>
        <h1>Development Menu - Only meant to be used for testing/debugging</h1>
        <General player={props.player} />
        <Stats player={props.player} />
        <Factions player={props.player} />
        <Augmentations player={props.player} />
        <SourceFiles player={props.player} />
        <Programs player={props.player} />
        <Servers player={props.player} />
        <Companies player={props.player} />

        {props.player.bladeburner instanceof Bladeburner && <BladeburnerElem player={props.player} />}

        {props.player.inGang() && <Gang player={props.player} />}

        {props.player.hasCorporation() && <Corporation player={props.player} />}

        <CodingContracts player={props.player} />

        {props.player.hasWseAccount && <StockMarket player={props.player} />}

        {props.player.sleeves.length > 0 && <Sleeves player={props.player} />}

        <TimeSkip player={props.player} engine={props.engine} />
      </>
    </Theme>
  );
}
