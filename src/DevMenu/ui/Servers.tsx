import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { AllServers } from "../../Server/AllServers";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { GetServerByHostname } from "../../Server/ServerHelpers";
import MenuItem from "@mui/material/MenuItem";

export function Servers(): React.ReactElement {
  const [server, setServer] = useState("home");
  function setServerDropdown(event: SelectChangeEvent<string>): void {
    setServer(event.target.value as string);
  }
  function rootServer(): void {
    const s = GetServerByHostname(server);
    if (s === null) return;
    if (s instanceof HacknetServer) return;
    s.hasAdminRights = true;
    s.sshPortOpen = true;
    s.ftpPortOpen = true;
    s.smtpPortOpen = true;
    s.httpPortOpen = true;
    s.sqlPortOpen = true;
    s.openPortCount = 5;
  }

  function rootAllServers(): void {
    for (const i in AllServers) {
      const s = AllServers[i];
      if (s instanceof HacknetServer) return;
      s.hasAdminRights = true;
      s.sshPortOpen = true;
      s.ftpPortOpen = true;
      s.smtpPortOpen = true;
      s.httpPortOpen = true;
      s.sqlPortOpen = true;
      s.openPortCount = 5;
    }
  }

  function minSecurity(): void {
    const s = GetServerByHostname(server);
    if (s === null) return;
    if (s instanceof HacknetServer) return;
    s.hackDifficulty = s.minDifficulty;
  }

  function minAllSecurity(): void {
    for (const i in AllServers) {
      const server = AllServers[i];
      if (server instanceof HacknetServer) continue;
      server.hackDifficulty = server.minDifficulty;
    }
  }

  function maxMoney(): void {
    const s = GetServerByHostname(server);
    if (s === null) return;
    if (s instanceof HacknetServer) return;
    s.moneyAvailable = s.moneyMax;
  }

  function maxAllMoney(): void {
    for (const i in AllServers) {
      const server = AllServers[i];
      if (server instanceof HacknetServer) continue;
      server.moneyAvailable = server.moneyMax;
    }
  }

  return (
    <Accordion TransitionProps={{ unmountOnExit: true }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Servers</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <Typography>Server:</Typography>
              </td>
              <td colSpan={2}>
                <Select id="dev-servers-dropdown" onChange={setServerDropdown} value={server}>
                  {Object.values(AllServers).map((server) => (
                    <MenuItem key={server.hostname} value={server.hostname}>
                      {server.hostname}
                    </MenuItem>
                  ))}
                </Select>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Root:</Typography>
              </td>
              <td>
                <Button onClick={rootServer}>Root one</Button>
              </td>
              <td>
                <Button onClick={rootAllServers}>Root all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Security:</Typography>
              </td>
              <td>
                <Button onClick={minSecurity}>Min one</Button>
              </td>
              <td>
                <Button onClick={minAllSecurity}>Min all</Button>
              </td>
            </tr>
            <tr>
              <td>
                <Typography>Money:</Typography>
              </td>
              <td>
                <Button onClick={maxMoney}>Max one</Button>
              </td>
              <td>
                <Button onClick={maxAllMoney}>Max all</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </AccordionDetails>
    </Accordion>
  );
}
