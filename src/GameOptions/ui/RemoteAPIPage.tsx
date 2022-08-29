import React, { useState } from "react";
import { Button, Link, TextField, Tooltip, Typography } from "@mui/material";
import { GameOptionsPage } from "./GameOptionsPage";
import { Settings } from "../../Settings/Settings";
import { ConnectionBauble } from "./ConnectionBauble";
import { isRemoteFileApiConnectionLive, newRemoteFileApiConnection } from "../../RemoteFileAPI/RemoteFileAPI";

export const RemoteAPIPage = (): React.ReactElement => {
  const [remoteFileApiPort, setRemoteFileApiPort] = useState(Settings.RemoteFileApiPort);

  function handleRemoteFileApiPortChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setRemoteFileApiPort(Number(event.target.value) as number);
    Settings.RemoteFileApiPort = Number(event.target.value);
  }

  return (
    <GameOptionsPage title="Remote API">
      <Typography>
        These settings control the Remote API for bitburner. This is typically used to write scripts using an external
        text editor and then upload files to the home server.
      </Typography>
      <Typography>
        <Link href="https://bitburner.readthedocs.io/en/latest/remoteapi.html" target="_blank">
          Documentation
        </Link>
      </Typography>
      <ConnectionBauble isConnected={isRemoteFileApiConnectionLive} />
      <Tooltip
        title={
          <Typography>
            This port number is used to connect to a Remote API port, please ensure that it matches with your Remote API
            server port. Set to 0 to disable the feature.
          </Typography>
        }
      >
        <TextField
          InputProps={{
            startAdornment: (
              <Typography color={remoteFileApiPort > 0 && remoteFileApiPort <= 65535 ? "success" : "error"}>
                Port:&nbsp;
              </Typography>
            ),
            endAdornment: <Button onClick={newRemoteFileApiConnection}>Connect</Button>,
          }}
          value={remoteFileApiPort}
          onChange={handleRemoteFileApiPortChange}
          placeholder="12525"
        />
      </Tooltip>
    </GameOptionsPage>
  );
};
