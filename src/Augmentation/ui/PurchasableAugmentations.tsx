/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import { CheckBox, CheckBoxOutlineBlank, CheckCircle, Info, NewReleases, Report } from "@mui/icons-material";
import { Box, Button, Container, Paper, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";
import { getNextNeuroFluxLevel } from "../AugmentationHelpers";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Augmentation } from "../Augmentation";
import { Augmentations } from "../Augmentations";
import { AugmentationNames } from "../data/AugmentationNames";
import { PurchaseAugmentationModal } from "./PurchaseAugmentationModal";

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
            {props.player.canAccessGrafting() &&
              !props.aug.isSpecial &&
              props.aug.name !== AugmentationNames.TheRedPill && (
                <li>
                  <b>Grafting</b>
                </li>
              )}
          </ul>
        </Typography>
      }
    >
      <NewReleases sx={{ ml: 1, color: Settings.theme.money, transform: "rotate(180deg)" }} />
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

interface IPurchasableAugsProps {
  augNames: string[];
  ownedAugNames: string[];
  player: IPlayer;

  canPurchase: (player: IPlayer, aug: Augmentation) => boolean;
  purchaseAugmentation: (player: IPlayer, aug: Augmentation, showModal: (open: boolean) => void) => void;

  rep?: number;
  sleeveAugs?: boolean;
  faction?: Faction;
}

export const PurchasableAugmentations = (props: IPurchasableAugsProps): React.ReactElement => {
  return (
    <Container
      maxWidth="md"
      disableGutters
      sx={{ mx: 0, display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 1 }}
    >
      {props.augNames.map((augName: string) => (
        <PurchasableAugmentation key={augName} parent={props} augName={augName} owned={false} />
      ))}
      {props.ownedAugNames.map((augName: string) => (
        <PurchasableAugmentation key={augName} parent={props} augName={augName} owned={true} />
      ))}
    </Container>
  );
};

interface IPurchasableAugProps {
  parent: IPurchasableAugsProps;
  augName: string;
  owned: boolean;
}

export function PurchasableAugmentation(props: IPurchasableAugProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  const aug = Augmentations[props.augName];

  const cost = props.parent.sleeveAugs ? aug.startingCost : aug.baseCost;

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
      <Paper
        key={props.augName}
        sx={{
          p: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 3fr) 1fr",
          gap: 1,
          opacity: props.owned ? 0.75 : 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            onClick={() =>
              props.parent.purchaseAugmentation(props.parent.player, aug, (open): void => {
                setOpen(open);
              })
            }
            disabled={!props.parent.canPurchase(props.parent.player, aug) || props.owned}
            sx={{ width: "48px", height: "48px", float: "left", clear: "none", mr: 1 }}
          >
            {props.owned ? "Owned" : "Buy"}
          </Button>

          <Box sx={{ maxWidth: props.owned ? "100%" : "85%" }}>
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
              {aug.factions.length === 1 && !props.parent.sleeveAugs && (
                <Exclusive player={props.parent.player} aug={aug} />
              )}
            </Box>

            {aug.prereqs.length > 0 && !props.parent.sleeveAugs && <PreReqs player={props.parent.player} aug={aug} />}
          </Box>
        </Box>

        {props.owned || (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <span>
              <Requirement
                fulfilled={aug.baseCost === 0 || props.parent.player.money > cost}
                value={numeralWrapper.formatMoney(cost)}
                color={Settings.theme.money}
              />
              {props.parent.rep !== undefined && (
                <Requirement
                  fulfilled={props.parent.rep >= aug.baseRepRequirement}
                  value={`${numeralWrapper.formatReputation(aug.baseRepRequirement)} rep`}
                  color={Settings.theme.rep}
                />
              )}
            </span>
          </Box>
        )}
      </Paper>
      <PurchaseAugmentationModal open={open} onClose={() => setOpen(false)} faction={props.parent.faction} aug={aug} />
    </>
  );
}
