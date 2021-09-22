/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import * as React from "react";

import { getNextNeurofluxLevel, hasAugmentationPrereqs, purchaseAugmentation } from "../FactionHelpers";
import { PurchaseAugmentationPopup } from "./PurchaseAugmentationPopup";

import { Augmentations } from "../../Augmentation/Augmentations";
import { AugmentationNames } from "../../Augmentation/data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";
import { createPopup } from "../../ui/React/createPopup";
import { IMap } from "../../types";

import { StdButton } from "../../ui/React/StdButton";
import { Augmentation as AugFormat } from "../../ui/React/Augmentation";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Box from "@mui/material/Box";
import { TableCell } from "../../ui/React/Table";
import TableRow from "@mui/material/TableRow";

interface IReqProps {
  augName: string;
  p: IPlayer;
  hasReq: boolean;
  rep: number;
  hasRep: boolean;
  cost: number;
  hasCost: boolean;
}

function Requirements(props: IReqProps): React.ReactElement {
  const aug = Augmentations[props.augName];
  if (!props.hasReq) {
    return (
      <TableCell key={1} colSpan={2}>
        <Typography color="error">
          Requires{" "}
          {aug.prereqs.map((aug, i) => (
            <AugFormat key={i} name={aug} />
          ))}
        </Typography>
      </TableCell>
    );
  }

  let color = !props.hasRep || !props.hasCost ? "error" : "primary";
  return (
    <React.Fragment key="f">
      <TableCell key={1}>
        <Typography color={color}>
          <Money money={props.cost} player={props.p} />
        </Typography>
      </TableCell>
      <TableCell key={2}>
        <Typography color={color}>Requires {Reputation(props.rep)} faction reputation</Typography>
      </TableCell>
    </React.Fragment>
  );
}

interface IProps {
  augName: string;
  faction: Faction;
  p: IPlayer;
  rerender: () => void;
  owned?: boolean;
}

export function PurchaseableAugmentation(props: IProps): React.ReactElement {
  const aug = Augmentations[props.augName];
  if (aug == null) throw new Error(`aug ${props.augName} does not exists`);

  function getMoneyCost(): number {
    return aug.baseCost * props.faction.getInfo().augmentationPriceMult;
  }

  function getRepCost(): number {
    return aug.baseRepRequirement * props.faction.getInfo().augmentationRepRequirementMult;
  }

  // Whether the player has the prerequisite Augmentations
  function hasPrereqs(): boolean {
    return hasAugmentationPrereqs(aug);
  }

  // Whether the player has enough rep for this Augmentation
  function hasReputation(): boolean {
    return props.faction.playerReputation >= getRepCost();
  }

  // Whether the player has this augmentations (purchased OR installed)
  function owned(): boolean {
    let owned = false;
    for (const queuedAug of props.p.queuedAugmentations) {
      if (queuedAug.name === props.augName) {
        owned = true;
        break;
      }
    }

    for (const installedAug of props.p.augmentations) {
      if (installedAug.name === props.augName) {
        owned = true;
        break;
      }
    }

    return owned;
  }

  if (aug == null) {
    console.error(
      `Invalid Augmentation when trying to create PurchaseableAugmentation display element: ${props.augName}`,
    );
    return <></>;
  }

  const moneyCost = getMoneyCost();
  const repCost = getRepCost();
  const hasReq = hasPrereqs();
  const hasRep = hasReputation();
  const hasCost = aug.baseCost !== 0 && props.p.money.gt(aug.baseCost * props.faction.getInfo().augmentationPriceMult);

  // Determine UI properties
  const color: "error" | "primary" = !hasReq || !hasRep || !hasCost ? "error" : "primary";

  // Determine button txt
  let btnTxt = aug.name;
  if (aug.name === AugmentationNames.NeuroFluxGovernor) {
    btnTxt += ` - Level ${getNextNeurofluxLevel()}`;
  }

  let tooltip = <></>;
  if (typeof aug.info === "string") {
    tooltip = (
      <>
        <span>{aug.info}</span>
        <br />
        <br />
        {aug.stats}
      </>
    );
  } else
    tooltip = (
      <>
        {aug.info}
        <br />
        <br />
        {aug.stats}
      </>
    );

  function handleClick(): void {
    if (color === "error") return;
    if (!Settings.SuppressBuyAugmentationConfirmation) {
      const popupId = "purchase-augmentation-popup";
      createPopup(popupId, PurchaseAugmentationPopup, {
        aug: aug,
        faction: props.faction,
        player: props.p,
        rerender: props.rerender,
        popupId: popupId,
      });
    } else {
      purchaseAugmentation(aug, props.faction);
      props.rerender();
    }
  }

  return (
    <TableRow>
      {!props.owned && (
        <TableCell key={0}>
          <Button onClick={handleClick} color={color}>
            Buy
          </Button>
        </TableCell>
      )}
      <TableCell key={1}>
        <Box display="flex">
          <Tooltip
            title={<Typography>{tooltip}</Typography>}
            placement="top"
            disableFocusListener
            disableTouchListener
            enterNextDelay={1000}
            enterDelay={500}
            leaveDelay={0}
            leaveTouchDelay={0}
          >
            <Typography>{btnTxt}</Typography>
          </Tooltip>
        </Box>
      </TableCell>
      {!props.owned && (
        <Requirements
          key={2}
          augName={props.augName}
          p={props.p}
          cost={moneyCost}
          rep={repCost}
          hasReq={hasReq}
          hasRep={hasRep}
          hasCost={hasCost}
        />
      )}
    </TableRow>
  );
}
