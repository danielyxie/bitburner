/**
 * React Component for the Hacknet Node UI
 *
 * Displays general information about Hacknet Nodes
 */
import React from "react";

interface IProps {
  hasHacknetServers: boolean;
}

export function GeneralInfo(props: IProps): React.ReactElement {
  return (
    <div>
      <p className={"hacknet-general-info"}>
        The Hacknet is a global, decentralized network of machines. It is used by hackers all around the world to
        anonymously share computing power and perform distributed cyberattacks without the fear of being traced.
      </p>
      {!props.hasHacknetServers ? (
        <>
          <p className={"hacknet-general-info"}>
            {`Here, you can purchase a Hacknet Node, a specialized machine that can connect ` +
              `and contribute its resources to the Hacknet network. This allows you to take ` +
              `a small percentage of profits from hacks performed on the network. Essentially, ` +
              `you are renting out your Node's computing power.`}
          </p>
          <p className={"hacknet-general-info"}>
            {`Each Hacknet Node you purchase will passively earn you money. Each Hacknet Node ` +
              `can be upgraded in order to increase its computing power and thereby increase ` +
              `the profit you earn from it.`}
          </p>
        </>
      ) : (
        <>
          <p className={"hacknet-general-info"}>
            {`Here, you can purchase a Hacknet Server, an upgraded version of the Hacknet Node. ` +
              `Hacknet Servers will perform computations and operations on the network, earning ` +
              `you hashes. Hashes can be spent on a variety of different upgrades.`}
          </p>
          <p className={"hacknet-general-info"}>
            {`Hacknet Servers can also be used as servers to run scripts. However, running scripts ` +
              `on a server will reduce its hash rate (hashes generated per second). A Hacknet Server's hash ` +
              `rate will be reduced by the percentage of RAM that is being used by that Server to run ` +
              `scripts.`}
          </p>
        </>
      )}
    </div>
  );
}
