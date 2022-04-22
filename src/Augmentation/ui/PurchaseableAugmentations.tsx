/**
 * React component for displaying a single augmentation for purchase through
 * the faction UI
 */
import React, { useState } from "react";

import { getNextNeurofluxLevel, hasAugmentationPrereqs, purchaseAugmentation } from "../../Faction/FactionHelpers";
import { PurchaseAugmentationModal } from "./PurchaseAugmentationModal";

import { Augmentations } from "../Augmentations";
import { AugmentationNames } from "../data/AugmentationNames";
import { Faction } from "../../Faction/Faction";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import { Reputation } from "../../ui/React/Reputation";

import { CheckBox, CheckBoxOutlineBlank, Verified, Info, Report, CheckCircle } from "@mui/icons-material";
import { Augmentation as AugFormat } from "../../ui/React/Augmentation";
import { Paper, Button, Typography, Tooltip, Box, TableRow, Container, List, ListItem } from "@mui/material";
import { TableCell } from "../../ui/React/Table";
import { Augmentation } from "../Augmentation";

// interface IReqProps {
//   augName: string;
//   p: IPlayer;
//   hasReq: boolean;
//   rep: number;
//   hasRep: boolean;
//   cost: number;
//   hasCost: boolean;
// }

// function Requirements(props: IReqProps): React.ReactElement {
//   const aug = Augmentations[props.augName];
//   if (!props.hasReq) {
//     return (
//       <TableCell key={1} colSpan={2}>
//         <Typography color="error">
//           Requires{" "}
//           {aug.prereqs.map((aug, i) => (
//             <AugFormat key={i} name={aug} />
//           ))}
//         </Typography>
//       </TableCell>
//     );
//   }

//   return (
//     <React.Fragment key="f">
//       <TableCell key={1}>
//         <Typography>
//           <Money money={props.cost} player={props.p} />
//         </Typography>
//       </TableCell>
//       <TableCell key={2}>
//         <Typography color={props.hasRep ? "primary" : "error"}>
//           Requires <Reputation reputation={props.rep} /> faction reputation
//         </Typography>
//       </TableCell>
//     </React.Fragment>
//   );
// }

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
}

export const PurchaseableAugmentations = (props: IPurchaseableAugsProps): React.ReactElement => {
  return (
    <Container
      maxWidth="md"
      disableGutters
      sx={{ mx: 0, display: "grid", gridTemplateColumns: "repeat(1, 1fr)", gap: 1 }}
    >
      {props.augNames.map((augName: string) => {
        const aug = Augmentations[augName];

        const info = typeof aug.info === "string" ? <span>{aug.info}</span> : aug.info;
        const description = (
          <>
            {info}
            <br />
            <br />
            {aug.stats}
          </>
        );

        const ownedPreReqs = aug.prereqs.filter((aug) => props.player.hasAugmentation(aug));
        const hasPreReqs = aug.prereqs.length > 0 && ownedPreReqs.length === aug.prereqs.length;

        return (
          <Paper key={augName} sx={{ p: 1, display: "grid", gridTemplateColumns: "3fr 1fr", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Button
                onClick={() =>
                  props.purchaseAugmentation(props.player, aug, (_open: boolean): void => {
                    null;
                  })
                }
                disabled={!props.canPurchase(props.player, aug)}
                sx={{ width: "48px", height: "48px", float: "left", clear: "none", mr: 1 }}
              >
                Buy
              </Button>

              <Box>
                <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
                  <Tooltip title={<Typography>{description}</Typography>}>
                    <Info sx={{ mr: 1 }} color="info" />
                  </Tooltip>
                  {aug.factions.length === 1 && (
                    <Tooltip80
                      title={
                        <Typography sx={{ color: Settings.theme.info }}>Faction-Exclusive Augmentation</Typography>
                      }
                    >
                      <Verified sx={{ mr: 1 }} color="info" />
                    </Tooltip>
                  )}
                  {aug.name}
                </Typography>

                {aug.prereqs.length > 0 && (
                  <Tooltip
                    title={aug.prereqs.map((preAug) => (
                      <Requirement
                        fulfilled={props.player.hasAugmentation(preAug)}
                        value={preAug}
                        color={Settings.theme.money}
                        key={preAug}
                      />
                    ))}
                  >
                    <Typography
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: hasPreReqs ? Settings.theme.successlight : Settings.theme.error,
                      }}
                    >
                      {hasPreReqs ? (
                        <>
                          <CheckCircle sx={{ mr: 1 }} />
                          Pre-Requisites Owned
                        </>
                      ) : (
                        <>
                          <Report sx={{ mr: 1 }} />
                          Missing Pre-Requisites
                        </>
                      )}
                    </Typography>
                  </Tooltip>
                )}
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <span>
                <Requirement
                  fulfilled={aug.baseCost === 0 || props.player.money > aug.baseCost}
                  value={numeralWrapper.formatMoney(aug.baseCost)}
                  color={Settings.theme.money}
                />
                {props.rep !== undefined && (
                  <Requirement
                    fulfilled={props.rep >= aug.baseRepRequirement}
                    value={`${numeralWrapper.formatReputation(aug.baseRepRequirement)} reputation`}
                    color={Settings.theme.rep}
                  />
                )}
              </span>
            </Box>
          </Paper>
        );
      })}
    </Container>
  );
};

interface IPurchaseableAugProps {
  augName: string;
  faction: Faction;
  p: IPlayer;
  rerender: () => void;
  owned?: boolean;
}

export function PurchaseableAugmentation(props: IPurchaseableAugProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const aug = Augmentations[props.augName];
  if (aug == null) throw new Error(`aug ${props.augName} does not exists`);

  if (aug == null) {
    console.error(
      `Invalid Augmentation when trying to create PurchaseableAugmentation display element: ${props.augName}`,
    );
    return <></>;
  }

  const moneyCost = aug.baseCost;
  const repCost = aug.baseRepRequirement;
  const hasReq = hasAugmentationPrereqs(aug);
  const hasRep = props.faction.playerReputation >= repCost;
  const hasCost = aug.baseCost === 0 || props.p.money > aug.baseCost;

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
      setOpen(true);
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
          <PurchaseAugmentationModal
            open={open}
            onClose={() => setOpen(false)}
            aug={aug}
            faction={props.faction}
            rerender={props.rerender}
          />
        </TableCell>
      )}
      <TableCell key={1}>
        <Box display="flex">
          <Tooltip title={<Typography>{tooltip}</Typography>} placement="top">
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
