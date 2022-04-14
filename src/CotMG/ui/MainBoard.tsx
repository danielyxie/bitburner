import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import * as React from "react";

import { Table } from "../../ui/React/Table";
import { NoneFragment } from "../Fragment";
import type { Fragment } from "../Fragment";
import { FragmentType } from "../FragmentType";
import { calculateGrid, zeros } from "../Helper";
import type { IStaneksGift } from "../IStaneksGift";

import { FragmentInspector } from "./FragmentInspector";
import { FragmentSelector } from "./FragmentSelector";
import { Grid } from "./Grid";

interface IProps {
  gift: IStaneksGift;
}

export function MainBoard(props: IProps): React.ReactElement {
  const [grid, setGrid] = React.useState(calculateGrid(props.gift));
  const [ghostGrid, setGhostGrid] = React.useState(zeros([props.gift.width(), props.gift.height()]));
  const [pos, setPos] = React.useState([0, 0]);
  const [rotation, setRotation] = React.useState(0);
  const [selectedFragment, setSelectedFragment] = React.useState(NoneFragment);

  function moveGhost(worldX: number, worldY: number, rotation: number): void {
    setPos([worldX, worldY]);
    if (selectedFragment.type === FragmentType.None || selectedFragment.type === FragmentType.Delete) return;
    const newgrid = zeros([props.gift.width(), props.gift.height()]);
    for (let y = 0; y < selectedFragment.height(rotation); y++) {
      for (let x = 0; x < selectedFragment.width(rotation); x++) {
        if (!selectedFragment.fullAt(x, y, rotation)) continue;
        if (worldX + x > newgrid.length - 1) continue;
        if (worldY + y > newgrid[worldX + x].length - 1) continue;
        newgrid[worldX + x][worldY + y] = 1;
      }
    }

    setGhostGrid(newgrid);
  }

  function deleteAt(worldX: number, worldY: number): boolean {
    const f = props.gift.fragmentAt(worldX, worldY);
    if (f === undefined) return false;
    return props.gift.delete(f.x, f.y);
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

  function clear(): void {
    props.gift.clear();
    setGrid(zeros([props.gift.width(), props.gift.height()]));
  }

  function updateSelectedFragment(fragment: Fragment): void {
    setSelectedFragment(fragment);
    const newgrid = zeros([props.gift.width(), props.gift.height()]);
    setGhostGrid(newgrid);
  }

  React.useEffect(() => {
    function doRotate(this: Document, event: KeyboardEvent): void {
      if (event.key === "q") {
        const r = (rotation - 1 + 4) % 4;
        setRotation(r);
        moveGhost(pos[0], pos[1], r);
      }
      if (event.key === "e") {
        const r = (rotation + 1) % 4;
        setRotation(r);
        moveGhost(pos[0], pos[1], r);
      }
    }
    document.addEventListener("keydown", doRotate);
    return () => document.removeEventListener("keydown", doRotate);
  });

  return (
    <>
      <Button onClick={clear}>Clear</Button>
      <Box display="flex">
        <Table>
          <Grid
            width={props.gift.width()}
            height={props.gift.height()}
            activeGrid={grid}
            ghostGrid={ghostGrid}
            gift={props.gift}
            enter={(i, j) => moveGhost(i, j, rotation)}
            click={(i, j) => clickAt(i, j)}
          />
        </Table>
        <FragmentInspector gift={props.gift} x={pos[0]} y={pos[1]} fragment={props.gift.fragmentAt(pos[0], pos[1])} />
      </Box>
      <FragmentSelector gift={props.gift} selectFragment={updateSelectedFragment} />
    </>
  );
}
