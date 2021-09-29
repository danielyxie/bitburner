import React, { useState } from "react";
import { Factions } from "../../Faction/Factions";
import { CorporationConstants } from "../data/Constants";
import { numeralWrapper } from "../../ui/numeralFormat";
import { dialogBoxCreate } from "../../ui/React/DialogBox";
import { Modal } from "../../ui/React/Modal";
import { use } from "../../ui/Context";
import { useCorporation } from "./Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function BribeFactionModal(props: IProps): React.ReactElement {
  const player = use.Player();
  const corp = useCorporation();
  const [money, setMoney] = useState<number | null>(0);
  const [stock, setStock] = useState<number | null>(0);
  const [selectedFaction, setSelectedFaction] = useState(
    player.factions.length > 0 ? player.factions.filter((faction) => Factions[faction].getInfo().offersWork())[0] : "",
  );

  function onMoneyChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setMoney(parseFloat(event.target.value));
  }

  function onStockChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setStock(parseFloat(event.target.value));
  }

  function changeFaction(event: SelectChangeEvent<string>): void {
    setSelectedFaction(event.target.value);
  }

  function repGain(money: number, stock: number): number {
    return (money + stock * corp.sharePrice) / CorporationConstants.BribeToRepRatio;
  }

  function getRepText(money: number, stock: number): string {
    if (money === 0 && stock === 0) return "";
    if (isNaN(money) || isNaN(stock) || money < 0 || stock < 0) {
      return "ERROR: Invalid value(s) entered";
    } else if (corp.funds.lt(money)) {
      return "ERROR: You do not have this much money to bribe with";
    } else if (stock > corp.numShares) {
      return "ERROR: You do not have this many shares to bribe with";
    } else {
      return (
        "You will gain " +
        numeralWrapper.formatReputation(repGain(money, stock)) +
        " reputation with " +
        selectedFaction +
        " with this bribe"
      );
    }
  }

  function bribe(money: number, stock: number): void {
    const fac = Factions[selectedFaction];
    if (fac == null) {
      dialogBoxCreate("ERROR: You must select a faction to bribe");
    }
    if (isNaN(money) || isNaN(stock) || money < 0 || stock < 0) {
    } else if (corp.funds.lt(money)) {
    } else if (stock > corp.numShares) {
    } else {
      const rep = repGain(money, stock);
      dialogBoxCreate(
        "You gained " + numeralWrapper.formatReputation(rep) + " reputation with " + fac.name + " by bribing them.",
      );
      fac.playerReputation += rep;
      corp.funds = corp.funds.minus(money);
      corp.numShares -= stock;
      props.onClose();
    }
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        You can use Corporation funds or stock shares to bribe Faction Leaders in exchange for faction reputation.
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography>Faction:</Typography>
        <Select variant="standard" value={selectedFaction} onChange={changeFaction}>
          {player.factions.map((name: string) => {
            const info = Factions[name].getInfo();
            if (!info.offersWork()) return;
            return (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Typography>{getRepText(money ? money : 0, stock ? stock : 0)}</Typography>
      <TextField variant="standard" onChange={onMoneyChange} placeholder="Corporation funds" />
      <TextField sx={{ mx: 1 }} variant="standard" onChange={onStockChange} placeholder="Stock Shares" />
      <Button sx={{ mx: 1 }} onClick={() => bribe(money ? money : 0, stock ? stock : 0)}>
        Bribe
      </Button>
    </Modal>
  );
}
