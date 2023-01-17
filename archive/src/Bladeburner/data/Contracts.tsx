import React from "react";

interface IContract {
  desc: JSX.Element;
}

export const Contracts: {
  [key: string]: IContract | undefined;
} = {
  Tracking: {
    desc: (
      <>
        Identify and locate Synthoids. This contract involves reconnaissance and information-gathering ONLY. Do NOT
        engage. Stealth is of the utmost importance.
        <br />
        <br />
        Successfully completing Tracking contracts will slightly improve your Synthoid population estimate for whatever
        city you are currently in.
      </>
    ),
  },
  "Bounty Hunter": {
    desc: (
      <>
        Hunt down and capture fugitive Synthoids. These Synthoids are wanted alive.
        <br />
        <br />
        Successfully completing a Bounty Hunter contract will lower the population in your current city, and will also
        increase its chaos level.
      </>
    ),
  },
  Retirement: {
    desc: (
      <>
        Hunt down and retire (kill) rogue Synthoids.
        <br />
        <br />
        Successfully completing a Retirement contract will lower the population in your current city, and will also
        increase its chaos level.
      </>
    ),
  },
};
