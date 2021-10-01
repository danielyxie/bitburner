import React from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Button from "@mui/material/Button";
import { Money } from "../../ui/React/Money";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { IRouter } from "../../ui/Router";

interface IProps {
  player: IPlayer;
  router: IRouter;
}

export function General(props: IProps): React.ReactElement {
  function addMoney(n: number) {
    return function () {
      props.player.gainMoney(n);
    };
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

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>General</h2>
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

        <Button onClick={quickB1tFlum3}>Quick b1t_flum3.exe</Button>
        <Button onClick={b1tflum3}>Run b1t_flum3.exe</Button>
        <Button onClick={quickHackW0r1dD43m0n}>Quick w0rld_d34m0n</Button>
        <Button onClick={hackW0r1dD43m0n}>Hack w0rld_d34m0n</Button>
      </AccordionDetails>
    </Accordion>
  );
}
