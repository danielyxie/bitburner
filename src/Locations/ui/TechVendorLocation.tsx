/**
 * React Subcomponent for displaying a location's UI, when that location is a tech vendor
 *
 * This subcomponent renders all of the buttons for purchasing things from tech vendors
 */
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Location } from "../Location";
import { RamButton } from "./RamButton";
import { TorButton } from "./TorButton";
import { CoresButton } from "./CoresButton";

import { getPurchaseServerCost } from "../../Server/ServerPurchases";

import { Money } from "../../ui/React/Money";
import { Player } from "../../Player";
import { PurchaseServerModal } from "./PurchaseServerModal";
import { numeralWrapper } from "../../ui/numeralFormat";
import { Box } from "@mui/material";

interface IServerProps {
  ram: number;
  rerender: () => void;
}

function ServerButton(props: IServerProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const cost = getPurchaseServerCost(props.ram);
  return (
    <>
      <Button onClick={() => setOpen(true)} disabled={!Player.canAfford(cost)}>
        Purchase {numeralWrapper.formatRAM(props.ram)} Server&nbsp;-&nbsp;
        <Money money={cost} forPurchase={true} />
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
      <TorButton rerender={rerender} />
      <br />
      <RamButton rerender={rerender} />
      <br />
      <CoresButton rerender={rerender} />
    </>
  );
}
