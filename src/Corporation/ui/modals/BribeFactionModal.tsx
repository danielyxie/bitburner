import React, { useState } from "react";
import { Factions } from "../../../Faction/Factions";
import { CorporationConstants } from "../../data/Constants";
import { numeralWrapper } from "../../../ui/numeralFormat";
import { dialogBoxCreate } from "../../../ui/React/DialogBox";
import { Modal } from "../../../ui/React/Modal";
import { Player } from "@player";
import { useCorporation } from "../Context";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { NumberInput } from "../../../ui/React/NumberInput";
import Box from "@mui/material/Box";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface IProps {
  open: boolean;
  onClose: () => void;
}

export function BribeFactionModal(props: IProps): React.ReactElement {
  const factions = Player.factions.filter((name: string) => {
    const info = Factions[name].getInfo();
    if (!info.offersWork()) return false;
    if (Player.hasGangWith(name)) return false;
    return true;
  });
  const corp = useCorporation();
  const [money, setMoney] = useState<number>(NaN);
  const [selectedFaction, setSelectedFaction] = useState(factions.length > 0 ? factions[0] : "");
  const disabled = money === 0 || isNaN(money) || money < 0 || corp.funds < money;

  function changeFaction(event: SelectChangeEvent<string>): void {
    setSelectedFaction(event.target.value);
  }

  function repGain(money: number): number {
    return money / CorporationConstants.BribeToRepRatio;
  }

  function getRepText(money: number): string {
    if (money === 0) return "";
    if (isNaN(money) || money < 0) {
      return "ERROR: Invalid value(s) entered";
    } else if (corp.funds < money) {
      return "ERROR: You do not have this much money to bribe with";
    } else {
      return (
        "You will gain " +
        numeralWrapper.formatReputation(repGain(money)) +
        " reputation with " +
        selectedFaction +
        " with this bribe"
      );
    }
  }

  function bribe(money: number): void {
    const fac = Factions[selectedFaction];
    if (disabled) return;
    const rep = repGain(money);
    dialogBoxCreate(`You gained ${numeralWrapper.formatReputation(rep)} reputation with ${fac.name} by bribing them.`);
    fac.playerReputation += rep;
    corp.funds = corp.funds - money;
    props.onClose();
  }

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography>
        You can use Corporation funds or stock shares to bribe Faction Leaders in exchange for faction reputation.
      </Typography>
      <Box display="flex" alignItems="center">
        <Typography>Faction:</Typography>
        <Select value={selectedFaction} onChange={changeFaction}>
          {factions.map((name: string) => {
            const info = Factions[name].getInfo();
            if (!info.offersWork()) return;
            if (Player.hasGangWith(name)) return;
            return (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            );
          })}
        </Select>
      </Box>
      <Typography>{getRepText(money ? money : 0)}</Typography>
      <NumberInput onChange={setMoney} placeholder="Corporation funds" />
      <Button disabled={disabled} sx={{ mx: 1 }} onClick={() => bribe(money ? money : 0)}>
        Bribe
      </Button>
    </Modal>
  );
}
