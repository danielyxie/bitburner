/**
 * Creates a dropdown (select HTML element) with server hostnames as options
 *
 * Configurable to only contain certain types of servers
 */
import React from "react";
import { AllServers } from "../../Server/AllServers";

import { HacknetServer } from "../../Hacknet/HacknetServer";

// TODO make this an enum when this gets converted to TypeScript
export const ServerType = {
  All: 0,
  Foreign: 1, // Hackable, non-owned servers
  Owned: 2, // Home Computer, Purchased Servers, and Hacknet Servers
  Purchased: 3, // Everything from Owned except home computer
};

export class ServerDropdown extends React.Component {
  /**
   * Checks if the server should be shown in the dropdown menu, based on the
   * 'serverType' property
   */
  isValidServer(s) {
    const type = this.props.serverType;
    switch (type) {
      case ServerType.All:
        return true;
      case ServerType.Foreign:
        return s.hostname !== "home" && !s.purchasedByPlayer;
      case ServerType.Owned:
        return (
          s.purchasedByPlayer ||
          s instanceof HacknetServer ||
          s.hostname === "home"
        );
      case ServerType.Purchased:
        return s.purchasedByPlayer || s instanceof HacknetServer;
      default:
        console.warn(
          `Invalid ServerType specified for ServerDropdown component: ${type}`,
        );
        return false;
    }
  }

  /**
   * Given a Server object, creates a Option element
   */
  renderOption(s) {
    return (
      <option key={s.hostname} value={s.hostname}>
        {s.hostname}
      </option>
    );
  }

  render() {
    const servers = [];
    for (const serverName in AllServers) {
      const server = AllServers[serverName];
      if (this.isValidServer(server)) {
        servers.push(this.renderOption(server));
      }
    }

    return (
      <select
        className={"dropdown"}
        onChange={this.props.onChange}
        style={this.props.style}
      >
        {servers}
      </select>
    );
  }
}
