import * as React from "react";
import { Fragment, NoneFragment } from "../Fragment";
import { ActiveFragment } from "../ActiveFragment";
import { FragmentType } from "../FragmentType";
import { IStaneksGift } from "../IStaneksGift";
import { Cell } from "./Cell";
import { FragmentInspector } from "./FragmentInspector";
import { FragmentSelector } from "./FragmentSelector";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import { Table } from "../../ui/React/Table";

function zeros(dimensions: number[]): any {
  const array = [];

  for (let i = 0; i < dimensions[0]; ++i) {
    array.push(dimensions.length == 1 ? 0 : zeros(dimensions.slice(1)));
  }

  return array;
}

function randomColor(fragment: ActiveFragment): string {
  // Can't set Math.random seed so copy casino. TODO refactor both RNG later.
  let s1 = Math.pow((fragment.x + 1) * (fragment.y + 1), 10);
  let s2 = s1;
  let s3 = s1;

  const colors = [];
  for (let i = 0; i < 3; i++) {
    s1 = (171 * s1) % 30269;
    s2 = (172 * s2) % 30307;
    s3 = (170 * s3) % 30323;
    colors.push((s1 / 30269.0 + s2 / 30307.0 + s3 / 30323.0) % 1.0);
  }

  return `rgb(${colors[0] * 256}, ${colors[1] * 256}, ${colors[2] * 256})`;
}

interface IProps {
  gift: IStaneksGift;
}

export function MainBoard(props: IProps): React.ReactElement {
  function calculateGrid(gift: IStaneksGift): any {
    const newgrid = zeros([gift.width(), gift.height()]);
    for (let i = 0; i < gift.width(); i++) {
      for (let j = 0; j < gift.height(); j++) {
        const fragment = gift.fragmentAt(i, j);
        if (fragment === null) continue;
        newgrid[i][j] = 1;
      }
    }

    return newgrid;
  }

  const [grid, setGrid] = React.useState(calculateGrid(props.gift));
  const [ghostGrid, setGhostGrid] = React.useState(zeros([props.gift.width(), props.gift.height()]));
  const [pos, setPos] = React.useState([0, 0]);
  const [rotation, setRotation] = React.useState(0);
  const [selectedFragment, setSelectedFragment] = React.useState(NoneFragment);

  function moveGhost(worldX: number, worldY: number): void {
    if (selectedFragment.type === FragmentType.None || selectedFragment.type === FragmentType.Delete) return;
    const newgrid = zeros([props.gift.width(), props.gift.height()]);
    for (let y = 0; y < selectedFragment.height(rotation); y++) {
      for (let x = 0; x < selectedFragment.width(rotation); x++) {
        console.log([x, y]);
        if (!selectedFragment.fullAt(x, y, rotation, true)) continue;
        if (worldX + x > newgrid.length - 1) continue;
        if (worldY + y > newgrid[worldX + x].length - 1) continue;
        newgrid[worldX + x][worldY + y] = 1;
      }
    }

    setGhostGrid(newgrid);
    setPos([worldX, worldY]);
  }

  function deleteAt(worldX: number, worldY: number): boolean {
    return props.gift.deleteAt(worldX, worldY);
  }

  function clickAt(worldX: number, worldY: number): void {
    if (selectedFragment.type == FragmentType.None) return;
    if (selectedFragment.type == FragmentType.Delete) {
      deleteAt(worldX, worldY);
    } else {
      if (!props.gift.canPlace(worldX, worldY, rotation, selectedFragment)) return;
      props.gift.place(worldX, worldY, rotation, selectedFragment);
    }
    setGrid(calculateGrid(props.gift));
  }

  function color(worldX: number, worldY: number): string {
    if (ghostGrid[worldX][worldY] && grid[worldX][worldY]) return "red";
    if (ghostGrid[worldX][worldY]) return "white";
    if (grid[worldX][worldY]) {
      const fragment = props.gift.fragmentAt(worldX, worldY);
      if (fragment === null) throw new Error("ActiveFragment should not be null");
      return randomColor(fragment);
    }
    return "";
  }

  function clear(): void {
    props.gift.clear();
    setGrid(zeros([props.gift.width(), props.gift.height()]));
  }

  // switch the width/length to make axis consistent.
  const elems = [];
  for (let j = 0; j < props.gift.height(); j++) {
    const cells = [];
    for (let i = 0; i < props.gift.width(); i++) {
      cells.push(
        <Cell key={i} onMouseEnter={() => moveGhost(i, j)} onClick={() => clickAt(i, j)} color={color(i, j)} />,
      );
    }
    elems.push(
      <TableRow key={j} className="staneksgift_row">
        {cells}
      </TableRow>,
    );
  }

  function updateSelectedFragment(fragment: Fragment): void {
    setSelectedFragment(fragment);
    const newgrid = zeros([props.gift.width(), props.gift.height()]);
    setGhostGrid(newgrid);
  }

  React.useEffect(() => {
    function doRotate(this: Document, event: KeyboardEvent): void {
      if (event.key === "q") {
        setRotation((rotation - 1 + 4) % 4);
        console.log((rotation - 1 + 4) % 4);
      }
      if (event.key === "e") {
        setRotation((rotation + 1) % 4);
        console.log((rotation + 1) % 4);
      }
    }
    document.addEventListener("keydown", doRotate);
    return () => document.removeEventListener("keydown", doRotate);
  });

  // try {
  //   console.log(selectedFragment);
  // } catch (err) {}

  return (
    <>
      <Button onClick={clear}>Clear</Button>
      <Box display="flex">
        <Table>
          <TableBody>{elems}</TableBody>
        </Table>
        <FragmentInspector gift={props.gift} x={pos[0]} y={pos[1]} fragment={props.gift.fragmentAt(pos[0], pos[1])} />
      </Box>
      <FragmentSelector gift={props.gift} selectFragment={updateSelectedFragment} />
    </>
  );
}
