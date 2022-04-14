import { TableCell, TableRow, Typography } from "@mui/material";
import React from "react";

import { formatNumber } from "../../utils/StringHelperFunctions";
import { numeralWrapper } from "../numeralFormat";

import { characterOverviewStyles as useStyles } from "./CharacterOverview";

interface ITableRowData {
  content?: string;
  level?: number;
  exp?: number;
}

interface IProps {
  name: string;
  color: string;
  classes?: any;
  data: ITableRowData;
  children?: React.ReactElement;
}

export const StatsRow = ({ name, color, classes = useStyles(), children, data }: IProps): React.ReactElement => {
  let content;

  if (data.content !== undefined) {
    content = data.content;
  } else if (data.level !== undefined && data.exp !== undefined) {
    content = `${formatNumber(data.level, 0)} (${numeralWrapper.formatExp(data.exp)} exp)`;
  } else if (data.level !== undefined && data.exp === undefined) {
    content = `${formatNumber(data.level, 0)}`;
  }

  return (
    <TableRow>
      <TableCell classes={{ root: classes.cellNone }}>
        <Typography style={{ color: color }}>{name}</Typography>
      </TableCell>
      <TableCell align="right" classes={{ root: classes.cellNone }}>
        {content ? <Typography style={{ color: color }}>{content}</Typography> : <></>}
        {children}
      </TableCell>
    </TableRow>
  );
};
