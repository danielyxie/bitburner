import React, { useState, useEffect } from "react";
import { Sleeve } from "../Sleeve";
import { findSleevePurchasableAugs } from "../SleeveHelpers";
import { Augmentations } from "../../../Augmentation/Augmentations";
import { Augmentation } from "../../../Augmentation/Augmentation";
import { Money } from "../../../ui/React/Money";
import { Modal } from "../../../ui/React/Modal";
import { use } from "../../../ui/Context";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableBody from "@mui/material/TableBody";
import Table from "@mui/material/Table";
import { TableCell } from "../../../ui/React/Table";
import TableRow from "@mui/material/TableRow";

interface IProps {
  open: boolean;
  onClose: () => void;
  sleeve: Sleeve;
}

export function SleeveAugmentationsModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 150);
    return () => clearInterval(id);
  }, []);

  // Array of all owned Augmentations. Names only
  const ownedAugNames = props.sleeve.augmentations.map((e) => e.name);

  // You can only purchase Augmentations that are actually available from
  // your factions. I.e. you must be in a faction that has the Augmentation
  // and you must also have enough rep in that faction in order to purchase it.
  const availableAugs = findSleevePurchasableAugs(props.sleeve, player);

  function purchaseAugmentation(aug: Augmentation): void {
    props.sleeve.tryBuyAugmentation(player, aug);
    rerender();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <>
        <Typography>
          You can purchase Augmentations for your Duplicate Sleeves. These Augmentations have the same effect as they
          would for you. You can only purchase Augmentations that you have unlocked through Factions.
          <br />
          <br />
          When purchasing an Augmentation for a Duplicate Sleeve, they are immediately installed. This means that the
          Duplicate Sleeve will immediately lose all of its stat experience.
        </Typography>
        <Table size="small" padding="none">
          <TableBody>
            {availableAugs.map((aug) => {
              return (
                <TableRow key={aug.name}>
                  <TableCell>
                    <Button onClick={() => purchaseAugmentation(aug)} disabled={player.money < aug.startingCost}>
                      Buy
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Box display="flex">
                      <Tooltip title={aug.stats || ""}>
                        <Typography>{aug.name}</Typography>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Money money={aug.startingCost} player={player} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {ownedAugNames.length > 0 && (
          <>
            <Typography>Owned Augmentations:</Typography>
            {ownedAugNames.map((augName) => {
              const aug = Augmentations[augName];
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
              } else {
                tooltip = (
                  <>
                    {aug.info}
                    <br />
                    <br />
                    {aug.stats}
                  </>
                );
              }

              return (
                <Tooltip key={augName} title={<Typography>{tooltip}</Typography>}>
                  <Paper>
                    <Typography>{augName}</Typography>
                  </Paper>
                </Tooltip>
              );
            })}
          </>
        )}
      </>
    </Modal>
  );
}
