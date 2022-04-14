import { Box, Table } from "@mui/material";
import * as React from "react";

import type { ActiveFragment } from "../ActiveFragment";
import { DummyGift } from "../DummyGift";
import { calculateGrid, zeros } from "../Helper";

import { Grid } from "./Grid";

interface IProps {
  width: number;
  height: number;
  fragments: ActiveFragment[];
}

export function DummyGrid(props: IProps): React.ReactElement {
  const gift = new DummyGift(props.width, props.height, props.fragments);
  const activeGrid = calculateGrid(gift);
  const ghostGrid = zeros([props.width, props.height]);
  return (
    <Box>
      <Table sx={{ width: props.width, height: props.height }}>
        <Grid
          width={props.width}
          height={props.height}
          activeGrid={activeGrid}
          ghostGrid={ghostGrid}
          gift={gift}
          enter={() => undefined}
          click={() => undefined}
        />
      </Table>
    </Box>
  );
}
