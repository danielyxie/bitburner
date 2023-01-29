import * as React from "react";

import makeStyles from "@mui/styles/makeStyles";
import { TableCell as MuiTableCell, TableCellProps } from "@mui/material";

const useStyles = makeStyles({
  root: {
    border: "1px solid white",
    width: "5px",
    height: "5px",
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

type IProps = {
  onMouseEnter?: () => void;
  onClick?: () => void;
  color: string;
};

export function Cell(cellProps: IProps): React.ReactElement {
  return (
    <TableCell
      style={{ backgroundColor: cellProps.color }}
      onMouseEnter={cellProps.onMouseEnter}
      onClick={cellProps.onClick}
    ></TableCell>
  );
}
