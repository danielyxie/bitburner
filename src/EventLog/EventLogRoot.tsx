import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import { Box, Tooltip } from "@mui/material";

import { EventLog } from "./EventLog";
import { LogsList } from "./LogsList";
import { RelativeTime } from "../ui/React/RelativeTime";
import { OptionSwitch } from "../ui/React/OptionSwitch";

export function EventLogRoot(): React.ReactElement {
  const [updatedOn, setUpdatedOn] = useState(EventLog.getEventLogUpdatedOn());
  const [refresh, setRefresh] = useState(true);
  const items = EventLog.getDetailedEntries();

  useEffect(() => {
    const interval = setInterval(() => {
      const logUpdate = EventLog.getEventLogUpdatedOn();
      if (refresh && updatedOn !== logUpdate) setUpdatedOn(logUpdate);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [updatedOn, refresh]);

  useEffect(() => {
    EventLog.markAsSeen();
  }, [updatedOn]);

  return (
    <Box sx={{ px: 1 }}>
      <Tooltip
        title={
          <>
            Last updated <RelativeTime initial={updatedOn} />
          </>
        }
      >
        <Typography variant="h4">Recent Game Logs</Typography>
      </Tooltip>
      <Box>
        <Box sx={{ pb: 1 }}>
          <OptionSwitch
            checked={refresh}
            onValueChanged={(newValue) => setRefresh(newValue)}
            text="Auto-refresh"
            tooltip={<>Enable or Disable auto-refresh</>}
          />
        </Box>
        <LogsList logs={items} />
      </Box>
    </Box>
  );
}
