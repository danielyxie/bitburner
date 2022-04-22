/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import React, { useState } from "react";

import { hasAugmentationPrereqs, purchaseAugmentation } from "../../Faction/FactionHelpers";
import { PurchaseAugmentationModal } from "./PurchaseAugmentationModal";

import { Augmentations } from "../Augmentations";
import { AugmentationNames } from "../data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";

import { CheckBox, CheckBoxOutlineBlank, NewReleases, Info, Report, CheckCircle } from "@mui/icons-material";
import { Augmentation as AugFormat } from "../../ui/React/Augmentation";
import { Paper, Button, Typography, Tooltip, Box, TableRow, Container, List, ListItem } from "@mui/material";
import { TableCell } from "../../ui/React/Table";
import { getNextNeuroFluxLevel } from "../../Augmentation/AugmentationHelpers";
import { Augmentation } from "../Augmentation";

interface IPreReqsProps {
  player: IPlayer;
  aug: Augmentation;
}

const PreReqs = (props: IPreReqsProps): React.ReactElement => {
  const ownedPreReqs = props.aug.prereqs.filter((aug) => props.player.hasAugmentation(aug));
  const hasPreReqs = props.aug.prereqs.length > 0 && ownedPreReqs.length === props.aug.prereqs.length;

  return (
    <Tooltip
      title={
        <Typography sx={{ color: Settings.theme.money }}>
          This Augmentation has the following pre-requisite(s):
          {props.aug.prereqs.map((preAug) => (
            <Requirement
              fulfilled={props.player.hasAugmentation(preAug)}
              value={preAug}
              color={Settings.theme.money}
              key={preAug}
            />
          ))}
        </Typography>
      }
    >
      <Typography
        variant="body2"
        sx={{
          display: "flex",
          alignItems: "center",
          color: hasPreReqs ? Settings.theme.successlight : Settings.theme.error,
        }}
      >
        {hasPreReqs ? (
          <>
            <CheckCircle fontSize="small" sx={{ mr: 1 }} />
            Pre-requisites Owned
          </>
        ) : (
          <>
            <Report fontSize="small" sx={{ mr: 1 }} />
            Missing {props.aug.prereqs.length - ownedPreReqs.length} pre-requisite(s)
          </>
        )}
      </Typography>
    </Tooltip>
  );
};

interface IExclusiveProps {
  player: IPlayer;
  aug: Augmentation;
}

const Exclusive = (props: IExclusiveProps): React.ReactElement => {
  return (
    <Tooltip
      title={
        <Typography sx={{ color: Settings.theme.money }}>
          This Augmentation can only be acquired from the following source(s):
          <ul>
            <li>
              <b>{props.aug.factions[0]}</b> faction
            </li>
            {props.player.canAccessGang() && !props.aug.isSpecial && (
              <li>
                Certain <b>gangs</b>
              </li>
            )}
            {props.player.canAccessGrafting() && !props.aug.isSpecial && (
              <li>
                <b>Grafting</b>
              </li>
            )}
          </ul>
        </Typography>
      }
    >
      <NewReleases sx={{ ml: 1, color: Settings.theme.money, rotate: "180deg" }} />
    </Tooltip>
  );
};

interface IReqProps {
  value: string;
  color: string;
  fulfilled: boolean;
}

const Requirement = (props: IReqProps): React.ReactElement => {
  return (
    <Typography sx={{ display: "flex", alignItems: "center", color: props.color }}>
      {props.fulfilled ? <CheckBox sx={{ mr: 1 }} /> : <CheckBoxOutlineBlank sx={{ mr: 1 }} />}
      {props.value}
    </Typography>
  );
};

interface IPurchaseableAugsProps {
  augNames: string[];
  player: IPlayer;

  canPurchase: (player: IPlayer, aug: Augmentation) => boolean;
  purchaseAugmentation: (player: IPlayer, aug: Augmentation, showModal: (open: boolean) => void) => void;

  rep?: number;
  skipPreReqs?: boolean;
  skipExclusiveIndicator?: boolean;
  faction?: Faction;
}

export const PurchaseableAugmentations = (props: IPurchaseableAugsProps): React.ReactElement => {
  return (
    <Container
      maxWidth="md"
      disableGutters
      sx={{ mx: 0, display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 1 }}
    >
      {props.augNames.map((augName: string) => (
        <PurchaseableAugmentation key={augName} parent={props} augName={augName} />
      ))}
    </Container>
  );
};

interface IPurchaseableAugProps {
  parent: IPurchaseableAugsProps;
  augName: string;
}

export function PurchaseableAugmentation(props: IPurchaseableAugProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const aug = Augmentations[props.augName];

  const info = typeof aug.info === "string" ? <span>{aug.info}</span> : aug.info;
  const description = (
    <>
      {info}
      <br />
      <br />
      {aug.stats}
    </>
  );

  return (
    <>
      <Paper key={props.augName} sx={{ p: 1, display: "grid", gridTemplateColumns: "minmax(0, 3fr) 1fr", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() =>
              props.parent.purchaseAugmentation(props.parent.player, aug, (open): void => {
                setOpen(open);
              })
            }
            disabled={!props.parent.canPurchase(props.parent.player, aug)}
            sx={{ width: "48px", height: "48px", float: "left", clear: "none", mr: 1 }}
          >
            Buy
          </Button>

          <Box sx={{ maxWidth: "85%" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Tooltip
                title={
                  <>
                    <Typography variant="h5">
                      {props.augName}
                      {props.augName === AugmentationNames.NeuroFluxGovernor && ` - Level ${getNextNeuroFluxLevel()}`}
                    </Typography>
                    <Typography>{description}</Typography>
                  </>
                }
              >
                <Info sx={{ mr: 1 }} color="info" />
              </Tooltip>
              <Typography
                variant="h6"
                sx={{
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {aug.name}
                {aug.name === AugmentationNames.NeuroFluxGovernor && ` - Level ${getNextNeuroFluxLevel()}`}
              </Typography>
              {aug.factions.length === 1 && !props.parent.skipExclusiveIndicator && (
                <Exclusive player={props.parent.player} aug={aug} />
              )}
            </Box>

            {aug.prereqs.length > 0 && !props.parent.skipPreReqs && <PreReqs player={props.parent.player} aug={aug} />}
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <span>
            <Requirement
              fulfilled={aug.baseCost === 0 || props.parent.player.money > aug.baseCost}
              value={numeralWrapper.formatMoney(aug.baseCost)}
              color={Settings.theme.money}
            />
            {props.parent.rep !== undefined && (
              <Requirement
                fulfilled={props.parent.rep >= aug.baseRepRequirement}
                value={`${numeralWrapper.formatReputation(aug.baseRepRequirement)} reputation`}
                color={Settings.theme.rep}
              />
            )}
          </span>
        </Box>
      </Paper>
      <PurchaseAugmentationModal open={open} onClose={() => setOpen(false)} faction={props.parent.faction} aug={aug} />
    </>
  );
}
