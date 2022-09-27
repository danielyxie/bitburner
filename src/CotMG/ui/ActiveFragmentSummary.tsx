import React from "react";
import { ActiveFragment } from "../ActiveFragment";
import { StaneksGift } from "../StaneksGift";
import { FragmentType, Effect } from "../FragmentType";
import { numeralWrapper } from "../../ui/numeralFormat";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import { TableBody, TableCell, TableRow } from "@mui/material";

type IProps = {
  gift: StaneksGift;
};

function formatEffect(effect: number, type: FragmentType): string {
  if (Effect(type).includes("+x%")) {
    return Effect(type).replace(/-*x%/, numeralWrapper.formatPercentage(effect - 1));
  } else if (Effect(type).includes("-x%")) {
    const perc = numeralWrapper.formatPercentage(1 - 1 / effect);
    return Effect(type).replace(/-x%/, perc);
  } else {
    return Effect(type);
  }
}

export function ActiveFragmentSummary(props: IProps): React.ReactElement {
  const summary: { coordinate: { x: number; y: number }[]; effect: number; type: FragmentType }[] = [];
  // Iterate through Active Fragment
  props.gift.fragments.forEach((fragment: ActiveFragment) => {
    const f = fragment.fragment();
    // Discard ToolBrush and Booster.
    if (![FragmentType.Booster, FragmentType.None, FragmentType.Delete].includes(f.type)) {
      // Check for an existing entry in summary for this fragment's type
      const entry = summary.find((e) => {
        return e.type === f.type;
      });
      if (entry) {
        // If there's one, update the existing entry
        entry.effect *= props.gift.effect(fragment);
        entry.coordinate.push({ x: fragment.x, y: fragment.y });
      } else {
        // If there's none, create a new entry
        summary.push({
          coordinate: [{ x: fragment.x, y: fragment.y }],
          effect: props.gift.effect(fragment),
          type: f.type,
        });
      }
    }
  });

  return (
    <Paper sx={{ mb: 1 }}>
      <Typography variant="h5">Summary of active fragments:</Typography>
      <Table sx={{ display: "table", width: "100%" }}>
        <TableBody>
          <TableRow>
            <TableCell sx={{ borderBottom: "none", p: 0, m: 0 }}>
              <Typography>Coordinate</Typography>
            </TableCell>

            <TableCell sx={{ borderBottom: "none", p: 0, m: 0 }}>
              <Typography>Effect</Typography>
            </TableCell>
          </TableRow>
          {summary.map((entry) => {
            return (
              <TableRow key={entry.type}>
                <TableCell sx={{ borderBottom: "none", p: 0, m: 0 }}>
                  <Typography>
                    {entry.coordinate.map((coord) => {
                      return "[" + coord.x + "," + coord.y + "]";
                    })}
                  </Typography>
                </TableCell>

                <TableCell sx={{ borderBottom: "none", p: 0, m: 0 }}>
                  <Typography>{formatEffect(entry.effect, entry.type)}</Typography>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
