import React, { useState } from "react";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { WorkerScriptAccordion } from "./WorkerScriptAccordion";
import List from "@mui/material/List";
import TablePagination from "@mui/material/TablePagination";
import { TablePaginationActionsAll } from "../React/TablePaginationActionsAll";

interface IProps {
  workerScripts: WorkerScript[];
}

export function ServerAccordionContent(props: IProps): React.ReactElement {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <List dense disablePadding>
        {props.workerScripts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ws) => (
          <WorkerScriptAccordion key={`${ws.name}_${ws.args}`} workerScript={ws} />
        ))}
      </List>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
        component="div"
        count={props.workerScripts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActionsAll}
      />
    </>
  );
}
