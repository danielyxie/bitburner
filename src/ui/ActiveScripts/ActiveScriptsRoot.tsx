/**
 * Root React Component for the "Active Scripts" UI page. This page displays
 * and provides information about all of the player's scripts that are currently running
 */
import React, { useState, useEffect } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { ActiveScriptsPage } from "./ActiveScriptsPage";
import { RecentScriptsPage } from "./RecentScriptsPage";
import { WorkerScript } from "../../Netscript/WorkerScript";

interface IProps {
  workerScripts: Map<number, WorkerScript>;
}

export function ActiveScriptsRoot(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  const [tab, setTab] = useState<"active" | "recent">("active");
  function handleChange(event: React.SyntheticEvent, tab: "active" | "recent"): void {
    setTab(tab);
  }
  return (
    <>
      <Tabs variant="fullWidth" value={tab} onChange={handleChange}>
        <Tab label={"Active"} value={"active"} />
        <Tab label={"Recent"} value={"recent"} />
      </Tabs>

      {tab === "active" && <ActiveScriptsPage workerScripts={props.workerScripts} />}
      {tab === "recent" && <RecentScriptsPage />}
    </>
  );
}
