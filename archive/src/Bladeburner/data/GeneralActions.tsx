import React from "react";
import { newWorkStats, WorkStats } from "../../Work/WorkStats";

interface IGeneral {
  desc: JSX.Element;
  exp: WorkStats;
}

export const GeneralActions: {
  [key: string]: IGeneral | undefined;
} = {
  Training: {
    desc: (
      <>
        Improve your abilities at the Bladeburner unit's specialized training center. Doing this gives experience for
        all combat stats and also increases your max stamina.
      </>
    ),
    exp: newWorkStats({
      strExp: 30,
      defExp: 30,
      dexExp: 30,
      agiExp: 30,
    }),
  },

  "Field Analysis": {
    desc: (
      <>
        Mine and analyze Synthoid-related data. This improves the Bladeburner unit's intelligence on Synthoid locations
        and activities. Completing this action will improve the accuracy of your Synthoid population estimated in the
        current city.
        <br />
        <br />
        Does NOT require stamina.
      </>
    ),
    exp: newWorkStats({
      hackExp: 20,
      chaExp: 20,
    }),
  },

  Recruitment: {
    desc: (
      <>
        Attempt to recruit members for your Bladeburner team. These members can help you conduct operations.
        <br />
        <br />
        Does NOT require stamina.
      </>
    ),
    exp: newWorkStats({
      chaExp: 120,
    }),
  },

  Diplomacy: {
    desc: (
      <>
        Improve diplomatic relations with the Synthoid population. Completing this action will reduce the Chaos level in
        your current city.
        <br />
        <br />
        Does NOT require stamina.
      </>
    ),
    exp: newWorkStats({
      chaExp: 120,
    }),
  },

  "Hyperbolic Regeneration Chamber": {
    desc: (
      <>
        Enter cryogenic stasis using the Bladeburner division's hi-tech Regeneration Chamber. This will slowly heal your
        wounds and slightly increase your stamina.
        <br />
        <br />
      </>
    ),
    exp: newWorkStats(),
  },
  "Incite Violence": {
    desc: (
      <>
        Purposefully stir trouble in the synthoid community in order to gain a political edge. This will generate
        additional contracts and operations, at the cost of increased Chaos.
      </>
    ),
    exp: newWorkStats({
      strExp: 10,
      defExp: 10,
      dexExp: 10,
      agiExp: 10,
      chaExp: 10,
    }),
  },
};
