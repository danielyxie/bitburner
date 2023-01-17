import React from "react";

interface IOperation {
  desc: JSX.Element;
}

export const Operations: {
  [key: string]: IOperation | undefined;
} = {
  Investigation: {
    desc: (
      <>
        As a field agent, investigate and identify Synthoid populations, movements, and operations.
        <br />
        <br />
        Successful Investigation ops will increase the accuracy of your synthoid data.
        <br />
        <br />
        You will NOT lose HP from failed Investigation ops.
      </>
    ),
  },
  "Undercover Operation": {
    desc: (
      <>
        Conduct undercover operations to identify hidden and underground Synthoid communities and organizations.
        <br />
        <br />
        Successful Undercover ops will increase the accuracy of your synthoid data.
      </>
    ),
  },
  "Sting Operation": {
    desc: <>Conduct a sting operation to bait and capture particularly notorious Synthoid criminals.</>,
  },
  Raid: {
    desc: (
      <>
        Lead an assault on a known Synthoid community. Note that there must be an existing Synthoid community in your
        current city in order for this Operation to be successful.
      </>
    ),
  },
  "Stealth Retirement Operation": {
    desc: (
      <>
        Lead a covert operation to retire Synthoids. The objective is to complete the task without drawing any
        attention. Stealth and discretion are key.
      </>
    ),
  },
  Assassination: {
    desc: (
      <>
        Assassinate Synthoids that have been identified as important, high-profile social and political leaders in the
        Synthoid communities.
      </>
    ),
  },
};
