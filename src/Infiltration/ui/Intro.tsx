import { Report } from "@mui/icons-material";
import { Box, Button, Container, Paper, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Location } from "../../Locations/Location";
import { Settings } from "../../Settings/Settings";
import { numeralWrapper } from "../../ui/numeralFormat";

interface IProps {
  Location: Location;
  Difficulty: number;
  MaxLevel: number;
  start: () => void;
  cancel: () => void;
}

function arrowPart(color: string, length: number): JSX.Element {
  let arrow = "";
  if (length <= 0) length = 0;
  else if (length > 13) length = 13;
  else {
    length--;
    arrow = ">";
  }
  return (
    <span style={{ color: color }}>
      {"=".repeat(length)}
      {arrow}
      {" ".repeat(13 - arrow.length - length)}
    </span>
  );
}

function coloredArrow(difficulty: number): JSX.Element {
  if (difficulty === 0) {
    return (
      <span style={{ color: "white" }}>
        {">"}
        {" ".repeat(38)}
      </span>
    );
  } else {
    return (
      <>
        {arrowPart(Settings.theme.primary, difficulty * 13)}
        {arrowPart(Settings.theme.warning, (difficulty - 1) * 13)}
        {arrowPart(Settings.theme.error, (difficulty - 2) * 13)}
      </>
    );
  }
}

export function Intro(props: IProps): React.ReactElement {
  return (
    <Container sx={{ alignItems: "center" }}>
      <Paper sx={{ p: 1, mb: 1, display: "grid", justifyItems: "center" }}>
        <Typography variant="h4">
          Infiltrating <b>{props.Location.name}</b>
        </Typography>
        <Typography variant="h6">
          <b>Maximum Level: </b>
          {props.MaxLevel}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color:
              props.Difficulty > 2
                ? Settings.theme.error
                : props.Difficulty > 1
                ? Settings.theme.warning
                : Settings.theme.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          <b>Difficulty:&nbsp;</b>
          {numeralWrapper.format(props.Difficulty * 33.3333, "0")} / 100
          {props.Difficulty > 1.5 && (
            <Tooltip
              title={
                <Typography color="error">
                  This location is too heavily guarded for your current stats. It is recommended that you try training,
                  or finding an easier location.
                </Typography>
              }
            >
              <Report sx={{ ml: 1 }} />
            </Tooltip>
          )}
        </Typography>

        <Typography sx={{ lineHeight: "1em", whiteSpace: "pre" }}>[{coloredArrow(props.Difficulty)}]</Typography>
        <Typography
          sx={{ lineHeight: "1em", whiteSpace: "pre" }}
        >{` ^            ^            ^           ^`}</Typography>
        <Typography
          sx={{ lineHeight: "1em", whiteSpace: "pre" }}
        >{` Trivial    Normal        Hard    Impossible`}</Typography>
      </Paper>

      <Paper sx={{ p: 1, textAlign: "center", display: "grid", justifyItems: "center" }}>
        <Typography sx={{ width: "75%" }}>
          <b>Infiltration</b> is a series of short minigames that get progressively harder. You take damage for failing
          them. Reaching the maximum level rewards you with intel that you can trade for money or reputation.
          <br />
          <br />
          <b>Gameplay:</b>
        </Typography>
        <ul>
          <Typography>
            <li>
              The minigames you play are randomly selected.
              <br />
              It might take you few tries to get used to them.
            </li>
            <li>No game requires use of the mouse.</li>
            <li>
              <b>Spacebar</b> is the default action/confirm button.
            </li>
            <li>
              The <b>arrow keys</b> and <b>WASD</b> can be used interchangeably.
            </li>
            <li>Sometimes the rest of the keyboard is used.</li>
          </Typography>
        </ul>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "100%" }}>
          <Button onClick={props.start}>Start</Button>
          <Button onClick={props.cancel}>Cancel</Button>
        </Box>
      </Paper>
    </Container>
  );
}
