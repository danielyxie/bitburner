/**
 * React Component for the Hacknet Node UI
 *
 * Displays general information about Hacknet Nodes
 */
import React from "react";
import Typography from "@mui/material/Typography";

interface IProps {
  hasHacknetServers: boolean;
}

export function GeneralInfo(props: IProps): React.ReactElement {
  return (
    <>
      <Typography>
        The Hacknet is a global, decentralized network of machines. It is used by hackers all around the world to
        anonymously share computing power and perform distributed cyberattacks without the fear of being traced.
      </Typography>
      {!props.hasHacknetServers ? (
        <>
          <Typography>
            {`Here, you can purchase a Hacknet Node, a specialized machine that can connect ` +
              `and contribute its resources to the Hacknet network. This allows you to take ` +
              `a small percentage of profits from hacks performed on the network. Essentially, ` +
              `you are renting out your Node's computing power.`}
          </Typography>
          <Typography>
            {`Each Hacknet Node you purchase will passively earn you money. Each Hacknet Node ` +
              `can be upgraded in order to increase its computing power and thereby increase ` +
              `the profit you earn from it.`}
          </Typography>
        </>
      ) : (
        <>
          <Typography>
            {`Here, you can purchase a Hacknet Server, an upgraded version of the Hacknet Node. ` +
              `Hacknet Servers will perform computations and operations on the network, earning ` +
              `you hashes. Hashes can be spent on a variety of different upgrades.`}
          </Typography>
          <Typography>
            {`Hacknet Servers can also be used as servers to run scripts. However, running scripts ` +
              `on a server will reduce its hash rate (hashes generated per second). A Hacknet Server's hash ` +
              `rate will be reduced by the percentage of RAM that is being used by that Server to run ` +
              `scripts.`}
          </Typography>
        </>
      )}
    </>
  );
}
