/**
 * React component for a selectable option on the Faction UI. These
 * options including working for the faction, hacking missions, purchasing
 * augmentations, etc.
 */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import * as React from "react";

type IProps = {
  buttonText: string;
  infoText: string;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
};

export function Option(props: IProps): React.ReactElement {
  return (
    <Box>
      <Paper sx={{ my: 1, p: 1 }}>
        <Button onClick={props.onClick}>{props.buttonText}</Button>
        <Typography>{props.infoText}</Typography>
      </Paper>
    </Box>
  );
}
