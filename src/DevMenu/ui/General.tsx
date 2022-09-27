import React, { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Money } from "../../ui/React/Money";
import { Player } from "../../Player";
import { Router } from "../../ui/GameRoot";
import { MenuItem, SelectChangeEvent, TextField, Select } from "@mui/material";
import { Bladeburner } from "../../Bladeburner/Bladeburner";
import { GangConstants } from "../../Gang/data/Constants";
import { FactionNames } from "../../Faction/data/FactionNames";
import { checkForMessagesToSend } from "../../Message/MessageHelpers";

export function General(): React.ReactElement {
  const [error, setError] = useState(false);
  const [corporationName, setCorporationName] = useState("");
  const [gangFaction, setGangFaction] = useState("");

  function addMoney(n: number) {
    return function () {
      Player.gainMoney(n, "other");
    };
  }

  function upgradeRam(): void {
    Player.getHomeComputer().maxRam *= 2;
  }

  function quickB1tFlum3(): void {
    Router.toBitVerse(true, true);
  }

  function b1tflum3(): void {
    Router.toBitVerse(true, false);
  }

  function quickHackW0r1dD43m0n(): void {
    Router.toBitVerse(false, true);
  }

  function hackW0r1dD43m0n(): void {
    Router.toBitVerse(false, false);
  }

  function createCorporation(): void {
    Player.startCorporation(corporationName);
  }

  function joinBladeburner(): void {
    Player.bladeburner = new Bladeburner();
  }

  function startGang(): void {
    const isHacking = gangFaction === FactionNames.NiteSec || gangFaction === FactionNames.TheBlackHand;
    Player.startGang(gangFaction, isHacking);
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
        <Button onClick={addMoney(1e6)}>
          <pre>
            + <Money money={1e6} />
          </pre>
        </Button>
        <Button onClick={addMoney(1e9)}>
          <pre>
            + <Money money={1e9} />
          </pre>
        </Button>
        <Button onClick={addMoney(1e12)}>
          <pre>
            + <Money money={1e12} />
          </pre>
        </Button>
        <Button onClick={addMoney(1e15)}>
          <pre>
            + <Money money={1000e12} />
          </pre>
        </Button>
        <Button onClick={addMoney(Infinity)}>
          <pre>
            + <Money money={Infinity} />
          </pre>
        </Button>
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
