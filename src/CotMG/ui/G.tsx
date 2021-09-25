import * as React from "react";
import { Cell } from "./Cell";

type IProps = {
  width: number;
  height: number;
  colorAt: (x: number, y: number) => string;
};

export function G(props: IProps) {
  // switch the width/length to make axis consistent.
  const elems = [];
  for (let j = 0; j < props.height; j++) {
    const cells = [];
    for (let i = 0; i < props.width; i++) {
      cells.push(<Cell key={i} color={props.colorAt(i, j)} />);
    }
    elems.push(
      <div key={j} className="staneksgift_row">
        {cells}
      </div>,
    );
  }

  return <div style={{ float: "left" }}>{elems}</div>;
}
