/**
 * Creates a dropdown (select HTML element) with server hostnames as options
 *
 * Configurable to only contain certain types of servers
 */
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import React from "react";

import { HacknetServer } from "../../Hacknet/HacknetServer";
import { GetAllServers } from "../../Server/AllServers";
import type { BaseServer } from "../../Server/BaseServer";
import { Server } from "../../Server/Server";

// TODO make this an enum when this gets converted to TypeScript
export const ServerType = {
  All: 0,
  Foreign: 1, // Hackable, non-owned servers
  Owned: 2, // Home Computer, Purchased Servers, and Hacknet Servers
  Purchased: 3, // Everything from Owned except home computer
};

interface IProps {
  purchase: () => void;
  canPurchase: boolean;
  serverType: number;
  onChange: (event: SelectChangeEvent<string>) => void;
  value: string;
}

export function ServerDropdown(props: IProps): React.ReactElement {
  /**
   * Checks if the server should be shown in the dropdown menu, based on the
   * 'serverType' property
   */
  function isValidServer(s: BaseServer): boolean {
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
  for (const server of GetAllServers().sort((a, b) => a.hostname.localeCompare(b.hostname))) {
    if (isValidServer(server)) {
      servers.push(
        <MenuItem key={server.hostname} value={server.hostname}>
          {server.hostname}
        </MenuItem>,
      );
    }
  }

  return (
    <Select
      startAdornment={
        <Button onClick={props.purchase} disabled={!props.canPurchase}>
          Buy
        </Button>
      }
      sx={{ mx: 1 }}
      value={props.value}
      onChange={props.onChange}
    >
      {servers}
    </Select>
  );
}
