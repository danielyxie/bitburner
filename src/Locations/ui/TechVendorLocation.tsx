/**
 * React Subcomponent for displaying a location's UI, when that location is a tech vendor
 *
 * This subcomponent renders all of the buttons for purchasing things from tech vendors
 */
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";

import { getPurchaseServerCost } from "../../Server/ServerPurchases";
import { use } from "../../ui/Context";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Money } from "../../ui/React/Money";
import type { Location } from "../Location";

import { CoresButton } from "./CoresButton";
import { PurchaseServerModal } from "./PurchaseServerModal";
import { RamButton } from "./RamButton";
import { TorButton } from "./TorButton";

interface IServerProps {
  ram: number;
  rerender: () => void;
}

function ServerButton(props: IServerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const player = use.Player();
  const cost = getPurchaseServerCost(props.ram);
  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={!player.canAfford(cost)}>
        Purchase {numeralWrapper.formatRAM(props.ram)} Server&nbsp;-&nbsp;
        <Money money={cost} player={player} />
      </Button>
      <PurchaseServerModal
        open={open}
        onClose={() => setOpen(false)}
        ram={props.ram}
        cost={cost}
        rerender={props.rerender}
      />
    </>
  );
}

type IProps = {
  loc: Location;
};

export function TechVendorLocation(props: IProps): React.ReactElement {
  const player = use.Player();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  const purchaseServerButtons: React.ReactNode[] = [];
  for (let i = props.loc.techVendorMinRam; i <= props.loc.techVendorMaxRam; i *= 2) {
    purchaseServerButtons.push(<ServerButton key={i} ram={i} rerender={rerender} />);
  }

  return (
    <>
      <br />
      <Box sx={{ display: "grid", width: "fit-content" }}>{purchaseServerButtons}</Box>
      <br />
      <Typography>
        <i>"You can order bigger servers via scripts. We don't take custom orders in person."</i>
      </Typography>
      <br />
      <TorButton p={player} rerender={rerender} />
      <br />
      <RamButton p={player} rerender={rerender} />
      <br />
      <CoresButton p={player} rerender={rerender} />
    </>
  );
}
