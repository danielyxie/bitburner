import React from "react";
import { TableCell as MuiTableCell, TableCellProps, Table as MuiTable, TableProps } from "@mui/material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles({
  root: {
    borderBottom: "none",
  },
  small: {
    width: "1px",
  },
});

export const TableCell: React.FC<TableCellProps> = (props: TableCellProps) => {
  return (
    <MuiTableCell
      {...props}
      classes={{
        root: useStyles().root,
        ...props.classes,
      }}
    />
  );
};

export const Table: React.FC<TableProps> = (props: TableProps) => {
  return (
    <MuiTable
      {...props}
      classes={{
        root: useStyles().small,
        ...props.classes,
      }}
    />
  );
};
