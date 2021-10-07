import React, { useState } from "react";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GetServer, GetAllServers } from "../../Server/AllServers";
import { Server } from "../../Server/Server";
import MenuItem from "@mui/material/MenuItem";

export function Servers(): React.ReactElement {
  const [server, setServer] = useState("home");
  function setServerDropdown(event: SelectChangeEvent<string>): void {
    setServer(event.target.value as string);
  }
  function rootServer(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.hasAdminRights = true;
    s.sshPortOpen = true;
    s.ftpPortOpen = true;
    s.smtpPortOpen = true;
    s.httpPortOpen = true;
    s.sqlPortOpen = true;
    s.openPortCount = 5;
  }

  function rootAllServers(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
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
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.hackDifficulty = s.minDifficulty;
  }

  function minAllSecurity(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.hackDifficulty = s.minDifficulty;
    }
  }

  function maxMoney(): void {
    const s = GetServer(server);
    if (s === null) return;
    if (!(s instanceof Server)) return;
    s.moneyAvailable = s.moneyMax;
  }

  function maxAllMoney(): void {
    for (const s of GetAllServers()) {
      if (!(s instanceof Server)) return;
      s.moneyAvailable = s.moneyMax;
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
                  {GetAllServers().map((server) => (
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
