/**
 * React Component for rendering the Accordion elements for all servers
 * on which scripts are running
 */
import React, { useState, useEffect } from "react";

import { ServerAccordion } from "./ServerAccordion";

import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import TablePagination from "@mui/material/TablePagination";
import { WorkerScript } from "../../Netscript/WorkerScript";
import { WorkerScriptStartStopEventEmitter } from "../../Netscript/WorkerScriptStartStopEventEmitter";
import { getServer } from "../../Server/ServerHelpers";
import { BaseServer } from "../../Server/BaseServer";
import { TablePaginationActionsAll } from "../React/TablePaginationActionsAll";

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

type IState = {
  rerenderFlag: boolean;
};

const subscriberId = "ActiveScriptsUI";

export function ServerAccordions(props: IProps): React.ReactElement {
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    WorkerScriptStartStopEventEmitter.addSubscriber({
      cb: rerender,
      id: subscriberId,
    });
    return () => WorkerScriptStartStopEventEmitter.removeSubscriber(subscriberId);
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setFilter(event.target.value);
    setPage(0);
  }

  const serverToScriptMap: IServerToScriptsMap = {};
  for (const ws of props.workerScripts.values()) {
    const server = getServer(ws.serverIp);
    if (server == null) {
      console.warn(`WorkerScript has invalid IP address: ${ws.serverIp}`);
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

  const filtered = Object.values(serverToScriptMap).filter((data) => data && data.server.hostname.includes(filter));

  return (
    <>
      <TextField
        value={filter}
        onChange={handleFilterChange}
        color="primary"
        autoFocus
        variant="standard"
        InputProps={{
          startAdornment: <Typography m={1}>Filter:</Typography>,
          spellCheck: false,
        }}
      />
      <List>
        {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data) => {
          return (
            data && (
              <ServerAccordion key={data.server.hostname} server={data.server} workerScripts={data.workerScripts} />
            )
          );
        })}
      </List>
      <TablePagination
        rowsPerPageOptions={[10, 15, 20]}
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
