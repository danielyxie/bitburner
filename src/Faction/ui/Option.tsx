/**
 * React component for a selectable option on the Faction UI. These
 * options including working for the faction, hacking missions, purchasing
 * augmentations, etc.
 */
import * as React from "react";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

type IProps = {
  buttonText: string;
  infoText: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

export function Option(props: IProps): React.ReactElement {
  return (
    <Box>
      <Paper sx={{ my: 1, p: 1, width: "100%" }}>
        <Button onClick={props.onClick}>{props.buttonText}</Button>
        <Typography>{props.infoText}</Typography>
      </Paper>
    </Box>
  );
}
