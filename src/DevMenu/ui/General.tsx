import React, { useEffect, useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Money } from "../../ui/React/Money";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";
import { TextField } from "@mui/material";

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function General(props: IProps): React.ReactElement {
  const [error, setError] = useState(false);
  const [nextBitVerse, setNextBitVerse] = useState(0);

  function addMoney(n: number) {
    return function () {
      props.player.gainMoney(n, "other");
    };
  }

  function upgradeRam(): void {
    props.player.getHomeComputer().maxRam *= 2;
  }

  function changeBitVerse(): void {
    props.router.toBitVerse(true, true, nextBitVerse);
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
    if (error) throw new ReferenceError("Manually thrown error");
  }, [error]);

  function handleSetNextBitVerse(e: React.ChangeEvent<HTMLInputElement>): void {
    let tempNextBitVerse = parseInt(e.target.value);
    if (isNaN(tempNextBitVerse)) {
      tempNextBitVerse = 0;
    }
    setNextBitVerse(tempNextBitVerse);
  }

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

        <TextField value={nextBitVerse} onChange={handleSetNextBitVerse} />
        <Button disabled={!nextBitVerse} onClick={changeBitVerse}>
          Quick BitVerse Change
        </Button>

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
