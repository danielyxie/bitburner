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

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function General(props: IProps): React.ReactElement {
  const [error, setError] = useState(false);

  function addTonsMoney(): void {
    props.player.setMoney(bigNumber);
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

  useEffect(() => {
    if (error) throw new ReferenceError('Manually thrown error');
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

        <Button onClick={quickB1tFlum3}>Quick b1t_flum3.exe</Button>
        <Button onClick={b1tflum3}>Run b1t_flum3.exe</Button>
        <Button onClick={quickHackW0r1dD43m0n}>Quick w0rld_d34m0n</Button>
        <Button onClick={hackW0r1dD43m0n}>Hack w0rld_d34m0n</Button>
        <Button onClick={() => setError(true)}>Throw Error</Button>
      </AccordionDetails>
    </Accordion>
  );
}
