import React from "react";

import { BitNodes } from "../BitNode";
import { IRouter } from "../../ui/Router";
import { use } from "../../ui/Context";
import { Modal } from "../../ui/React/Modal";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BitnodeMultiplierDescription } from "./BitnodeMultipliersDescription";

interface IProps {
  open: boolean;
  onClose: () => void;
  n: number;
  level: number;
  destroyedBitNode: number;
  flume: boolean;
  enter: (router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
}

export function PortalModal(props: IProps): React.ReactElement {
  const router = use.Router();
  const bitNodeKey = "BitNode" + props.n;
  const bitNode = BitNodes[bitNodeKey];
  if (bitNode == null) throw new Error(`Could not find BitNode object for number: ${props.n}`);
  const maxSourceFileLevel = props.n === 12 ? "∞" : "3";

  const newLevel = Math.min(props.level + 1, props.n === 12 ? Infinity : 3);
  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Typography variant="h4">
        BitNode-{props.n}: {bitNode.name}
      </Typography>
      <br />
      <Typography>
        Source-File Level: {props.level} / {maxSourceFileLevel}
      </Typography>
      <br />
      <br />
      <Typography> Difficulty: {["easy", "normal", "hard"][bitNode.difficulty]}</Typography>
      <br />
      <br />
      <Typography>{bitNode.info}</Typography>
      <BitnodeMultiplierDescription n={props.n} />
      <br />
      <br />
      <Button
        aria-label={`enter-bitnode-${bitNode.number.toString()}`}
        autoFocus={true}
        onClick={() => {
          props.enter(router, props.flume, props.destroyedBitNode, props.n);
          props.onClose();
        }}
      >
        Enter BN{props.n}.{newLevel}
      </Button>
    </Modal>
  );
}
