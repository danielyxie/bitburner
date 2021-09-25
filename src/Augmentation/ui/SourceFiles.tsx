import React from "react";
import { use } from "../../ui/Context";
import { SourceFileMinus1 } from "./SourceFileMinus1";
import { OwnedSourceFiles } from "./OwnedSourceFiles";
import List from "@mui/material/List";

import Typography from "@mui/material/Typography";

export function SourceFiles(): React.ReactElement {
  const player = use.Player();
  return (
    <>
      <Typography variant="h4">Source Files</Typography>
      <List dense>
        <SourceFileMinus1 />
        <OwnedSourceFiles />
      </List>
    </>
  );
}
