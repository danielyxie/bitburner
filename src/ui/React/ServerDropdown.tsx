/**
 * Creates a dropdown (select HTML element) with server hostnames as options
 *
 * Configurable to only contain certain types of servers
 */
import React from "react";
import { AllServers } from "../../Server/AllServers";
import { Server } from "../../Server/Server";

import { HacknetServer } from "../../Hacknet/HacknetServer";

// TODO make this an enum when this gets converted to TypeScript
export const ServerType = {
  All: 0,
  Foreign: 1, // Hackable, non-owned servers
  Owned: 2, // Home Computer, Purchased Servers, and Hacknet Servers
  Purchased: 3, // Everything from Owned except home computer
};

interface IProps {
  serverType: number;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  style: any;
}

export function ServerDropdown(props: IProps): React.ReactElement {
  /**
   * Checks if the server should be shown in the dropdown menu, based on the
   * 'serverType' property
   */
  function isValidServer(s: Server | HacknetServer): boolean {
    const purchased = s instanceof Server && s.purchasedByPlayer;
    const type = props.serverType;
    switch (type) {
      case ServerType.All:
        return true;
      case ServerType.Foreign:
        return s.hostname !== "home" && !purchased;
      case ServerType.Owned:
        return purchased || s instanceof HacknetServer || s.hostname === "home";
      case ServerType.Purchased:
        return purchased || s instanceof HacknetServer;
      default:
        console.warn(`Invalid ServerType specified for ServerDropdown component: ${type}`);
        return false;
    }
  }

  const servers = [];
  for (const serverName in AllServers) {
    const server = AllServers[serverName];
    if (isValidServer(server)) {
      servers.push(
        <option key={server.hostname} value={server.hostname}>
          {server.hostname}
        </option>,
      );
    }
  }

  return (
    <select className={"dropdown"} onChange={props.onChange} style={props.style}>
      {servers}
    </select>
  );
}
