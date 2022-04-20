import React, { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { Adjuster } from "./Adjuster";

const bigNumber = 1e27;
import { MenuItem, SelectChangeEvent, TextField, Select } from "@mui/material";
import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { GangConstants } from "../../Gang/data/Constants";
import { FactionNames } from "../../Faction/data/FactionNames";
import { checkForMessagesToSend } from "../../Message/MessageHelpers";

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function General(props: IProps): React.ReactElement {
  const [error, setError] = useState(false);
  const [corporationName, setCorporationName] = useState("");
  const [gangFaction, setGangFaction] = useState("");

  function addTonsMoney(): void {
    props.player.setMoney(props.player.money + bigNumber);
  }

  function modifyMoney(modify: number): (x: number) => void {
    return function (money: number): void {
      props.player.setMoney(props.player.money + money * modify);
    };
  }

  function resetMoney(): void {
    props.player.setMoney(0);
  }

  function upgradeRam(): void {
    props.player.getHomeComputer().maxRam *= 2;
  }

  function quickB1tFlum3(): void {
    props.router.toBitVerse(true, true);
  }

  function b1tflum3(): void {
    props.router.toBitVerse(true, false);
  }

  function quickHackW0r1dD43m0n(): void {
    props.router.toBitVerse(false, true);
  }

  function hackW0r1dD43m0n(): void {
    props.router.toBitVerse(false, false);
  }

  function createCorporation(): void {
    props.player.startCorporation(corporationName);
  }

  function joinBladeburner(): void {
    props.player.bladeburner = new Bladeburner(props.player);
  }

  function startGang(): void {
    const isHacking = gangFaction === FactionNames.NiteSec || gangFaction === FactionNames.TheBlackHand;
    props.player.startGang(gangFaction, isHacking);
  }

  function setGangFactionDropdown(event: SelectChangeEvent<string>): void {
    setGangFaction(event.target.value);
  }

  function checkMessages(): void {
    checkForMessagesToSend();
  }

  useEffect(() => {
    if (error) throw new ReferenceError("Manually thrown error");
  }, [error]);

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>General</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Money:</Typography>
        <Adjuster
          label="money"
          placeholder="amt"
          tons={addTonsMoney}
          add={modifyMoney(1)}
          subtract={modifyMoney(-1)}
          reset={resetMoney}
        />
        <br />
        <Button onClick={upgradeRam}>+ RAM</Button>
        <br />
        <Typography>Corporation Name:</Typography>
        <TextField value={corporationName} onChange={(x) => setCorporationName(x.target.value)} />
        <Button onClick={createCorporation}>Create Corporation</Button>
        <br />
        <Typography>Gang Faction:</Typography>
        <Select value={gangFaction} onChange={setGangFactionDropdown}>
          {GangConstants.Names.map((factionName) => (
            <MenuItem key={factionName} value={factionName}>
              {factionName}
            </MenuItem>
          ))}
        </Select>
        <Button onClick={startGang}>Start Gang</Button>
        <br />
        <Button onClick={joinBladeburner}>Join BladeBurner</Button>
        <br />

        <Button onClick={quickB1tFlum3}>Quick b1t_flum3.exe</Button>
        <Button onClick={b1tflum3}>Run b1t_flum3.exe</Button>
        <Button onClick={quickHackW0r1dD43m0n}>Quick w0rld_d34m0n</Button>
        <Button onClick={hackW0r1dD43m0n}>Hack w0rld_d34m0n</Button>
        <Button onClick={() => setError(true)}>Throw Error</Button>
        <Button onClick={checkMessages}>Check Messages</Button>
      </AccordionDetails>
    </Accordion>
  );
}
