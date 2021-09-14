import React, { useState } from "react";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Button } from "../../ui/React/Button";
import { Select } from "../../ui/React/Select";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { AllServers } from "../../Server/AllServers";
import { HacknetServer } from "../../Hacknet/HacknetServer";
import { GetServerByHostname } from "../../Server/ServerHelpers";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import ReplyAllIcon from "@material-ui/icons/ReplyAll";
import ReplyIcon from "@material-ui/icons/Reply";
import InputLabel from "@material-ui/core/InputLabel";

const bigNumber = 1e12;

interface IProps {
  player: IPlayer;
}

export function Servers(props: IProps): React.ReactElement {
  const [server, setServer] = useState("home");
  function setServerDropdown(event: React.ChangeEvent<{ value: unknown }>): void {
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
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <h2>Servers</h2>
      </AccordionSummary>
      <AccordionDetails>
        <table>
          <tbody>
            <tr>
              <td>
                <span className="text">Server:</span>
              </td>
              <td colSpan={2}>
                <Select id="dev-servers-dropdown" className="dropdown" onChange={setServerDropdown} value={server}>
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
                <span className="text">Root:</span>
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
                <span className="text">Security:</span>
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
                <span className="text">Money:</span>
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
