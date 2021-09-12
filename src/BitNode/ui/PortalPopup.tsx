import React from "react";

import { BitNodes } from "../BitNode";
import { removePopup } from "../../ui/React/createPopup";
interface IProps {
  n: number;
  level: number;
  destroyedBitNode: number;
  flume: boolean;
  enter: (flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
  popupId: string;
}

export function PortalPopup(props: IProps): React.ReactElement {
  const bitNodeKey = "BitNode" + props.n;
  const bitNode = BitNodes[bitNodeKey];
  if (bitNode == null) throw new Error(`Could not find BitNode object for number: ${props.n}`);
  const maxSourceFileLevel = props.n === 12 ? "∞" : "3";

  const newLevel = Math.min(props.level + 1, props.n === 12 ? Infinity : 3);
  return (
    <>
      <h1>
        BitNode-{props.n}: {bitNode.name}
      </h1>
      <br />
      Source-File Level: {props.level} / {maxSourceFileLevel}
      <br />
      <br />
      {bitNode.info}
      <br />
      <br />
      <button
        className="std-button"
        onClick={() => {
          props.enter(props.flume, props.destroyedBitNode, props.n);
          removePopup(props.popupId);
        }}
      >
        Enter BN{props.n}.{newLevel}
      </button>
    </>
  );
}
