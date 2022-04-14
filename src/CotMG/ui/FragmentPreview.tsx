import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import * as React from "react";

import { Table } from "../../ui/React/Table";

import { Cell } from "./Cell";

type IProps = {
  width: number;
  height: number;
  colorAt: (x: number, y: number) => string;
};

export function FragmentPreview(props: IProps): React.ReactElement {
  // switch the width/length to make axis consistent.
  const elems = [];
  for (let j = 0; j < props.height; j++) {
    const cells = [];
    for (let i = 0; i < props.width; i++) {
      cells.push(<Cell key={i} color={props.colorAt(i, j)} />);
    }
    elems.push(<TableRow key={j}>{cells}</TableRow>);
  }

  return (
    <Table>
      <TableBody>{elems}</TableBody>
    </Table>
  );
}
