import { Box, Table } from "@mui/material";
import * as React from "react";
import { ActiveFragment } from "../ActiveFragment";
import { DummyGift } from "../DummyGift";
import { Grid } from "./Grid";
import { zeros } from "../Helper";

interface IProps {
  width: number;
  height: number;
  fragments: ActiveFragment[];
}

export function DummyGrid(props: IProps): React.ReactElement {
  const gift = new DummyGift(props.width, props.height, props.fragments);
  const ghostGrid = zeros([props.width, props.height]);
  return (
    <Box>
      <Table sx={{ width: props.width, height: props.height }}>
        <Grid
          width={props.width}
          height={props.height}
          ghostGrid={ghostGrid}
          gift={gift}
          enter={() => undefined}
          click={() => undefined}
        />
      </Table>
    </Box>
  );
}
