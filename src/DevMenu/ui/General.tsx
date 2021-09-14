import React from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { Money } from "../../ui/React/Money";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { hackWorldDaemon } from "../../RedPill";

interface IProps {
  player: IPlayer;
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
    hackWorldDaemon(props.player.bitNodeN, true, true);
  }

  function b1tflum3(): void {
    hackWorldDaemon(props.player.bitNodeN, true);
  }

  function quickHackW0r1dD43m0n(): void {
    hackWorldDaemon(props.player.bitNodeN, false, true);
  }

  function hackW0r1dD43m0n(): void {
    hackWorldDaemon(props.player.bitNodeN);
  }

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>General</h2>
      </AccordionSummary>
      <AccordionDetails>
        <div>
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
        </div>
        <div>
          <Button onClick={quickB1tFlum3}>Quick b1t_flum3.exe</Button>
          <Button onClick={b1tflum3}>Run b1t_flum3.exe</Button>
          <Button onClick={quickHackW0r1dD43m0n}>Quick w0rld_d34m0n</Button>
          <Button onClick={hackW0r1dD43m0n}>Hack w0rld_d34m0n</Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
