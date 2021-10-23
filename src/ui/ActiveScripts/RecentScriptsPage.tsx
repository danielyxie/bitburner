/**
 * Root React Component for the "Active Scripts" UI page. This page displays
 * and provides information about all of the player's scripts that are currently running
 */
import React from "react";
import Typography from "@mui/material/Typography";

import { recentScripts } from "../../Netscript/RecentScripts";
import { RecentScriptAccordion } from "./RecentScriptAccordion";

export function RecentScriptsPage(): React.ReactElement {
  return (
    <>
      <Typography>List of all recently killed scripts.</Typography>
      {recentScripts.map((r) => (
        <RecentScriptAccordion key={r.pid} recentScript={r} />
      ))}
    </>
  );
}
