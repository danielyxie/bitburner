import React from "react";
import { SourceFileMinus1 } from "./SourceFileMinus1";
import { OwnedSourceFiles } from "./OwnedSourceFiles";
import List from "@mui/material/List";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export function SourceFiles(): React.ReactElement {
  return (
    <>
      <Typography variant="h4">Source Files</Typography>
      <Box mx={2}>
        <List dense>
          <SourceFileMinus1 />
          <OwnedSourceFiles />
        </List>
      </Box>
    </>
  );
}
