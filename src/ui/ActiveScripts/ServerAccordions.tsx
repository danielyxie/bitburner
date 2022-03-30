/**
 * React Component for rendering the Accordion elements for all servers
 * on which scripts are running
 */
import React, { useState, useEffect } from "react";

import { ServerAccordion } from "./ServerAccordion";

import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import TablePagination from "@mui/material/TablePagination";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";
import { GetServer } from "../../Server/AllServers";
import { BaseServer } from "../../Server/BaseServer";
import { Settings } from "../../Settings/Settings";
import { TablePaginationActionsAll } from "../React/TablePaginationActionsAll";
import SearchIcon from "@mui/icons-material/Search";

// Map of server hostname -> all workerscripts on that server for all active scripts
interface IServerData {
  server: BaseServer;
  workerScripts: WorkerScript[];
}

interface IServerToScriptsMap {
  [key: string]: IServerData | undefined;
}

type IProps = {
  workerScripts: Map<number, WorkerScript>;
};

export function ServerAccordions(props: IProps): React.ReactElement {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(Settings.ActiveScriptsServerPageSize);
  const setRerender = useState(false)[1];

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    Settings.ActiveScriptsServerPageSize = parseInt(event.target.value, 10);
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setFilter(event.target.value);
    setPage(0);
  }

  const serverToScriptMap: IServerToScriptsMap = {};
  for (const ws of props.workerScripts.values()) {
    const server = GetServer(ws.hostname);
    if (server == null) {
      console.warn(`WorkerScript has invalid hostname: ${ws.hostname}`);
      continue;
    }

    let data = serverToScriptMap[server.hostname];

    if (data === undefined) {
      serverToScriptMap[server.hostname] = {
        server: server,
        workerScripts: [],
      };
      data = serverToScriptMap[server.hostname];
    }
    if (data !== undefined) data.workerScripts.push(ws);
  }

  const filtered = Object.values(serverToScriptMap).filter(
    (data) =>
      data &&
      (data.server.hostname.includes(filter) || data.server.runningScripts.find((s) => s.filename.includes(filter))),
  );

  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => WorkerScriptStartStopEventEmitter.subscribe(rerender));

  return (
    <>
      <TextField
        value={filter}
        onChange={handleFilterChange}
        autoFocus
        InputProps={{
          startAdornment: <SearchIcon />,
          spellCheck: false,
        }}
      />
      <List dense={true}>
        {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => {
          return (
            data && (
              <ServerAccordion key={data.server.hostname} server={data.server} workerScripts={data.workerScripts} />
            )
          );
        })}
      </List>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20, 100]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        ActionsComponent={TablePaginationActionsAll}
      />
    </>
  );
}
