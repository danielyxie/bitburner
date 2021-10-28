import React from "react";

interface IContract {
  desc: JSX.Element;
}

export const GeneralActions: {
  [key: string]: IContract | undefined;
} = {
  Training: {
    desc: (
      <>
        Improve your abilities at the Bladeburner unit's specialized training center. Doing this gives experience for
        all combat stats and also increases your max stamina.
      </>
    ),
  },

  "Field Analysis": {
    desc: (
      <>
        Mine and analyze Synthoid-related data. This improves the Bladeburner's unit intelligence on Synthoid locations
        and activities. Completing this action will improve the accuracy of your Synthoid population estimated in the
        current city.
        <br />
        <br />
        Does NOT require stamina.
      </>
    ),
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
  },
  "Incite Violence": {
    desc: (
      <>
        Purposefully stir trouble in the synthoid community in order to gain a political edge. This will generate
        additional contracts and operations, at the cost of increased Chaos.
      </>
    ),
  },
};
